require "spec_helper"
require 'csv'

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

  it "should serialize large blue filters" do
    companies = CSV.read('./spec/fixtures/companies.csv').map do |row|
      JSON.parse(row[0])
    end

    bloom = JsBloom.build(companies.size * 10, 0.001)

    companies.each do |company|
      bloom.add(company['name'])
    end

    File.write('./spec/fixtures/bloom-companies.json', bloom.to_json)

    bloom_json = JsBloom.new JSON.parse(File.read('./spec/fixtures/bloom-companies.json'))

    companies.each do |company|
      expect(bloom_json.test company['name']).to be true
    end

    expect(bloom_json.test 'Rando').to be false
    expect(bloom_json.test 'Random Co').to be false
    expect(bloom_json.test 'Does not exist').to be false
    expect(bloom_json.test '404').to be false

    config = bloom.to_json
    gzipped = Zlib::Deflate.deflate(config)

    expect(config.bytesize).to be <= 26_000
    expect(gzipped.bytesize).to be <= 8_000
  end
end