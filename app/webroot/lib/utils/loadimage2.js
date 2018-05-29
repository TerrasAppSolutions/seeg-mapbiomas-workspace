function ImageLoad() {
    this.requests = [];
    this.progress = 0
    this.p = 0;
}

ImageLoad.prototype.restart = function() {
    this.requests = [];
    this.progress = 0
    this.p = 0;
}

ImageLoad.prototype.newImage = function(imageURI, callback_load, callback_progress) {
    var self = this;
    var _imageElement = document.createElement("img");
    var _uri = imageURI;
    var _request = new XMLHttpRequest();

    _request.onprogress = function(e) {
        if (e.lengthComputable) {
            var val = e.loaded / e.total * 100;
            self.progress = self.progress + val;
            self.p = (self.progress) / (self.requests.length * 100);
            if (callback_progress) {
                callback_progress();
            }

        }
    };

    _request.onload = function() {
        _imageElement.src = "data:image/png;base64," + self.arrayBufferToBase64(this.response);
        if (_imageElement.complete) {
            if (_imageElement.width && _imageElement.height) {
                callback_load({
                    img: _imageElement
                });
                return;
            }
            callback_load({
                err: '429'
            });
            return;
        }
    };

    var queue = {
        imageElement: _imageElement,
        uri: _uri,
        request: _request
    }

    _request.onerror = function(data) {
        console.log('onerror');
        self.loadImage(queue);
    }

    // _request.onloadend = function(e){
    //     self.progress = 0;
    //     delete self.requests[self.requests.indexOf(queue)];
    //
    //     console.log(data);
    // }

    this.loadImage(queue, callback_load);

    this.requests.push(queue);

}

ImageLoad.prototype.loadImage = function(queue, callback) {
    // queue.request.open("GET", queue.uri, true);
    // queue.request.responseType = 'arraybuffer';
    // queue.request.send();

    var _this = this;

    $.ajax({
        url: queue.uri,
        dataType: "binary",
        processData: false
    }).always(function(resp, status) {
            if (status != 'error') {
                _this.setImageData(queue.imageElement, resp);
                callback({
                    img: queue.imageElement
                });
            } else {
                setTimeout(function() {
                    _this.loadImage(queue);
                }, 2000);
            }
        });

}

ImageLoad.prototype.setImageData = function(image, data) {

    var _this = this;

    image.src = "data:image/png;base64," + _this.arrayBufferToBase64(data);

}

ImageLoad.prototype.arrayBufferToBase64 = function(buffer) {

    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function init() {
    var imageLoad = new ImageLoad();
    imageLoad.newImage("https://earthengine.googleapis.com/map/745662ef440b9173511d1f6038027ef8/13/3158/4456?token=7cdc9e141e859cc4714b7b61f86d0ffd");
    imageLoad.newImage("https://earthengine.googleapis.com/map/435aa67651971dffe939b7c9ebe66a73/12/1575/2229?token=bd51decd18a3a8684b684b2886a20fef");
    imageLoad.newImage("https://earthengine.googleapis.com/map/a06b37c0e8c883c7d8e88c3d2b791ff8/12/1580/2229?token=6342dacbc7fdf4e0db9dc2463f7045bd");
    imageLoad.newImage("https://earthengine.googleapis.com/map/745662ef440b9173511d1f6038027ef8/12/1576/2227?token=7cdc9e141e859cc4714b7b61f86d0ffd");
    imageLoad.newImage("https://earthengine.googleapis.com/map/745662ef440b9173511d1f6038027ef8/12/1576/2226?token=7cdc9e141e859cc4714b7b61f86d0ffd");
    imageLoad.newImage("https://earthengine.googleapis.com/map/745662ef440b9173511d1f6038027ef8/12/1577/2229?token=7cdc9e141e859cc4714b7b61f86d0ffd");
}