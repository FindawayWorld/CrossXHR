CrossXHR
========
A drop-in replacement for XmlHttpRequest to support Cross Domain Requests.

## Requirements
- SWFObject (included)

## Usage

Include `CrossXHR-<version>.js` at the bottom of your document (before the closing `</body>`) and then call `crossxhr_setup()` passing the path to the CrossXHR swf*.

        <script src="path/to/CrossXHR-<version>.js"></script>
        <script>
            crossxhr_setup('path/to/CrossXHR-<version>.swf');
        </script>
    </body>

_\* the swf path should be relative to your page or absolute with domain._

### Make request
Making requests with `CrossXHR` is easy since its API is the same as the standard Javascript XmlHttpRequest.

To make a request first create a new instance of `CrossXHR` and assign it to a variable.

    var request = new CrossXHR();

You are now ready to make a request.

#### Set request header(s)

    request.setRequestHeader(key, value);

_Note: Flash only allows request headers to be set for POST requests._

#### Open request

    request.open(method, url);

#### Abort request

    request.abort();

#### Send request

    request.send(data);
    // data is a parameterized string (e.g: foo=bar&baz=qux)

#### Request onload

    request.onload = function () {
        // do something once the request has returned.
    };

### Request Properties

#### readyState

- 0 - UNSET - `open()` has not been called.
- 1 - OPENED - `send()` has not been called.
- 2 - HEADERS_RECEIVED - `send()` has been called, and headers and status are available. **Not Implemented**
- 3 - LOADING - `send()` Downloading; `responseText` holds partial data. **Not Implemented**
- 4 - DONE - The operation is complete.

From <https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest>

#### status
The status of the response to the request. This is the HTTP result code.

#### responseText
The response to the request as text.


## Dev/Build Requirements
- [Node](http://nodejs.org)
- [Grunt](http://gruntjs.com)
- [Apache Flex SDK](http://flex.apache.org/)

## Building the library

Once you have all requirements installed make sure you set your environment variable `FLEX_HOME` to the path to your installed Flex SDK.

    echo FLEX_HOME = /path/to/flex_sdk

You will probably want to put this in your `.<shell>rc` file to prevent having to set it manually every time.

### Building the javascript and swf files

    $ grunt build:js // builds the javascript files

    $ grunt build:swf // builds the swf files

    $ grunt build // build both js and swf files
