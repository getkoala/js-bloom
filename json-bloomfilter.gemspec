# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "json-bloomfilter/version"

Gem::Specification.new do |s|
  s.name        = "js-bloom"
  s.version     = JsonBloomfilter::VERSION
  s.authors     = ["Netto Farah"]
  s.email       = ["netto@koala.live"]
  s.homepage    = "http://github.com/koala-live/js-bloom"
  s.summary     = "A bloomfilter implementation in both Ruby and Javascript."
  s.description = "A bloomfilter implementation in both Ruby and Javascript that can be serialised to and loaded from JSON. Very useful when needing to train a bloom filter in one language and using it in the other."
  s.license     = 'MIT'
  s.required_ruby_version = '>= 3.0.1'

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]

  s.add_development_dependency 'rake'
  s.add_development_dependency 'rspec'
end
