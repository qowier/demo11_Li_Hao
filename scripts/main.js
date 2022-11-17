var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        readQuote();
        insertName();
        populateCardsDynamically();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

function readQuote() {
  db.collection("quotes").doc("Tuesday")
      .onSnapshot(tuesdayDoc => {
          console.log("current document data: " + tuesdayDoc.data());
          document.getElementById("quote-goes-here").innerHTML = tuesdayDoc.data().quote;
      })
}

// Insert name function using the global variable "currentUser"
function insertName() {
  currentUser.get().then(userDoc => {
      //get the user name
      var user_Name = userDoc.data().name;
      console.log(user_Name);
      $("#name-goes-here").text(user_Name); //jquery
      // document.getElementByID("name-goes-here").innetText=user_Name;
  })
}

function writeHikes() {
  //define a variable for the collection you want to create in Firestore to populate data
  var hikesRef = db.collection("hikes");

  hikesRef.add({
      code: "BBY01",
      name: "Burnaby Lake Park Trail", //replace with your own city?
      city: "Burnaby",
      province: "BC",
      level: "easy",
      details: "Haurence once every 10 years",
      length: 10,          //number value
      length_time: 60,     //number value
      last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });
  hikesRef.add({
      code: "AM01",
      name: "Buntzen Lake Trail", //replace with your own city?
      city: "Anmore",
      province: "BC",
      level: "moderate",
      details: "Jack goes here every week",
      length: 10.5,      //number value
      length_time: 80,   //number value
      last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2022"))
  });
  hikesRef.add({
      code: "NV01",
      name: "Mount Seymour Trail", //replace with your own city?
      city: "North Vancouver",
      province: "BC",
      level: "hard",
      details: "Barry finishes the hike every morning",
      length: 8.2,        //number value
      length_time: 120,   //number value
      last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2022"))
  });
}

function populateCardsDynamically() {
  let hikeCardTemplate = document.getElementById("hikeCardTemplate");
  let hikeCardGroup = document.getElementById("hikes-go-here");
  
  db.collection("hikes")
    .orderBy("length_time")            //NEW LINE;  what do you want to sort by?
    .limit(5)                       //NEW LINE:  how many do you want to get?
    .get()
      .then(allHikes => {
          allHikes.forEach(doc => {
              var hikeName = doc.data().name; //gets the name field
              var hikeID = doc.data().code; //gets the unique ID field
              var hikeLength = doc.data().length; //gets the length field
              let testHikeCard = hikeCardTemplate.content.cloneNode(true);
              testHikeCard.querySelector('.card-title').innerHTML = hikeName;     //equiv getElementByClassName
              testHikeCard.querySelector('.card-length').innerHTML = hikeLength;  //equiv getElementByClassName
              testHikeCard.querySelector('a').onclick = () => setHikeData(hikeID);
              
              //next 2 lines are new for demo#11
              //this line sets the id attribute for the <i> tag in the format of "save-hikdID" 
              //so later we know which hike to bookmark based on which hike was clicked
              testHikeCard.querySelector('i').id = 'save-' + hikeID;
              // this line will call a function to save the hikes to the user's document             
              testHikeCard.querySelector('i').onclick = () => saveBookmark(hikeID);

              testHikeCard.querySelector('img').src = `./images/${hikeID}.jpg`;   //equiv getElementByTagName
              testHikeCard.querySelector('.read-more').href = "eachHike.html?hikeName="+hikeName +"&id=" + hikeID;
              hikeCardGroup.appendChild(testHikeCard);
          })

      })
}

function setHikeData(id){
  localStorage.setItem ('hikeID', id);
}

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark(hikeID) {
  currentUser.set({
          bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeID)
      }, {
          merge: true
      })
      .then(function () {
          console.log("bookmark has been saved for: " + currentUser);
          var iconID = 'save-' + hikeID;
          //console.log(iconID);
          //this is to change the icon of the hike that was saved to "filled"
          document.getElementById(iconID).innerText = 'bookmark';
      });
}