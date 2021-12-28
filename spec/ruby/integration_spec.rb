require "spec_helper"

describe "Integration" do
  it "should serialize a filter to be used in JS" do
    bloom = JsBloom.new

    bloom.add 'matt'
    bloom.add 'netto'
    bloom.add 'bruna'

    File.write('./spec/fixtures/bloom.json', bloom.to_json)

    bloom_json = JsBloom.new JSON.parse(File.read('./spec/fixtures/bloom.json'))

    expect(bloom_json.test 'matt').to be true
    expect(bloom_json.test 'netto').to be true
    expect(bloom_json.test 'bruna').to be true
  end
end