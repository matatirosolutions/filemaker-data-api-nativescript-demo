var fetchModule = require("tns-core-modules/fetch");
var base64 = require('base-64');
var utf8 = require('utf8');
var BackgroundHttp = require("nativescript-background-http");

class FileMakerDataAPI {

    constructor(config) {
        this.config = config
    }

    fetchToken(successCallback, errorCallback) {
        let that = this;

        fetchModule.fetch(this.config.server + '/fmi/data/v1/databases/' + this.config.database + '/sessions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + base64.encode(utf8.encode(that.config.username + ":" + that.config.password))
            }
        })  .then((response) => response.json())
            .then((resp) => {
                    that.validateResponse(resp);
                    that.token = resp.response.token;
                }).catch((err) => {
                    errorCallback(err);
            }).catch((error) => {
                errorCallback(error);
            });
    }

    performRequest(method, urlSuffix, data, successCallback, errorCallback) {
        let that = this;

        fetchModule.fetch(this.config.server + '/fmi/data/v1/databases/' + this.config.database + '/layouts/' + urlSuffix, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            },
            body: JSON.stringify(data)
        })  .then((response) => response.json())
                .then((resp) => {
                    that.validateResponse(resp);
                    successCallback(resp);
                }).catch((err) => {
                    errorCallback(err);
                })
            .catch((error) => {
                errorCallback(error);
            });
    }

    uploadContainerContent(urlSuffix, filePath, successCallback, errorCallback) {
        let session = BackgroundHttp.session("file-upload"),
            request = {
                url: this.config.server + '/fmi/data/v1/databases/' + this.config.database + '/layouts/' + urlSuffix,
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + this.token
                },
            },
            params = [{
                'name': 'upload',
                'filename': filePath
            }];

        let task = session.multipartUpload(params, request);
        task.on("complete", (event) => {
            successCallback();
        });
        task.on("error", event => {
            errorCallback(event.eventName);
        });
        task.on('progress', event => {
            console.info(event);
        });
    }

    validateResponse(resp) {
        var msg = resp.messages[0];
        if(undefined === msg) {
            throw Error('There is no message in the response. Check the URL.');
        }
        if('0' !== msg.code) {
            throw Error(msg.message);
        }
    }
}

module.exports = FileMakerDataAPI;