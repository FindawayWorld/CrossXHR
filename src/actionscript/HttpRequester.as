package
{
    public dynamic class HttpRequester
    {
        import com.adobe.serialization.json.JSON;
        import flash.errors.IOError;
        import flash.net.URLLoader;
        import flash.net.URLRequest;
        import flash.net.URLRequestMethod;
        import flash.net.URLRequestHeader;
            import flash.events.Event;
            import flash.events.IOErrorEvent;
            import flash.events.SecurityErrorEvent;
            import flash.events.HTTPStatusEvent;

        private var id:Number;
        private var request:URLRequest;
        private var parent:Object;
        private var status:Number;
        private var loader:URLLoader;
        private var origMethod:String;
        private function getMethod (method:String):String {

            switch(method.toLowerCase()) {
                case 'post':
                    origMethod = 'POST';
                    return URLRequestMethod.POST;
                case 'put':
                    origMethod = 'PUT';
                    return URLRequestMethod.POST;
                case 'delete':
                    origMethod = 'DELETE';
                    return URLRequestMethod.POST;
                case 'get':
                default:
                    origMethod = 'GET';
                    return URLRequestMethod.GET;
            }
        }

        private function done (stat:Number, response:*):void {
            loader.removeEventListener(Event.COMPLETE, handler);
            loader.removeEventListener(IOErrorEvent.IO_ERROR, handler);
            parent.handler(id, stat, response);
        }

        public function HttpRequester(parent_:Object,id_:Number, method:String, url:String):void {
            id = id_;
            parent = parent_;
            parent.log(id, url);
            request = new URLRequest(url);
            request.method = getMethod(method);
            loader = new URLLoader();
        }

        public function addHeader(name:String, value:String):void {
            var header:URLRequestHeader = new URLRequestHeader(name, value);
            parent.log(id, header);
            if (!request.requestHeaders)
                request.requestHeaders = new Array(header);
            else
                request.requestHeaders.push(header);
        }

        public function send(data:String):void {
            parent.log(id, 'Original Method: ' + origMethod);
            parent.log(id, 'Request Method: ' + request.method);

            if (data && (origMethod != 'POST' && origMethod != 'GET') )
                data += '&_method=' + origMethod;
            else if (!data && (origMethod != 'POST' && origMethod != 'GET') )
                data = '_method=' + origMethod;

            if (request.method == 'POST' && data)
                request.data = data;

            loader.addEventListener(Event.COMPLETE, handler, false, 1);
            loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, statusEvent);
            loader.addEventListener(IOErrorEvent.IO_ERROR, handler);
            loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, handler);
            loader.load(request);
        }

        public function statusEvent(event:HTTPStatusEvent):void {
            parent.log(id, event);
            status = event.status;
        }

        public function abort():void {
            loader.close();
            done(-1, 'aborted');
        }

        public function handler(e:Event):void {
            var data:Object;

            parent.log(id, "Status: " + status);

            if (e.target.data) {
                data = com.adobe.serialization.json.JSON.decode(e.target.data);
            } else {
                data = {};
            }

            parent.log(id, 'handler event:' + e.toString());
            done(status, data);
        }
    }
}
