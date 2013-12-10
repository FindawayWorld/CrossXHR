(function (window, document) {
    'use strict';

    var crossxhr_objects = [],
        CrossXHR,
        gatewayName = 'FlashHttpRequest_gateway',
        getGateway = function () {
            if (navigator.appName.indexOf("Microsoft") != -1) {
                return window[gatewayName];
            } else {
                return document[gatewayName];
            }
            return false;
        };

    // Legacy 'ready' flag
    window.FlashHttpRequest_ready = false;
    window.crossxhr_ready = false;

    window.crossxhr_callback = function (id, status, data) {
        crossxhr_objects[id].handler(status, data);
    };

    window.crossxhr_log = function (id, message) {
        crossxhr_objects[id].log(message);
    };

    window.crossxhr_setup = function (swfUrl, callback) {
        if (getGateway()) {
            return this;
        }

        window.crossxhr_flashInit = function () {
            crossxhr_ready = true;
            FlashHttpRequest_ready = 1;
            if (typeof callback === 'function') {
                callback();
            }
        };

        var params = {
            'allowscriptaccess': "always",
            'hasPriority': 'true'
        },
        span1 = document.createElement('span'),
        span2 = document.createElement('span');

        span1.style.position = 'absolute';
        span1.style.top = '-9999px';
        span1.style.left = '-9999px';
        span1.style.height = '6px';
        span1.style.width = '6px';
        span1.style.display = 'block';
        span1.style.zIndex = '10000';

        span2.id = gatewayName;

        span1.appendChild(span2);
        document.body.appendChild(span1);
        swfobject.embedSWF(swfUrl, gatewayName, 6, 6, 9, "expressInstall.swf", {}, params);
        return this;
    };

    CrossXHR = function (options) {
        var self = this;
        if (!window.crossxhr_ready || !window.FlashHttpRequest_ready) {
            throw new Error('Flash not loaded.');
        }

        options = options || {};
        self.gateway = getGateway();

        if (!self.gateway) {
            throw new Error('You need to run setupCrossXHR() first.');
        }

        self.id = crossxhr_objects.length;
        crossxhr_objects.push(self);

        self.readyState = 0;

        self.debug = options.debug || false;

        return this;
    };

    CrossXHR.prototype.log = function (message) {
        var self = this;
        if (!self.debug || !window.console ) {
            return false;
        }
        message = typeof message === 'string' ? 'CrossXHR: ' + message : ['CrossXHR', message];
        return console.log(message);
    };

    CrossXHR.prototype.open = function (arg1, arg2) {
        var self = this;
        self.readyState = 1;
        self.gateway.create(self.id, arg1, arg2);
        return this;
    };

    CrossXHR.prototype.abort = function () {
        var self = this;
        self.gateway.abort(self.id);
        return this;
    };

    CrossXHR.prototype.setRequestHeader = function (key, value) {
        var self = this;
        self.gateway.addHeader(self.id, key, value);
        return this;
    };

    CrossXHR.prototype.send = function (arg1) {
        var self = this;
        self.gateway.send(self.id, arg1);
        return this;
    };

    CrossXHR.prototype.handler = function (status, data) {
        var self = this;

        self.readyState = 4;
        self.responseText = data;
        self.status = status;

        setTimeout(function(){  // must release flash
            self.gateway.finished(self.id);
            if(self.onload) {
                self.onload.apply(data);
            }
        }, 10);
    };

    window.CrossXHR = CrossXHR;

    // Legacy methods
    window.FlashHttpRequest_handler = crossxhr_callback;

    return CrossXHR;
})(this, this.document);
