BOOTSTRAP_JS_DIR = ./bootstrap/js/
PUBLIC_BOOTSTRAP_JS_DIR = ./js/libs/bootstrap/
LESSC = ./node_modules/.bin/lessc
PRIVATE_LESS_DIR = ./less/
PUBLIC_CSS_DIR = ./css/

# Copies over Backbone JavaScript files.
# Compiles the LESS code to CSS.
gh-pages:
	rm -f ${PUBLIC_BOOTSTRAP_JS_DIR}*
	cp -f ${BOOTSTRAP_JS_DIR}*.js ${PUBLIC_BOOTSTRAP_JS_DIR}
	${LESSC} ${PRIVATE_LESS_DIR}style.less > ${PUBLIC_CSS_DIR}style.css

.PHONY: gh-pages
