$(document).ready(function() {
var config = {
    apiKey: "AIzaSyCPT0JGL3wvn-LS-_SbkYJ5qUxthJGZx-E",
    authDomain: "train-scheduler-773d2.firebaseapp.com",
    databaseURL: "https://train-scheduler-773d2.firebaseio.com",
    projectId: "train-scheduler-773d2",
    storageBucket: "",
    messagingSenderId: "131224378493"
  };
  firebase.initializeApp(config);
  var database = firebase.database();



  $("#add-train-btn").on("click", function(){

	// Grabs user input
	var trainName = $("#train-name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
	var frequency = $("#frequency-input").val().trim();

	// Creates local "temporary" object for holding train data
	var newTrain = {
		name:  trainName,
		destination: destination,
		firstTrain: firstTrain,
		frequency: frequency
	}

	// Uploads train data to the database
	database.ref().push(newTrain);

	// Logs everything to console
	console.log(newTrain.name);
	console.log(newTrain.destination);
	console.log(firstTrain);
	console.log(newTrain.frequency)

	// Alert
	alert("Train successfully added");

	// Clears all of the text-boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#first-train-input").val("");
	$("#frequency-input").val("");

	// Determine when the next train arrives.
	return false;
});


// 4. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var tName = childSnapshot.val().name;
	var tDestination = childSnapshot.val().destination;
	var tFrequency = childSnapshot.val().frequency;
	var tFirstTrain = childSnapshot.val().firstTrain;

	// Calculate the minutes until arrival using hardcore math
	// To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time and find the modulus between the difference and the frequency
	var differenceTimes = moment().diff(moment.unix(tFirstTrain), "minutes");
	var tRemainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency ;
	var tMinutes = tFrequency - tRemainder;

	// To calculate the arrival time, add the tMinutes to the currrent time
	var tArrival = moment().add(tMinutes, "m").format("hh:mm A");
	console.log(tMinutes);
	console.log(tArrival);

	console.log(moment().format("hh:mm A"));
	console.log(tArrival);
	console.log(moment().format("X"));

	// Add each train's data into the table
	$("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" + tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");

});
});