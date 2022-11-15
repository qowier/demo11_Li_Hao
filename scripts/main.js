var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        read_display_Quote();
        insertName();
        populateCardsDynamically();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

function read_display_Quote() {
  //console.log("inside the function")

  //get into the right collection
  db.collection("quotes")
    .doc("tuesday")
    .onSnapshot(function (tuesdayDoc) {
      //console.log(tuesdayDoc.data());
      document.getElementById("quote-goes-here").innerHTML =
        tuesdayDoc.data().quote;
    });
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
    length: "10",
    details: "Elmo goes here regularly",
    last_updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
  hikesRef.add({
    code: "AM01",
    name: "Buntzen Lake Trail Trail", //replace with your own city?
    city: "Anmore",
    province: "BC",
    level: "moderate",
    length: "10.5",
    details: "Elmo goes here regularly",
    last_updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
  hikesRef.add({
    code: "NV01",
    name: "Mount Seymoure Trail", //replace with your own city?
    city: "North Vancouver",
    province: "BC",
    level: "hard",
    length: "8.2",
    details: "Elmo goes here regularly",
    last_updated: firebase.firestore.Timestamp.fromDate(
      new Date("March 10, 2022")
    ),
  });
}

function populateCardsDynamically() {
  let hikeCardTemplate = document.getElementById("hikeCardTemplate");  //card template
  let hikeCardGroup = document.getElementById("hikeCardGroup");   //where to append card
  
  //doublecheck: is your Firestore collection called "hikes" or "Hikes"?
  db.collection("hikes").get()   
      .then(allHikes => {
          allHikes.forEach(doc => {
              var hikeName = doc.data().name; //gets the name field
              var hikeID = doc.data().code; //gets the unique ID field
              var hikeLength = doc.data().length; //gets the length field
              let testHikeCard = hikeCardTemplate.content.cloneNode(true);
              testHikeCard.querySelector('.card-title').innerHTML = hikeName;
              testHikeCard.querySelector('.card-length').innerHTML = hikeLength;
              testHikeCard.querySelector('a').onclick = () => setHikeData(hikeID);

              //next 2 lines are new for demo#11
              //this line sets the id attribute for the <i> tag in the format of "save-hikdID" 
              //so later we know which hike to bookmark based on which hike was clicked
              testHikeCard.querySelector('i').id = 'save-' + hikeID;
              // this line will call a function to save the hikes to the user's document             
              testHikeCard.querySelector('i').onclick = () => saveBookmark(hikeID);

              testHikeCard.querySelector('img').src = `./images/${hikeID}.jpg`;
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