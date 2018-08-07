# Introduction to the FileMaker Data API - Native application demo #

This code generates native iOS or Android app to interact with the FileMaker Data API and upload location information and a photo captured from the camera.

## Installation ##

This is a NativeScript codebase. You will need to have the NativeScript command line tool (tns) installed (along with all its dependencies).

See the [NativeScript installation documentation](https://docs.nativescript.org/start/quick-setup) for details on getting the dependencies set up.

You can use the [demo DB on my fms if you wish](fmp://fms.msdev.co.uk/ITG01Demo.fmp12) (username Admin, password Admin, switch to the Images layout) 

To connect the app to your own FMS you need to modify the settings in /app/home/home.js.

Once you have everything set up you'll need to run three commands 
 - `tns install` to install all of the dependencies
 - `tns platform add <platform>` to add the platofrm tools for either iOS or Android (e.g. `tns platform add android`)
 - `tns run <platform>` (e.g. `tns run ios`) which will (should) launch the appropriate emulator and run the app.


## Contact Details ##
Steve Winter  
Matatiro Solutions  
steve@msdev.co.uk