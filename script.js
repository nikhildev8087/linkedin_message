const firebaseConfig = {
  apiKey: "AIzaSyDdV-KqJqVn4-Q0pm1iu3187F5uR1bR_8s",
  authDomain: "linkedinmsg-85867.firebaseapp.com",
  projectId: "linkedinmsg-85867",
  storageBucket: "linkedinmsg-85867.appspot.com",
  messagingSenderId: "29377870378",
  appId: "1:29377870378:web:6a68ce6956ff8b57ba6153",
};


const app = firebase.initializeApp(firebaseConfig);


const db = firebase.database();


function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl,
    userId:userId
  });
}

async function loginWithGoogle(){
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
.signInWithPopup(provider)
  .then((result) => {
    console.log(result);
    console.log(result.additionalUserInfo.profile.name);
    console.log(result.additionalUserInfo.profile.email);
    console.log(result.additionalUserInfo.profile.picture);
    window.location.href="chat.html"

  })
}


  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user);
      console.log(user.uid);

      const loginUserMail = document.getElementById('loginUserMail');
    loginUserMail.innerHTML = `Email: ${user.email}`; 

    const loginUserId = document.getElementById('loginUserId');
    loginUserId.innerHTML = `uid: ${user.uid}`; 


      showusers(user.uid);
      
      console.log(user.email);
      console.log(user.displayName);
      console.log(user.photoURL);
      // console.log(user.profileUrl);
      let url = "";
      writeUserData(user.uid,user.displayName, user.email, user.photoURL);

      const userlogged = document.getElementById('userlogged');
      userlogged.innerHTML = user.displayName;
      const userloggedimg = document.getElementById('userloggedimg');
      userloggedimg.src = user.photoURL;
      console.log(userloggedimg.src);

    } else {
      console.log('signout');
    }
  });
  
  function logout(){
    firebase.auth().signOut();
    window.location.href="index.html";
  }


  //get all users present in the database 
  function showusers(uid){
  const fetchuser = db.ref("users/");
  fetchuser.on("child_added", (snapshot)=>{
    const data = snapshot.val();
    console.log(data);
    console.log(data.username);
    console.log(data.userId);

    

    const userlist = `<li class="border-bottom mt-2 " style="cursor:pointer">
    <div class="col-md-12 bg-light p-2 users rounded ${uid === data.userId ? "hideusr": "showusr"}" id="${data.userId}" onclick="sendmsgtouser(this)" >
        <p class="text-left ">${data.username}</p>
    </div>
  </li>`

  
    document.getElementById('userlist').innerHTML += userlist;

  });
}



  function sendmsgtouser(userselected){
    console.log(userselected.id);
    const uid = userselected.id;

    const fetchuser = db.ref("users/"+uid);
  fetchuser.on("value", (snapshot)=>{
    const data = snapshot.val();
    const displayReciever = document.getElementById('displayReciever');
    displayReciever.innerHTML =  data.username;
    
  });

    const timestamp = Date.now();
    console.log(timestamp);
    
    const d = new Date();
    let t = d.getTime();
    let hour = d.getHours();
    let minutes = d.getMinutes();
    // let set = "AM";
    if(hour>12 ){
      hour-=12;
      // set = "PM";
    }

    
    let time = hour+":"+minutes;
    console.log(time);

    retriveData(userselected.id);

    const messageInput = document.getElementById('messageInput');
    const sendbtn = document.getElementById('sendbtn');
    // const imgInput = document.getElementById('imgInput');
    // let filedata = imgInput.files[0];
    // let storageRef = firebase.storage().ref('images/'+filedata.name)
    // storageRef.put(filedata);
    

    sendbtn.addEventListener("click", function(){
      message = messageInput.value;
      console.log(message);
      // console.log();
      

      sendmsgToDatabase(message, userselected.id, timestamp,time);
      messageInput.value ="";

      // retriveData(userselected.id);

    })
  }



function sendmsgToDatabase(message, userid, timestamp, time){
  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    if(user){
      console.log(user.uid);

      db.ref("messages/" +user.uid+"/"+ userid + "/"+ timestamp).set({
        senderid:userid,
        reiceverid:user.uid,
        message:message,
        timestamp:timestamp,
        time:time,
        
      });

    }
  })
}


function retriveData(userid){
  const unsubscribe = firebase.auth().onAuthStateChanged((user)=>{

 

  console.log(userid);

  const fetchMessage = db.ref("messages/"+user.uid+"/"+userid);
  const fetchMessage2 = db.ref("messages/"+userid+"/"+user.uid);
  fetchMessage2.on("value", function(snapshot){
    snapshot.forEach((childSnapshot)=>{
      const messages2 = childSnapshot.val();
      
  fetchMessage.on("value", function(snapshot){
    snapshot.forEach((childSnapshot)=>{

    
    const messages = childSnapshot.val();
    console.log(messages2);
    // const arr = {...messages, ...messages2};
    // messages.merge(messages2);
    // console.log(arr);



    const showmsg = `<li class="border-bottom">
    <div class="col-md-12  ${userid===messages.reiceverid ? "sender": "reciever"}">
        <p class="text-left bg-primary p-2 rounded text-light" style="width: fit-content;">${messages.message} <small class="d-flex float-right ml-2 pt-2"> ${messages.time}</small></p>
    </div>
  </li >
  
  <li class="border-bottom">
    <div class="col-md-12  ${userid===messages2.reiceverid ? "sender": "reciever"}">
        <p class="text-left bg-light p-2 rounded text-dark" style="width: fit-content;">${messages2.message} <small class="d-flex float-right ml-2 pt-2"> ${messages.time}</small></p>
    </div>
  </li >`;


    const addmsg = document.getElementById('messages');
    addmsg.innerHTML +=showmsg;

    
  });
});

  });
    
  });

  });

}
























