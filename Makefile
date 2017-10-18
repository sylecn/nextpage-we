build: check
	cd src && zip -r -FS ../nextpage.zip *
check:
	./node_modules/.bin/eslint src/*.js
.PHONY: build check
