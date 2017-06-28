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
  });
});

myApp.controller('DefaultController', DefaultController);

function DefaultController(DefaultService, $location) {
    var vm = this;


    /*---- COLLECTION NAME ----*/
    vm.obtainCollection = function() {

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
    };

    vm.getCollectionNames = function(){
      DefaultService.getCollections().then(function(response){
        //console.log('In Controller getting collection response.', response);
        // clear 'Add word...' input
        vm.collectionIn = '';
        vm.collectionArray = response.data;
      });
    };

    vm.removeCollection = function(id) {
      console.log('Inside .removeCollection with collection id: ', id);
      DefaultService.deleteCollection(id).then(function(response){
        console.log('Delete collection response is:', response);
        vm.getCollectionNames();
      });
    };




    /*---- WORD COLLECTION ----*/
    vm.obtainWord = function(collName) {
      //console.log('In controller, sending word.');
      var todaysDate = new Date();
      // create object to send to database
      var wordObject = {
        collName: collName,
        word: vm.wordIn,
        rating: vm.ratingIn,
        dateAdded: todaysDate
      };
      DefaultService.addWord(wordObject).then(function(response){
        //console.log('Response from Service: ', response);
        vm.getWordCollection(); // this will call the get function and display to DOM
      });
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
      DefaultService.deleteWord(id).then(function(response){
        //console.log('Delete response is:', response);
        vm.getWordCollection();
      });
    };


}
