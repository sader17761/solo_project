/*-------- CONTROLLER --------*/

var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: "views/partials/home.html",
      controller: "DefaultController"
  }).when('/login', {
      templateUrl: "views/partials/login.html",
      controller: "DefaultController"
  }).when('/register', {
      templateUrl: "views/partials/register.html",
      controller: "DefaultController"
  }).when('/adminDashboard', {
      templateUrl: "views/partials/adminDashboard.html",
      controller: "DefaultController"
  }).when('/studentDashboard', {
      templateUrl: "views/partials/studentDashboard.html",
      controller: "DefaultController"
  });
});

myApp.controller('DefaultController', DefaultController);

function DefaultController(DefaultService, $location) {
    var vm = this;


    /*---- COLLECTION NAME ----*/
    vm.obtainCollection = function() {
      if (vm.collectionIn === ''){
        alert('Please enter a collection name.');
      } else {
        //console.log('In controller, sending collection.');
        var todaysDate = new Date();
        // create object to send to database
        var collectionObject = {
          date: todaysDate,
          collName: vm.collectionIn
        };
        DefaultService.addCollection(collectionObject).then(function(response){
          console.log('Response from Service: ', response);
          if(response.data === 'Exists'){
            vm.collectionIn = '';
            alert('Sorry, that collection already exists.');
          } else {
            vm.collectionIn = '';
            vm.getCollectionNames(); // this will call the get function and display to DOM
          }
        });
      }
    };

    vm.getCollectionNames = function(){
      DefaultService.getCollections().then(function(response){
        //console.log('In Controller getting collection response.', response);
        // clear 'Add word...' input
        vm.collectionIn = '';
        vm.collectionArray = response.data;
        vm.getWordCollection();
      });
    };

    vm.removeCollection = function(id) {
      console.log('Inside .removeCollection with collection id: ', id);

      if(confirm('Are you sure you want to delete this collection?')){
        DefaultService.deleteCollection(id).then(function(response){
          console.log('Delete collection response is:', response);
          console.log('Length: ', vm.getCollectionNames());
        });
      }
    };




    /*---- WORD COLLECTION ----*/
    vm.obtainWord = function(collId, collName) {
      if(vm.wordIn === ''){
        alert('Please enter a word.');
      } else {
        //console.log('Id attached to word is:', collId);
        //console.log('Name attached to word is:', collName);
        var todaysDate = new Date();
        // create object to send to database
        var wordObject = {
          collectionId: collId,
          collectionName: collName,
          word: vm.wordIn,
          // rating: vm.ratingIn,
          dateAdded: todaysDate
        };
        console.log('wordObject:', wordObject);
        DefaultService.addWord(wordObject).then(function(response){
          //console.log('Response from Service: ', response);
          vm.getWordCollection(); // this will call the get function and display to DOM
        });
      }
    };

    vm.getWordCollection = function(){
      DefaultService.getWords().then(function(response){
        //console.log('In Controller getting word response.', response);
        // clear 'Add word...' input
        vm.wordIn = '';
        vm.wordsArray = response.data;
      });
    };

    vm.removeWord = function(id) {
      if(confirm('Are you sure you want to delete this word?')){
        DefaultService.deleteWord(id).then(function(response){
          console.log('Delete word response is:', response);
          vm.getWordCollection();
        });
      }
    };

    vm.readWord = function(word){
      console.log('Play button clicked: ', word);
      responsiveVoice.speak(word, "US English Male", {volume: 1, rate: 0.9});
    };


}
