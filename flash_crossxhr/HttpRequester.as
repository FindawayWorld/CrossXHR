package
{
    public dynamic class HttpRequester
    {
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
		private function getMethod (method:String):String {
			switch(method.toLowerCase()) {
				case 'post':
					return URLRequestMethod.POST;
                case 'put':
                    return URLRequestMethod.PUT;
                case 'delete':
                    return URLRequestMethod.DELETE;
                case 'get':
                default:
                    return URLRequestMethod.GET;
			}
		}

        private function done (stat:Number, response):void {
            loader.removeEventListener(Event.COMPLETE, handler);
            loader.removeEventListener(IOErrorEvent.IO_ERROR, handler);

            parent.handler(id, stat, response);
        }

        public function HttpRequester(parent_:Object,id_:Number,
            method:String, url:String):void {
            id = id_;
            parent = parent_;
			parent.log(url);
            request = new URLRequest(url);
            request.method = getMethod(method);
            loader = new URLLoader();
        }

        public function addHeader(name:String, value:String):void {
            var header:URLRequestHeader = new URLRequestHeader(name, value);
			parent.log(header);
            if (!request.requestHeaders)
              request.requestHeaders = new Array(header);
            else
              request.requestHeaders.push(header);
        }

        public function send(data:String):void {
            if (request.method == 'POST')
              request.data = data;
            loader.addEventListener(Event.COMPLETE, handler);
			loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, statusEvent);
            loader.addEventListener(IOErrorEvent.IO_ERROR, handler);
            loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, handler);
            loader.load(request);
        }

		public function statusEvent(event:HTTPStatusEvent):void {
			parent.log(event);
			status = event.status;
		}

        public function abort():void {
            loader.close();
            done(-1, 'aborted');
        }

        public function handler(e:Event):void {
		  parent.log(e);
          done(status, loader.data);
        }
    }
}
