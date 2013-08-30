package {
  import flash.display.Sprite;
  public class HttpRequesterManager extends Sprite {
    import flash.external.ExternalInterface;
    import HttpRequester;
    import flash.system.Security;
    Security.allowDomain("*");
	Security.allowInsecureDomain("*");

    private var objects:Object;

    public function HttpRequesterManager():void {
        super();
        ExternalInterface.addCallback("create", create);
        ExternalInterface.addCallback("abort", abort);
        ExternalInterface.addCallback("addHeader", addHeader);
        ExternalInterface.addCallback("send", send);
        ExternalInterface.addCallback("finished", finished);
        ExternalInterface.call("crossxhr_flashInit");
        objects = new Object();
    }

	public function log(id:Number, msg:*):void {
		ExternalInterface.call("crossxhr_log", id, msg.toString());
	}

    public function create(id:Number, method:String, url:String):void {
        var requester:HttpRequester = new HttpRequester(this, id, method, url);
        objects[id] = requester;
    }

    public function abort(id:Number):void {
        objects[id].abort();
    }

    public function addHeader(id:String, name:String, value:String):void {
        objects[id].addHeader(name, value);
    }
    public function send(id:String, content:String):void {
        objects[id].send(content);
    }

    public function handler(id:String, status:String, data:*):void {
        ExternalInterface.call("crossxhr_callback", id, status, data);
    }
    public function finished(id:String):void {
        objects[id] = null;
    }
  }
}
