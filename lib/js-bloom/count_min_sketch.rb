class JsBloom
  class CountMinSketch
    # Number.MAX_SAFE_INTEGER in the browser
    # We need this in order to safely serialize to JSON
    MAX_FIXNUM = 9_007_199_254_740_991 - 1

    DEFAULTS = { size: 100, hashes: 4 }

    attr_reader :k, :m, :data

    def initialize(options = {})
      options = options.transform_keys(&:to_sym)

      @options = DEFAULTS.merge(options)
      @k = @options[:hashes]
      @m = @options[:size]

      @data = @options[:data] || Array.new(k) { Array.new(m, 0) }
      @seeds = @options[:seeds] || Array.new(k) { rand(MAX_FIXNUM + 1) }
    end

    def count(x)
      add(x, 0)
    end

    def add(x, n = 1)
      min_count = Float::INFINITY

      @seeds.each_with_index do |s, i|
        hash = Zlib.crc32("#{x}:#{i + s}")

        j = hash % @m
        cnt = @data[i][j] += n

        min_count = cnt if cnt < min_count
      end

      min_count
    end

    def set_count(x, n)
      add(x, n - count(x))
    end

    def merge(another)
      merged_data = @data.each_with_index.map do |row, i|
        another_row = another.data[i]
        row = row.each_with_index.map do |count, j|
          row[j] + another_row[j]
        end
      end

      self.class.new(data: merged_data, seeds: @seeds, size: @m, hashes: @k)
    end

    def to_hash
      @options.merge(data: @data, seeds: @seeds)
    end

    def to_json(*_args)
      JSON.generate(to_hash)
    end
  end
end
