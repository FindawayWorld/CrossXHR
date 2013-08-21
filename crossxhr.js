
(function (window, document) {
    'use strict';

    var crossxhr_objects = {},
        crossxhr_counter = 0,
        crossxhr_ready = false,
        CrossXHR;

    // Legacy 'ready' flag
    window.FlashHttpRequest_ready = false;

    window.crossxhr_flashInit = function () {
        crossxhr_ready = true;
        FlashHttpRequest_ready = 1;
    };

    window.crossxhr_callback = function (id, status, data) {
        crossxhr_objects[id].handler(status, data);
    };

    window.crossxhr_log = function (id, message) {
        crossxhr_objects[id].log(message);
    };

    window.crossxhr_setup = function (swfUrl) {
        if (document.getElementById("FlashHttpRequest_gateway")) {
            return this;
        }

        var span1 = document.createElement('span'),
            span2 = document.createElement('span');

        span1.style.position = 'absolute';
        span1.style.top = '0';
        span1.style.left = '0';
        span1.style.height = '1px';
        span1.style.width = '1px';
        span1.style.display = 'block';

        span2.id = 'FlashHttpRequest_gateway';

        span1.appendChild(span2);
        document.body.appendChild(span1);
        swfobject.embedSWF(swfUrl, span2, 1, 1, 9, "expressInstall.swf", {}, {wmode: 'transparent', allowscriptaccess:"always"});
        return this;
    };

    CrossXHR = function (options) {
        if (!crossxhr_ready || !FlashHttpRequest_ready) {
            throw new Error('CrossXHR flash was not loaded.');
        }
        var self = this;
        options = options || {};
        self.gateway = document.getElementById("FlashHttpRequest_gateway");

        if (!self.gateway) {
            throw new Error('You need to run setupCrossXHR() first.');
        }

        self.id = crossxhr_counter++;
        crossxhr_objects[self.id] = self;
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

    CrossXHR.prototype.open = function(arg1,arg2) {
        var self = this;
        self.gateway.create(self.id, arg1,arg2);
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

    CrossXHR.prototype.send = function(arg1) {
        var self = this;
        self.gateway.send(self.id, arg1);
        return this;
    };

    CrossXHR.prototype.handler = function(status, data) {
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
