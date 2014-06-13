if (typeof(webpg)==='undefined') { var webpg = {}; }

/**
    @property {webpg.api} api
        The client side JS api provides a nice layer to interface with WebPG.
*/
webpg.api = {
    /**
        @method init
            Sets up the client API library and requests access.
    */
    init: function() {
    },
    requestPermission: function(callback){
        webpg.api.sendRequest('requestPermission', {}, callback);
    },
    sendRequest: function(name, data, callback){
        var token = webpg.api.generateToken(32);
        var request = {
            'request': data,
            'token': token
        }
        var eventresponse = new CustomEvent('webpg-'+name, { detail: request });
        var response_event = 'webpg-'+name+'-response-'+token;
        var listener = function(event){
            var data = event.detail;
            document.removeEventListener(response_event, listener);
            callback(data);
        }
        document.addEventListener(response_event, listener);
        document.dispatchEvent(eventresponse);
    },
    /**
        @method randomBytes
            Returns a uint8Array of random bytes and if possible, be cryptographically secure.
        @param {Integer} count The number of bytes.
    */
    randomBytes: function(count){
        var array = new Uint8Array(count);
        if(window.crypto.getRandomValues)
            window.crypto.getRandomValues(array);
        else {
            for(var i=0; i<array.length;i++){
                array[i] = Math.random()*256;
            }
        }
        return array;
    },
    /**
        @method generateToken
            Generates a random string to be used as a token.
        @param {Integer} length The length of the token
    */
    generateToken: function(length){
        var bytes = webpg.api.randomBytes(length);
        var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        var out="";
        for(var i=0;i<bytes.length;i++){
            out += chars[bytes[i] % chars.length];
        }
        return out;
    }
}
webpg.api.init();
