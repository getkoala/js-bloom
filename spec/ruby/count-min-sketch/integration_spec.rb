require 'spec_helper'

describe 'CountMinSketch integration' do
  it "simple" do
    cms = JsBloom::CountMinSketch.new

    cms.add 'matt'
    cms.add 'netto'
    cms.add 'bruna'

    File.write('./spec/fixtures/cms-simple.json', cms.to_json)
  end

  it "should serialize a filter to be used in JS" do
    cms = JsBloom::CountMinSketch.new

    cms.add 'matt', 5
    cms.add 'netto'
    cms.add 'bruna'

    expect(cms.count 'matt').to be 5
    expect(cms.count 'netto').to be 1
    expect(cms.count 'bruna').to be 1

    File.write('./spec/fixtures/cms.json', cms.to_json)

    cms_json = JsBloom::CountMinSketch.new JSON.parse(File.read('./spec/fixtures/cms.json'))

    expect(cms_json.count 'matt').to be 5
    expect(cms_json.count 'netto').to be 1
    expect(cms_json.count 'bruna').to be 1
  end

  it "should serialize large cms" do
    companies = CSV.read('./spec/fixtures/companies.csv').map do |row|
      JSON.parse(row[0])
    end

    cms = JsBloom::CountMinSketch.new(hashes: 3, size: companies.size * 15)
    company_names = companies.map { |c| c['name'] }.uniq

    company_names.each do |company|
      cms.add(company, 1)
    end

    company_names.each do |company|
      expect(cms.count company).to be 1
    end

    company_names.each do |company|
      expect(cms.count "#{company}--fake").to be 0
    end

    File.write('./spec/fixtures/cms-companies.json', cms.to_json)

    cms_json = JsBloom::CountMinSketch.new JSON.parse(File.read('./spec/fixtures/cms-companies.json'))

    company_names.each do |company|
      expect(cms_json.count company).to be 1
    end

    expect(cms_json.count 'Rando').to be 0
    expect(cms_json.count 'Random Co').to be 0
    expect(cms_json.count 'Does not exist').to be 0
    expect(cms_json.count '404').to be 0

    config = cms.to_json
    gzipped = Zlib::Deflate.deflate(config)

    expect(config.bytesize).to be <= 91_000
    expect(gzipped.bytesize).to be <= 2_800
  end
end