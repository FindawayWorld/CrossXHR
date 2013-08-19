
(function (window, document, undefined) {
    'use strict';

    window.FlashHttpRequest_ready = false;
    var FlashHttpRequest_objects = {},
        FlashHttpRequest_counter = 0,
        FlashHttpRequest_handler = function (id, status, data) {
            FlashHttpRequest_objects[id].handler(status, data);
        },
        setupCrossXHR = function (swfUrl) {
            embedFlash(swfUrl);
        },
        FlashHttpRequest_callback = function () {
            window.FlashHttpRequest_ready = true;
        };

    var CrossXHR = function () {
        var obj;
        var max_wait = 100;
        this.gateway = document.getElementById("FlashHttpRequest_gateway");
        var self = this;
        this.id = FlashHttpRequest_counter++;
        this.queue = [];
        FlashHttpRequest_objects[this.id] = this;

        if (!this.gateway) {
            throw new Error('You need to run setupCrossXHR() first.');
        }

        return this;
    };

    CrossXHR.prototype.processQueue = function () {
        var self = this;
        if (self.queue.length === 0 || !window.FlashHttpRequest_ready) {
            return this;
        }
        for (var i=0;i<self.queue.length;i++) {
            self.queue[i].call(self);
        }
        return this;
    };

    CrossXHR.prototype.open = function(arg1,arg2) {
        var self = this;
        if (!window.FlashHttpRequest_ready) {
            self.queue.push(function () {
                self.open.call(self, arg1, arg2);
            });
            return this;
        }
        this.gateway.create(this.id, arg1,arg2);
        return this;
    };

    CrossXHR.prototype.abort = function () {
        var self = this;
        if (!window.FlashHttpRequest_ready) {
            self.queue.push(function () {
                self.abort.call(self);
            });
            return this;
        }
        this.gateway.abort(this.id);
        return this;
    };

    CrossXHR.prototype.setRequestHeader = function (key, value) {
        var self = this;
        if (!window.FlashHttpRequest_ready) {
            self.queue.push(function () {
                self.setRequestHeader.call(self, key, value);
            });
            return this;
        }
        this.gateway.addHeader(this.id, key, value);
        return this;
    };

    CrossXHR.prototype.send = function(arg1) {
        var self = this;
        if (!window.FlashHttpRequest_ready) {
            self.queue.push(function () {
                self.send.call(self, arg1);
            });
            return this;
        }
        this.gateway.send(this.id, arg1);
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

    var embedFlash = function (swfUrl, callback) {
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
    };

    window.CrossXHR = CrossXHR;
    window.FlashHttpRequest_handler = FlashHttpRequest_handler;
    window.setupCrossXHR = setupCrossXHR;
    window.FlashHttpRequest_callback = FlashHttpRequest_callback;

    return CrossXHR;
})(this, this.document);
