all: firefox chrome
firefox: check
	@echo "building for firefox..."
	cd src && ln -f manifest-firefox.json manifest.json && zip -r -x manifest-chrome.json -FS ../nextpage-firefox.zip *
	mkdir -p build/firefox
	unzip -d build/firefox -q -o nextpage-firefox.zip
chrome: check
	@echo "building for chrome..."
	cd src && ln -f manifest-chrome.json manifest.json && zip -r -x manifest-firefox.json -FS ../nextpage-chrome.zip *
	mkdir -p build/chrome
	unzip -d build/chrome -q -o nextpage-chrome.zip
check:
	@echo "running eslint..."
	@./node_modules/.bin/eslint src/*.js    # see also ./.eslintrc.js
	@echo "running misc/test-regexp.js..."
	@if which node >/dev/null 2>/dev/null; then node misc/test-regexp.js; node misc/test-functions.js; else jjs misc/test-regexp.js; jjs misc/test-functions.js; fi
.PHONY: all firefox chrome check
