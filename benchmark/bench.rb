require "js-bloom"
require "js-bloom/count_min_sketch"
require 'csv'
require 'benchmark'
require 'bloomfilter-rb'

companies = CSV.read('./spec/fixtures/companies.csv').map do |row|
  JSON.parse(row[0])
end

bloom = JsBloom.new(seed: 1, hashes: 2, size: companies.size * 50)
native = BloomFilter::Native.new(size: companies.size * 50, hashes: 2, seed: 1)
cms = JsBloom::CountMinSketch.new(size: companies.size * 50, hashes: 2)

n = 10

Benchmark.bmbm(20) do |x|
  x.report("bloom") do
    n.times do 
      companies.each do |company|
        bloom.add_single(company['name'])
      end
    end
  end

  x.report("cms") do
    n.times do 
      companies.each do |company|
        cms.add(company['name'])
      end
    end
  end

  x.report("native") do
    n.times do 
      companies.each do |company|
        native.insert(company['name'])
      end
    end
  end
end

config = bloom.to_json
gzipped = Zlib::Deflate.deflate(config)

puts "BloomFilter Config size: #{config.bytesize}"
puts "BloomFilter Config Gzipped size: #{gzipped.bytesize}"

puts "\n\n\n"

config = cms.to_json
gzipped = Zlib::Deflate.deflate(config)

puts "CMS Config size: #{config.bytesize}"
puts "CMS Config Gzipped size: #{gzipped.bytesize}"

puts "\n\nRuby"
bloom.stats

puts "\n\n\nNative"
native.stats

companies.each do |company|
  raise if company['name'] && bloom.test_single(company['name'] + '---test')
  raise unless bloom.test_single(company['name'])

  raise if company['name'] && native.include?(company['name'] + '---test')
  raise unless native.include?(company['name'])

  raise if company['name'] && cms.count(company['name'] + '---test') > 0
  raise unless cms.count(company['name']) > 0
end