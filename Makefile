install:
	yarn
	bundle
.PHONY: install

test:
	yarn test
	bundle exec rake test
.PHONY: test