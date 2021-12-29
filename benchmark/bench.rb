require "js-bloom"
require 'csv'
require 'benchmark'

companies = CSV.read('./spec/fixtures/companies.csv').map do |row|
  JSON.parse(row[0])
end

bloom = JsBloom.new(seed: 1, hashes: 2, size: companies.size * 50)
n = 10

Benchmark.bmbm(20) do |x|
  x.report("add") do
    n.times do 
      companies.each do |company|
        bloom.add_single(company['name'])
      end
    end
  end
end

config = bloom.to_json
gzipped = Zlib::Deflate.deflate(config)

puts "Config size: #{config.bytesize}"
puts "Config Gzipped size: #{gzipped.bytesize}"

bloom.stats

companies.each do |company|
  raise if company['name'] && bloom.test_single(company['name'] + '---test')
  raise unless bloom.test_single(company['name'])
end