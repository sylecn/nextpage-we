#!/bin/sh
script_path=`realpath "$0"`
dir=`dirname "$script_path"`
cd "$dir"

make firefox
cd build/firefox/
web-ext run --target=firefox-android --android-device 99211FFBA006CW
