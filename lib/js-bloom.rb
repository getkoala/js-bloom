require 'js-bloom/bitarray'
require 'json'
require 'zlib'

class JsBloom
  DEFAULTS = { size: 100, hashes: 4, seed: Time.new.to_i, bits: nil }

  attr_accessor :bits

  def self.build(capacity, error_rate, seed = Time.new.to_i)
    JsBloom.new size: size_for(capacity, error_rate), hashes: hashes_for(capacity, error_rate), seed: seed
  end

  def self.size_for(capacity, error_rate)
    (capacity * Math.log(error_rate) / Math.log(1.0 / 2**Math.log(2))).ceil
  end

  def self.hashes_for(capacity, error_rate)
    (Math.log(2) * size_for(capacity, error_rate) / capacity).round
  end

  def initialize(options = {})
    items = options.delete(:items)
    @options = merge_defaults_with(options)
    @bits = BitArray.new(@options[:size], @options[:bits])
    add(items) if items
  end

  def add(keys)
    [keys].flat_map do |key|
      indexes_for(key).each { |index| @bits.add(index) }
    end
    nil
  end

  def test(keys)
    [keys].flat_map do |key|
      indexes_for(key).each do |index|
        return false if @bits.get(index) == 0
      end
    end
    true
  end

  def add_single(key)
    indexes_for(key).each { |i| @bits.add(i) }
    nil
  end

  def test_single(key)
    indexes_for(key).each do |index|
      return false if @bits.get(index) == 0
    end

    true
  end

  def clear
    @bits = BitArray.new(@options[:size])
  end

  def to_hash
    @options.merge({ bits: @bits.field })
  end

  def to_json(*_args)
    JSON.generate to_hash
  end

  def size
    @bits.set_bits
  end

  def stats
    fp = ((1.0 - Math.exp(-(@options[:hashes] * size).to_f / @options[:size]))**@options[:hashes]) * 100
    printf "Number of filter buckets (m): %d\n" % @options[:size]
    printf "Number of filter elements (n): %d\n" % size
    printf "Number of filter hashes (k) : %d\n" % @options[:hashes]
    printf "Predicted false positive rate = %.2f%\n" % fp
  end

  private

  def indexes_for(key)
    count = @options[:hashes]
    seed = @options[:seed]
    size = @options[:size]
    i = 0
    out = Array.new(count)

    while true
      break if i >= count

      out[i] = Zlib.crc32("#{key}:#{i + seed}") % size
      i += 1
    end

    out
  end

  def merge_defaults_with(options)
    DEFAULTS.merge(Hash[options.map { |k, v| [k.to_sym, v] }])
  end
end
