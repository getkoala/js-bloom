class JsBloom
  class BitArray
    attr_reader :size, :field

    include Enumerable

    ELEMENT_WIDTH = 32

    def initialize(size, field = nil)
      @size = size
      @field = field || Array.new(((size - 1) / ELEMENT_WIDTH) + 1, 0)
    end

    def add(position)
      @field[position / ELEMENT_WIDTH] |= 1 << (position % ELEMENT_WIDTH)
    end

    def remove(position)
      if (@field[position / ELEMENT_WIDTH]) & (1 << (position % ELEMENT_WIDTH)) != 0
        @field[position / ELEMENT_WIDTH] ^= 1 << (position % ELEMENT_WIDTH)
      end
    end

    # Read a bit (1/0)
    def get(position)
      @field[position / ELEMENT_WIDTH] & 1 << (position % ELEMENT_WIDTH) > 0 ? 1 : 0
    end

    # Iterate over each bit
    def each
      @size.times { |position| yield get(position) }
    end

    def set_bits
      count = 0
      each do |bit|
        count += 1 if bit == 1
      end
      count
    end

    # Returns the field as a string like "0101010100111100," etc.
    def to_s
      inject('') { |a, b| a + b.to_s }
    end
  end
end
