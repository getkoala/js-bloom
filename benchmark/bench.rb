require "js-bloom"
require 'csv'
require 'benchmark'

companies = CSV.read('./spec/fixtures/companies.csv').map do |row|
  JSON.parse(row[0])
end

bloom = JsBloom.new(seed: 1, hashes: 10, size: 144_000)
bloom_single = JsBloom.new(seed: 1, hashes: 10, size: 144_000)

n = 10

Benchmark.bm(20) do |x|
  x.report("add") do
    n.times do 
      companies.each do |company|
        bloom.add(company['name'])
      end
    end
  end

  x.report("add_single") do
    n.times do 
      companies.each do |company|
        bloom_single.add_single(company['name'])
      end
    end
  end

  x.report("check") do
    n.times do
      companies.each do |company|
        raise unless bloom.test(company['name'])
      end
    end
  end

  x.report("check_single") do
    n.times do
      companies.each do |company|
        raise unless bloom_single.test_single(company['name'])
      end
    end
  end
end