var camera = require("nativescript-camera");
var imageSource = require('tns-core-modules/image-source');
var FileMakerDataAPI = require('../shared/FileMakerDataAPI');
var ImageCaptureManager = require('../shared/ImageCaptureManager');
var view = require("ui/core/view");

var imageModule = require("ui/image");


let fmConnection = new FileMakerDataAPI({
    'server': 'https://fms.msdev.co.uk',
    'username': 'DataAPIFullAccess',
    'password': 'Qwerty1!',
    'database': 'ITG01Demo',
});

let page;
let capture = new ImageCaptureManager(fmConnection, 'Images', page);


exports.takePhoto = function()
{
    console.info('click');
    page.bindingContext = { isLoading: true, progress: 45 };
    capture.getLocation();
    camera.requestPermissions();
    camera.takePicture({saveToGallery: false})
        .then(picture => {
            imageSource.fromAsset(picture).then(image => {
                let imageContainer = view.getViewById(page, "img");
                imageContainer.imageSource = image;

                capture.saveAndUpload(image, page);
            });
        }).catch(function (err) {
            console.log("Error -> " + err.message);
        });
};

exports.onPageLoaded = function(args) {
    page = args.object;
    page.bindingContext = { isLoading: false, progress: 0 };
};


