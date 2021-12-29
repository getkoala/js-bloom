install:
	yarn
	bundle
.PHONY: install

test:
	bundle exec rake test
	yarn test
.PHONY: test

build:
	yarn esbuild --bundle ./js/index.js --outfile=browser.dist.js --minify --target=chrome58,firefox57,safari11,edge16 --format=esm
	yarn esbuild --bundle ./js/index.js --outfile=node.dist.js --minify --target=node16 --format=cjs
.PHONY: prod.min.js

bench:
	@bundle exec ruby ./benchmark/bench.rb
.PHONY: bench