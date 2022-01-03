install:
	yarn
	bundle
.PHONY: install

test:
	bundle exec rake test
	yarn test
.PHONY: test

build:
	yarn build
.PHONY: build

bench:
	@bundle exec ruby ./benchmark/bench.rb
.PHONY: bench