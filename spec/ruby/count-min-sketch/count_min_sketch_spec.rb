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
end