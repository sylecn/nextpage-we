#!/bin/sh
script_path=`realpath "$0"`
dir=`dirname "$script_path"`
cd "$dir"

make firefox
cd build/firefox/
ANDROID_DEVICE_ID=${ANDROID_DEVICE_ID:-99211FFBA006CW}
web-ext run --target=firefox-android --android-device "$ANDROID_DEVICE_ID"
