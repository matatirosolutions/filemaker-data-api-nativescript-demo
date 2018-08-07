var dialog = require("ui/dialogs");
var geolocation = require("nativescript-geolocation");
var FileSystem = require("file-system");
var view = require("ui/core/view");

class ImageCaptureManager {

    constructor(FileMakerDataAPI, layout) {
        this.api = FileMakerDataAPI;
        this.layout = layout;
        this.fmReady = false;


        this.api.fetchToken(this.fmReadyCallback.bind(this), this.constructor.handleError);
    }

    saveAndUpload(image, page) {
        this.page = page;
        const separator = FileSystem.path.separator;
        let folder = FileSystem.knownFolders.documents();
        let path = folder.path + separator + 'image.png';
        image.saveToFile(path, 'png');

        this.imagePath = path;
        this.createRecord();
    }

    createRecord() {
        let data = {
            'fieldData': {}
        };
        if(undefined !== this.location) {
            data.fieldData = {
                'Latitude': this.location.latitude,
                'Longitude': this.location.longitude
            }
        }
        this.api.performRequest(
            'POST',
            this.layout + '/records',
            data,
            this.receiveFMRecord.bind(this),
            this.constructor.handleError
        );
    }

    receiveFMRecord(resp) {
        this.api.uploadContainerContent(
            this.layout + '/records/'+ resp.response.recordId +'/containers/Image/1',
            this.imagePath,
            this.uploadComplete.bind(this),
            this.constructor.handleError
        );
    }

    uploadComplete(resp) {
        dialog.alert("Huzzah! Your image is safely in the hands of FileMaker.");
        this.page.bindingContext = { isLoading: false };
    }

    getLocation() {
        let that = this;
        geolocation.getCurrentLocation()
            .then((location) => {
                that.location = location;
            })
            .catch((error) => {
                console.log('Unable to get location with error ' + error);
            });
    }

    fmReadyCallback() {
        this.fmReady = true;
    }

    static handleError(error) {
        console.info(error);
        dialog.alert("An error has occurred! Are you sure you have a network connection?");
    }
}

module.exports = ImageCaptureManager;