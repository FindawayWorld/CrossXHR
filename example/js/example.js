

crossxhr_setup('../dist/CrossXHR-0.2.1.swf');

var makeRequest = function (opts) {
    var o = $.extend({
            method: 'GET',
            dataType: 'text',
            data: null,
            headers: {}
        }, opts),
        params,
        request = new CrossXHR({ debug:false });

    request.onload = function () {
        if (request.readyState == 4) {
            try {
                if (request.status != 200) {
                    alert(request.status + ' error!');
                    request.log(request.status);
                } else {
                    // ok, process...
                    alert("got data: " + JSON.stringify(request.responseText));
                    request.log(request.responseText);
                }
            } catch(e) {
                alert('error detected 2');
            }
        }
    };

    request.open(o.method, o.url);

    if (o.data) {
        params = $.param(o.data);

        $.extend(o.headers, {
            "Content-Type" : "application/x-www-form-urlencoded",
            "Custom-Header" : "abcd12345"
        });
    }

    var headerKeys = $.map(o.headers, function (element, index) {return index;});

    if (o.headers && headerKeys.length) {
        $.each(o.headers, function (key, value, list) {
            request.setRequestHeader(key, value);
        });
    }

    request.send(params);
};

$(document)
    .on('click', '.js-request', function () {
        var $this = $(this),
            elData = $this.data(),
            reqData = {
                url: elData.url,
                method: elData.method
            };

        if (elData.data) {
            reqData.data = elData.data;
        }

        makeRequest(reqData);
    });
