require 'spec_helper'

RSpec::Expectations.configuration.on_potential_false_positives = :nothing

describe JsBloom::BitArray do
  describe '#initialize' do
    it 'should require a size' do
      expect { JsBloom::BitArray.new }.to raise_error(ArgumentError)
      expect { JsBloom::BitArray.new(100) }.not_to raise_error(ArgumentError)
    end
    it 'should take an optional bit field' do
      field = [0, 0, 0, 2]
      ba = JsBloom::BitArray.new(100, field)
      expect(ba.field).to be == field
    end
  end

  describe '#add' do
    it 'should set the bit to 1' do
      ba = JsBloom::BitArray.new(10)
      ba.add(9)
      expect(ba.to_s).to be == '0000000001'
    end
  end

  describe '#remove' do
    it 'should set the bit to 0' do
      ba = JsBloom::BitArray.new(10)
      ba.add(9)
      ba.remove(9)
      expect(ba.to_s).to be == '0000000000'
    end
  end

  describe '#get' do
    it 'should return the bit set' do
      ba = JsBloom::BitArray.new(10)
      ba.add(9)
      expect(ba.get(9)).to be == 1
      expect(ba.get(8)).to be == 0
    end
  end

  describe '#to_s' do
    it 'should output the bit string' do
      ba = JsBloom::BitArray.new(10)
      ba.add(3)
      ba.add(9)
      expect(ba.to_s).to be == '0001000001'
    end
  end
end
