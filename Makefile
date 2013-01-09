test:
	@./node_modules/.bin/mocha ./test/node/test-*.js

test-w:
	@./node_modules/.bin/mocha -w ./test/node/test-*.js

.PHONY: test test-w
