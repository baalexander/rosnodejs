BOOTSTRAP_JS_DIR = ./bootstrap/js/
PUBLIC_BOOTSTRAP_JS_DIR = ./js/libs/bootstrap/
LESSC = ./node_modules/.bin/lessc
PUBLIC_CSS_DIR = ./css/

gh-pages:
	rm -f ${PUBLIC_BOOTSTRAP_JS_DIR}*
	cp -f ${BOOTSTRAP_JS_DIR}*.js ${PUBLIC_BOOTSTRAP_JS_DIR}
	${LESSC} ${PUBLIC_CSS_DIR}style.less > ${PUBLIC_CSS_DIR}style.css

.PHONY: gh-pages
