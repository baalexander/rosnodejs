EXAMPLE = example/how_to.js
TESTS = test/*.js

# Runs and prints out How To examples as HTML.
example:
	@./node_modules/.bin/mocha \
		--reporter doc \
		$(EXAMPLE)

# Runs unit tests.
test:
	@./node_modules/.bin/mocha \
		$(TESTS)

# Ignores directories with the same name as targets.
.PHONY: example test

