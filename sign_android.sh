#!/bin/bash
#USE THIS COMMANDS TO GENERATE AND SIGN THE ANDROID BUNDLE
ionic cordova build android --prod --release
cd platforms/android
./gradlew bundle
cd ..
cd ..
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./keys/my-release-key.keystore ./platforms/android/app/build/outputs/bundle/release/app.aab alias_name
