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
            var dataFromPage = event.detail;
            var token = dataFromPage.token;
            callback(dataFromPage.request, function(response){
                var eventResponse = new CustomEvent('webpg-'+name+'-response', {
                    'token': token,
                    'response': response
                });
                document.dispatchEvent(eventReponse);
            });
            // var responseData = {"value":internalStorage[dataFromPage.key], "reqId":data.reqId};
            // var fetchResponse = new CustomEvent('fetchResponse', {"detail":responseData});
            // document.dispatchEvent(fetchResponse);
        });
    },
    endpoints: {}
};
webpg.api.init();
/* ]]> */
