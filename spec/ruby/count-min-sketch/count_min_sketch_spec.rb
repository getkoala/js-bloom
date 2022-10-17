require 'spec_helper'
require 'yaml'

describe JsBloom::CountMinSketch do
  it 'counts occurrences' do
    cms = JsBloom::CountMinSketch.new

    cms.add('netto')
    cms.add('netto')
    cms.add('matt')

    expect(cms.count('netto')).to be(2)
    expect(cms.count('matt')).to be(1)
    expect(cms.count('tido')).to be(0)
  end

  it 'supports setting the counts ahead of time' do
    cms = JsBloom::CountMinSketch.new

    cms.add('netto', 32)
    cms.add('matt')

    expect(cms.count('netto')).to be(32)
    expect(cms.count('matt')).to be(1)
    expect(cms.count('tido')).to be(0)
  end

  it 'supports decrementing a count' do
    cms = JsBloom::CountMinSketch.new

    cms.add('netto', 10)
    expect(cms.count('netto')).to be(10)

    cms.add('netto', 10)
    expect(cms.count('netto')).to be(20)

    cms.add('netto', -5)
    expect(cms.count('netto')).to be(15)
  end

  it 'supports replacing a count' do
    cms = JsBloom::CountMinSketch.new

    cms.add('greater_than', 10)
    cms.set_count('greater_than', 2)
    expect(cms.count('greater_than')).to be(2)

    cms.add('less_than', 10)
    cms.set_count('less_than', 20)
    expect(cms.count('less_than')).to be(20)

    cms.set_count('first_time', 5)
    expect(cms.count('first_time')).to be(5)

    cms.add('same', 25)
    cms.set_count('same', 25)
    expect(cms.count('same')).to be(25)
  end
end
