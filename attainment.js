var inboxId = "-KihIWrN5C8w5RNLV5g4";

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
    // get our current user 
    var user = firebase.auth().currentUser;
    if (!user) {
        console.log("User not logged in");
        return;
    }

    if (thread != null) {
        var json = {
            name: thread.getSubject(),
            gmailThreadId: thread.getThreadID()
        };

        console.log("Sending to Attainment: " + json);
        var inboxRef = firebase.database().ref("/users/"
                                + user.uid
                                + "/projects/"
                                + inboxId
                                + "/tasks");
        inboxRef.push(json);
    }

}

function initFirebase() {
    var config = {
        apiKey: "AIzaSyDs8E_p1Uyiq9mLcBC6G__Kdzu3ggkgt9I",
        authDomain: "attainment-6017d.firebaseapp.com",
        databaseURL: "https://attainment-6017d.firebaseio.com",
        projectId: "attainment-6017d",
        storageBucket: "attainment-6017d.appspot.com",
        messagingSenderId: "1096403605650"
    };
    firebase.initializeApp(config);
} 

function handleAuth(user) {
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
}

function handleAuthError(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;

  console.log("ERROR: " + errorCode);
  console.log("ERROR MSG: " + errorMessage);
}

initFirebase();
firebase.auth().signInWithEmailAndPassword("", "")
    .then(handleAuth)
    .catch(handleAuthError);

