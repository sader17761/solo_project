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
  }).when('/quiz', {
      templateUrl: "views/partials/quiz.html",
      controller: "DefaultController"
  });
});

myApp.controller('DefaultController', DefaultController);

function DefaultController(DefaultService, $location) {
    var vm = this;

    /*---- IMAGES ----*/

    vm.bodyStyle = {background: "url(https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/b0e53331516629.565449774c2d4.png)"};

    /*---- Global Variables ----*/
    vm.spellingWordArray = []; // gets filled when a collection is selected.
    vm.incorrectWordsArray = []; // gets filled when a word is spelled incorrectly.
    vm.collectionMessage = false; // turns to true when collection is selected.
    vm.quizState = false; // turns to true when the start quiz button is clicked.
    vm.isDisabled = false; // disabled when start quiz button is clicked.
    vm.submitQuiz = false; // will show at the completion of quiz.
    vm.wordCount = 1; // keeps track of current word in quiz.
    vm.numCorrect = 0; // keeps track of all correct spellings.
    vm.numIncorrect = 0; // keeps track of all incorrect spellings.




    /*---- TAKE QUIZ ----*/
    vm.takeQuiz = function(){
      vm.quizState = true;
      vm.collectionMessage = false;
      vm.isDisabled = true;
    };

    vm.submitQuizScore = function(){
      var todaysDate = new Date();
      // create object to send to database
      var quizObject = {
        date: todaysDate,
        collName: vm.selectedWordCollection,
        studentName: vm.fname + ' ' + vm.lname,
        numWordsCorrect: vm.numCorrect,
        numWordsIncorrect: vm.numIncorrect,
        wordsIncorrect: vm.incorrectWordsArray
      };
      DefaultService.addQuizResults(quizObject).then(function(response){
        console.log('Response from Service: ', response);
        vm.spellingWordArray = [];
        vm.isDisabled = false;
        vm.submitQuiz = false;
        vm.wordCount = 1;
        vm.numCorrect = 0;
        vm.numIncorrect = 0;
      }); // end of addQuizResults
    };

    vm.getQuizResults = function(){
      DefaultService.getResults().then(function(response){
        //console.log('In Controller getting results response.', response);
        vm.resultsData = response.data;
        console.log('Results response: ', vm.resultsData);
      });
    };

    vm.gameComplete = function(){
      if(vm.wordCount === vm.spellingWordArray.length){
        vm.wordCount = vm.spellingWordArray.length;
        vm.submitQuiz = true;
        vm.quizState = false;
      }
    };

    vm.checkSpelling = function(wordToBeChecked){
      var wordToLowerCase = wordToBeChecked.toLowerCase();

      if(wordToLowerCase === vm.spellingWordArray[vm.wordCount - 1]){
        iziToast.success({
            title: '',
            color: 'green',
            position: 'center',
            timeout: 2000,
            message: 'CORRECT!'
        });
        vm.numCorrect += 1;
      } else {
        iziToast.success({
            title: '',
            color: 'red',
            position: 'center',
            timeout: 2000,
            message: 'Sorry, incorrect.'
        });
        vm.numIncorrect += 1;
        vm.incorrectWordsArray.push(vm.spellingWordArray[vm.wordCount - 1]);
        console.log('List of incorrect words: ', vm.incorrectWordsArray);
      }
      vm.gameComplete(); // after each word, the quiz is checked for completion.
      vm.checkSpellingIn = '';  // input is emptied after spell check.
      vm.wordCount += 1; // adds 1 to word count.
    }; // end of checkSpelling function




    // Reads current word
    vm.readSpellingWord = function(){
      responsiveVoice.speak(vm.spellingWordArray[vm.wordCount - 1], "US English Female", {volume: 1, rate: 0.9});
    };

    // Reads current word definition
    vm.readDef = function(){
      DefaultService.getAudio(vm.spellingWordArray[vm.wordCount - 1]).then(function(){
        //console.log('back with:', DefaultService.wordObjects);
        responsiveVoice.speak(DefaultService.wordObjects[0].text, "US English Female", {volume: 1, rate: 0.85});
      });
    };

    // Reads 'part of speech' (noun, verb, adjective, etc...)
    vm.readSpeech = function(){
      DefaultService.getAudio(vm.spellingWordArray[vm.wordCount - 1]).then(function(){
        responsiveVoice.speak(vm.spellingWordArray[vm.wordCount - 1] + ', is a ' + DefaultService.wordObjects[0].speech, "US English Female", {volume: 1, rate: 0.9});
      });
    };

    // Read word in admin. (text to speech)
    vm.readWord = function(word){
      console.log('Play button clicked: ', word);
      responsiveVoice.speak(word, "US English Female", {volume: 1, rate: 0.9});
    };





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
        console.log('In Controller getting collection response.', response);
        // clear 'Add word...' input
        vm.collectionIn = '';
        vm.collectionArray = response.data;
        vm.getWordCollection();
        vm.getQuizResults();
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
        var todaysDate = new Date();
        // create object to send to database
        var wordObject = {
          collectionId: collId,
          collectionName: collName,
          word: vm.wordIn.toLowerCase(),
          dateAdded: todaysDate
        };
        console.log('wordObject:', wordObject);
        DefaultService.addWord(wordObject).then(function(response){
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
        //console.log('This is what comes back in the words array:', vm.wordsArray);
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

    // called from the student dashboard...
    vm.getSelectedWords = function(id){
      console.log('ID: ', id);
        if(vm.fname){
        DefaultService.getSelectedWords(id).then(function(response){
          for (var i = 0; i < response.data.length; i++) {
            vm.spellingWordArray.push(response.data[i].word);
          }
          console.log('Spelling Array:', vm.spellingWordArray);
          vm.selectedWordsArray = response.data;
          vm.selectedWordCollection = vm.selectedWordsArray[0].collectionName;
          vm.wordArrayLength = vm.selectedWordsArray.length;
          vm.collectionMessage = true;
        });
      } else {
        alert('Please log in before taking a quiz.');
      }
    };




    /*---- REGISTRATION / LOGIN----*/
    vm.registerUser = function() {
      if(vm.passwordIn !== vm.passwordConfirmIn) {
        alert('Your passwords don\'t match.');
        vm.passwordIn = '';
        vm.passwordConfirmIn = '';
      } else {
        // create object to send to database
        var userObject = {
          fname: vm.fnameIn,
          lname: vm.lnameIn,
          email: vm.emailIn,
          username: vm.usernameIn,
          password: vm.passwordIn,
          grade: vm.gradeIn,
          adminRights: 0
        };
        console.log('userObject:', userObject);
        DefaultService.registerNewUser(userObject).then(function(response){
          vm.fnameIn = '';
          vm.lnameIn = '';
          vm.emailIn = '';
          vm.usernameIn = '';
          vm.passwordIn = '';
          vm.passwordConfirmIn = '';
          vm.gradeIn = '';
        });
      }
    };

    vm.loginUser = function() {
        console.log('Login User Clicked!');
        var credentials = {
            username: vm.loginUsernameIn,
            password: vm.loginPasswordIn
        };
        DefaultService.postLogin(credentials).then(function(response) {
          //console.log('Login Response:', response);
            if (response.data === 'bingo') {
                vm.getUserInformation(credentials.username);
                localStorage.setItem('username', credentials.username);
                localStorage.setItem('password', credentials.password);
                vm.loginUsernameIn = '';
                vm.loginPasswordIn = '';
                //alert('It\'s a match...welcome back!');
            } else {
              alert("Username and Password do not match.  Please try again, or Register.");
              vm.loginUsernameIn = '';
              vm.loginPasswordIn = '';
            }
        });
    };

    vm.getUserInformation = function(username){
      DefaultService.getAllUserInformation(username).then(function(response){
        //console.log('User logged is as: ', response.data[0].fname);
        if(response.data[0].adminRights === 1){
          $location.path('/adminDashboard').replace();
        } else {
          $location.path('/studentDashboard').replace();
        }
        localStorage.setItem('firstname', response.data[0].fname);
        localStorage.setItem('lastname', response.data[0].lname);
        localStorage.setItem('grade', response.data[0].grade);
        localStorage.setItem('rights', response.data[0].adminRights);
        vm.fname = response.data[0].fname; // capturing first name after login
        vm.lname = response.data[0].lname; // capturing last name after login
        vm.grade = response.data[0].grade; // capturing last name after login
        vm.rights = response.data[0].adminRights; // capturing last name after login
      });
    };

    vm.getLoginInformation = function(){
      vm.username = localStorage.getItem('username');
      vm.password = localStorage.getItem('password');
      vm.fname = localStorage.getItem('firstname');
      vm.lname = localStorage.getItem('lastname');
      vm.grade = localStorage.getItem('grade');
      vm.rights = localStorage.getItem('rights');
    };

    vm.logout = function() {
      vm.username = '';
      vm.password = '';
      vm.fname = '';
      vm.lname = '';
      vm.rights = '';
      vm.grade = '';
      localStorage.setItem('username', '');
      localStorage.setItem('password', '');
      localStorage.setItem('firstname', '');
      localStorage.setItem('lastname', '');
      localStorage.setItem('grade', '');
      localStorage.setItem('rights', '');
      vm.spellingWordArray = [];
      vm.incorrectWordsArray = [];
      vm.collectionMessage = false;
      vm.quizState = false;
      vm.isDisabled = false;
      vm.submitQuiz = false;
      vm.wordCount = 1;
      vm.numCorrect = 0;
      vm.numIncorrect = 0;
    };



}
