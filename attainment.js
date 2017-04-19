function openThreadView(sdk, id) {
    if (id) {
        sdk.Router.goto(sdk.Router.NativeRouteIDs.THREAD, {threadID: id});
    }
}

function createFinderModal(sdk) {
        // create the div that has the input element
        var el = document.createElement("div");
        var inp = document.createElement("input");
        inp.setAttribute("type", "text");
        inp.setAttribute("id", "findInp");
        el.appendChild(inp);

        var modal = sdk.Widgets.showModalView({
            el: el,
            title: "Find Thread",
            buttons: [ 
                {
                    text: 'Find',
                    title: 'Search for a given id',
                    type: 'PRIMARY_ACTION',
                    onClick: function() {
                        var id = document.getElementById('findInp').value;
                        openThreadView(sdk, id);
                        modal.close();
                    }
                }
            ]
        });

        return modal;
}

function sendToAttainment(thread) {
   
    if (thread != null) {
        var json = {
            subject: thread.getSubject(),
            threadId: thread.getThreadID()
        }

        console.log(json);
    }

}

        

InboxSDK.load('2', 'sdk_attainment_defe48b608').then(function(sdk){
    var currThread = null;
    // register our thread handler
    sdk.Conversations.registerThreadViewHandler(function(threadView){
            currThread = threadView;
    });

 //   mEl.innerHTML = "thread: 15b882f882d90f9e";
    Mousetrap.bind('; f', function() { createFinderModal(sdk); });
    Mousetrap.bind('; t', function() { sendToAttainment(currThread); currThread = null; });

});
