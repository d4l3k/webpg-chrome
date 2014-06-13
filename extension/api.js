/* <![CDATA[ */
if (typeof(webpg)=='undefined') { webpg = {}; }
// Enforce jQuery.noConflict if not already performed
if (typeof(jQuery)!='undefined') { webpg.jq = jQuery.noConflict(true); }

/**
    @class webpg.api
        Listens for non-extension API requests.
*/
webpg.api = {
    /**
        @method init
            Initializes the webpg.api object and adds the required event listeners.
    */
    init: function() {
        webpg.api.addEndPoint("requestPermission", function(request, callback){
            if(webpg.api.authorized === undefined){
                var allow = confirm("Allow '"+window.location.host+"' to encrypt, decrypt, and sign using your PGP keys?");
                webpg.api.authorized = allow;
                callback({ status: allow });
            } else {
                callback({ error: 'Permission already requested.' });
            }
        });
        webpg.api.addEndPoint("encrypt", function(request, callback){
            var pgpRequest = {
              'data': request.body,
              'message_event': 'gmail',
              'msg': 'encrypt'
            };
            webpg.utils.sendRequest(pgpRequest,
                function(response) {
                    callback(response.result);
                }
            );
        });
        webpg.api.addEndPoint("symmetricEncrypt", function(request, callback){
            var pgpRequest = {
              'data': request.body,
              'message_event': 'gmail',
              'msg': 'symmetricEncrypt'
            };
            webpg.utils.sendRequest(pgpRequest,
                function(response) {
                    callback(response.result);
                }
            );
        });
    },
    /**
        @method addEndPoint
            Adds an API endpoint and adds the required event listener.
        @param {String} name The name of the API call
        @param {Function} callback The API callback
    */
    addEndPoint: function(name, callback){
        webpg.api.endpoints[name] = callback;
        document.addEventListener('webpg-'+name, function(event) {
            if(webpg.api.authorized || name == 'requestPermission'){
                var dataFromPage = event.detail;
                console.log(event);
                var token = dataFromPage.token;
                callback(dataFromPage.request, function(response){
                    var event_response = new CustomEvent('webpg-'+name+'-response-'+token, {detail: response});
                    document.dispatchEvent(event_response);
                });
            } else {
                var event_response = new CustomEvent('webpg-'+name+'-response-'+token, {
                    detail: {
                        'error': 'Not authorized'
                    }
                });
                document.dispatchEvent(event_response);
            }
        });
    },
    endpoints: {}
};
webpg.api.init();
/* ]]> */
