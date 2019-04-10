$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAtOP0wmgF2QqdgtALEOFn7gTYhwE3OWXM",
        authDomain: "fir-hw-train-schedule.firebaseapp.com",
        databaseURL: "https://fir-hw-train-schedule.firebaseio.com",
        projectId: "fir-hw-train-schedule",
        storageBucket: "fir-hw-train-schedule.appspot.com",
        messagingSenderId: "1060729065950"
      };
      firebase.initializeApp(config);
  
    // Create a variable for the database
    var database = firebase.database();
  
    //When you click on "submit," what happens?
    $('#submit').click(function(){
      event.preventDefault();
  
      var tName = $('#train-name').val().trim();
      var tDestination = $('#destination').val().trim();
      var tFirstTime = $('#first-train').val().trim();
      var tFrequency = $('#frequency').val().trim();
      console.log('Train Name: ' + tName);
      console.log('Destination: ' + tDestination);
      console.log('First Train Time: ' + tFirstTime);
      console.log('Frequency: ' + tFrequency);
      console.log('------------------------------------');
  
      // Pushing values in the database
      database.ref().push({
        name: tName,
        destination: tDestination,
        first: tFirstTime,
        frequency: tFrequency,
      });
  
      // Alert
      alert("Thank you for adding your train!");
      
      // Empty the input sections
      $('#train-name').val('');
      $('#destination').val('');
      $('#first-train').val('');
      $('#frequency').val('');
  
    });
  
    
    database.ref().on('child_added', function(snapshot){
  
      //Calculate minutes away
      var firstTrain = snapshot.val().first;
      var frequencyInMins = snapshot.val().frequency;
  
      //Calculate the next arriving train
      var currentTime = moment();
      var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
      var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
      var tRemainder = diffTime % frequencyInMins;
      var tMinutesTillTrain = frequencyInMins - tRemainder;
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  
      //console log all of the times to double check!
      console.log("Current Time: " + currentTime);
      console.log("First Time Converted: " + firstTimeConverted);
      console.log("Diff Time: " + diffTime);
      console.log("Remainder: " + tRemainder);
      console.log("Minutes till Train: " + tMinutesTillTrain);
      console.log("Arrival Time: " + moment(nextTrain).format("HH:mm"));
      console.log('------------------------------------');
    
      //Create new rows and append data from firebase
      var newRow = $('<tr>');
      newRow.append('<td>'+ snapshot.val().name +'</td');
      newRow.append('<td>'+ snapshot.val().destination +'</td');
      newRow.append('<td>'+ snapshot.val().frequency +'</td');
      newRow.append('<td>'+ moment(nextTrain).format("HH:mm") +'</td');
      newRow.append('<td>'+ tMinutesTillTrain +'</td');
        
      $('tbody').append(newRow);
    
    // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
  });