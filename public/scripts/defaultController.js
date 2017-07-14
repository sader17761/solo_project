/*-------- CONTROLLER --------*/

var myApp = angular.module('myApp', ['ngRoute', "xeditable"]);

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
    vm.spellingSentenceArray = [];
    vm.incorrectWordsArray = []; // gets filled when a word is spelled incorrectly.
    vm.allIncorrectWords = [];
    vm.quoteMessage = true;
    vm.collectionMessage = false; // turns to true when collection is selected.
    vm.quizState = false; // turns to true when the start quiz button is clicked.
    vm.isDisabled = false; // disabled when start quiz button is clicked.
    vm.submitQuiz = false; // will show at the completion of quiz.
    vm.sortCollections = 'collName';
    vm.wordCount = 1; // keeps track of current word in quiz.
    vm.numCorrect = 0; // keeps track of all correct spellings.
    vm.numIncorrect = 0; // keeps track of all incorrect spellings.
    vm.definitionCount = 0;
    vm.congrats = ["You're Awesome!", "You're a Rockstar!", "BOOM!", "Brilliant!", "Excellent!", "Fantastic!", "Impressive!", "Mind-Blowing!", "Outstanding!", "Shazam!", "Remarkable!", "Stupendous!", "You're the Bomb!", "You Rock!", "Awesome!"];
    var sound1 = new Audio('sound/app-5.mp3');

    vm.sort = function(button){
      if(button === 'collection'){
        vm.sortCollections = 'collName';
      } else {
        vm.sortCollections = 'gradeLevel';
      }

    };


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
        vm.randomQuote();
        vm.spellingWordArray = [];
        vm.spellingSentenceArray = [];
        vm.incorrectWordsArray = [];
        vm.isDisabled = false;
        vm.submitQuiz = false;
        vm.quoteMessage = true;
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
        for (var i = 0; i < response.data.length; i++) {
          for (var y = 0; y < response.data[i].wordsIncorrect.length; y++) {
            vm.allIncorrectWords.push(response.data[i].wordsIncorrect[y]);
          }
        }
        console.log('All incorrect words: ', vm.allIncorrectWords);
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
      if(vm.checkSpellingIn === '' || vm.checkSpellingIn === undefined) {
        swal({
          imageUrl: 'images/error.png',
          title: 'Oops...',
          text: "You forgot to attempt the word!",
          width: 600,
          padding: 20,
          confirmButtonColor: '#b00000',
        });
      } else {
      var wordToLowerCase = wordToBeChecked.toLowerCase();

      var randomNum = Math.floor(Math.random() * 14) + 0;
      console.log('Random Number is: ', randomNum);

      if(wordToLowerCase === vm.spellingWordArray[vm.wordCount - 1]){
        sound1.play();
        swal({
          imageUrl: 'images/thumbsup.png',
          title: vm.congrats[randomNum],
          width: 600,
          padding: 20,
          confirmButtonColor: '#00abc2',
          timer: 5000
        }).then(
          function () {},
          // handling the promise rejection
          function (dismiss) {
            if (dismiss === 'timer') {
              console.log('I was closed by the timer');
            }
          }
        );
        vm.numCorrect += 1;
      } else {
          responsiveVoice.speak('Sorry, that was incorrect.', "US English Female", {volume: 1, rate: 0.9});

          responsiveVoice.speak( 'The correct way to spell ' + vm.spellingWordArray[vm.wordCount - 1] + ' is ', "US English Female", {volume: 1, rate: 0.9});

          for (var i = 0; i < vm.spellingWordArray[vm.wordCount - 1].length; i++) {
            responsiveVoice.speak(vm.spellingWordArray[vm.wordCount - 1][i], "US English Female", {volume: 1, rate: 0.8});
          }

          var time = (vm.spellingWordArray[vm.wordCount - 1].length * 1000) + 5000;
          console.log('Time = ', time);

          swal({
            imageUrl: 'images/error.png',
            title: '- ' + vm.spellingWordArray[vm.wordCount - 1] + ' -',
            text:  'Sorry, that was incorrect.',
            width: 600,
            padding: 20,
            confirmButtonColor: '#b00000',
            timer: time
          }).then(
            function () {},
            // handling the promise rejection
            function (dismiss) {
              if (dismiss === 'timer') {
                console.log('I was closed by the timer');
              }
            }
          );

        vm.numIncorrect += 1;
        vm.incorrectWordsArray.push(vm.spellingWordArray[vm.wordCount - 1]);
        console.log('List of incorrect words: ', vm.incorrectWordsArray);
      }
      vm.gameComplete(); // after each word, the quiz is checked for completion.
      vm.checkSpellingIn = '';  // input is emptied after spell check.
      vm.wordCount += 1; // adds 1 to word count.
    }
    }; // end of checkSpelling function




    // Reads current word
    vm.readSpellingWord = function() {
      responsiveVoice.speak(vm.spellingWordArray[vm.wordCount - 1], "US English Female", {volume: 1, rate: 0.8});
    };

    vm.readSentence = function() {
      responsiveVoice.speak(vm.spellingSentenceArray[vm.wordCount - 1], "US English Female", {volume: 1, rate: 0.85});
    };

    // Reads current word definition
    vm.readDef = function() {
      DefaultService.getAudio(vm.spellingWordArray[vm.wordCount - 1]).then(function(){
        //console.log('back with:', DefaultService.wordObjects);
        responsiveVoice.speak(DefaultService.wordObjects[vm.definitionCount].text, "US English Female", {volume: 1, rate: 0.85});
        if(vm.definitionCount < DefaultService.wordObjects.length) {
          vm.definitionCount++;
        } else {
          vm.definitionCount = 0;
        }
        console.log('Definition Count: ', vm.definitionCount);
      });
    };

    // Reads 'part of speech' (noun, verb, adjective, etc...)
    vm.readSpeech = function() {
      DefaultService.getAudio(vm.spellingWordArray[vm.wordCount - 1]).then(function(){
        responsiveVoice.speak(vm.spellingWordArray[vm.wordCount - 1] + ', is a ' + DefaultService.wordObjects[0].speech, "US English Female", {volume: 1, rate: 0.9});
      });
    };

    // Read word in admin. (text to speech)
    vm.readWord = function(word, sentence) {
      // console.log('Play button clicked: ', word);
      responsiveVoice.speak(word, "US English Female", {volume: 1, rate: 0.8});
      responsiveVoice.speak(sentence, "US English Female", {volume: 1, rate: 0.85});
    };





    /*---- COLLECTION NAME ----*/
    vm.obtainCollection = function() {
      if (vm.collectionIn === '' || vm.adminGradeIn === ''){
        swal({
          imageUrl: 'images/error.png',
          title: 'Oops...',
          text: "Please enter a collection name and select a grade level!",
          width: 830,
          padding: 20,
          confirmButtonColor: '#b00000',
        });
      } else {
        //console.log('In controller, sending collection.');
        var todaysDate = new Date();
        // create object to send to database
        var collectionObject = {
          date: todaysDate,
          collName: vm.collectionIn,
          gradeLevel: vm.adminGradeIn,
          createdBy: vm.fname + ' ' + vm.lname
        };
        DefaultService.addCollection(collectionObject).then(function(response){
          console.log('Response from Service: ', response);
          if(response.data === 'Exists'){
            vm.collectionIn = '';
            swal({
              imageUrl: 'images/error.png',
              title: 'Oops...',
              text: "Sorry, that collection already exists!",
              width: 830,
              padding: 20,
              confirmButtonColor: '#b00000',
            });
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
        vm.adminGradeIn = '';
        vm.adminCollectionArray = response.data;
        vm.collectionArray = [];
        for (var i = 0; i < response.data.length; i++) {
          if(vm.grade === response.data[i].gradeLevel){
            vm.collectionArray.push(response.data[i]);
          }
        }
        vm.getWordCollection();
        vm.getQuizResults();

      });
    };

    vm.removeCollection = function(id) {
      console.log('Inside .removeCollection with collection id: ', id);

      swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        width: 830,
        padding: 20,
        showCancelButton: true,
        confirmButtonColor: '#00abc2',
        cancelButtonColor: '#b00000',
        confirmButtonText: 'Confirm'
      }).then(function () {
        DefaultService.deleteCollection(id).then(function(response){
          vm.getCollectionNames();
        });
          swal({
            title: 'Deleted!',
            text: "The collection has been deleted.",
            type: 'success',
            width: 830,
            padding: 20,
            confirmButtonColor: '#00abc2',
            timer: 2000
          });
      });

    };





    /*---- WORD COLLECTION ----*/
    vm.obtainWord = function(collId, collName) {
      if(vm.wordIn === '' || vm.sentenceIn === ''){
        swal({
          imageUrl: 'images/error.png',
          title: 'Oops...',
          text: "Please enter a word and a sentence!",
          width: 830,
          padding: 20,
          confirmButtonColor: '#b00000',
        });
      } else {
        var todaysDate = new Date();
        // create object to send to database
        var wordObject = {
          collectionId: collId,
          collectionName: collName,
          word: vm.wordIn.toLowerCase(),
          sentence: vm.sentenceIn.toLowerCase(),
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
        vm.sentenceIn = '';
        vm.wordsArray = response.data;
        //console.log('This is what comes back in the words array:', vm.wordsArray);
      });
    };

    vm.removeWord = function(id) {
      swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        width: 830,
        padding: 20,
        showCancelButton: true,
        confirmButtonColor: '#00abc2',
        cancelButtonColor: '#b00000',
        confirmButtonText: 'Confirm'
      }).then(function () {
        DefaultService.deleteWord(id).then(function(response){
          vm.getWordCollection();
        });
          swal({
            title: 'Deleted!',
            text: "The word has been deleted.",
            type: 'success',
            width: 830,
            padding: 20,
            confirmButtonColor: '#00abc2',
            timer: 2000
          });
      });
    };

    vm.editFields = function(id, word, sentence) {
      swal.setDefaults({
        input: 'text',
        width: 600,
        padding: 20,
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        animation: false,
        progressSteps: ['1', '2']
      });

      var steps = [
        {
          title: 'Edit Word',
        },
        'Edit Sentence'
      ];

      swal.queue(steps).then(function (result) {
        console.log('RESULTS: ', result);
          swal.resetDefaults();
          swal({
            title: 'All done!',
            confirmButtonText: 'Confirm',
            showCancelButton: false
          });
          var editObj = {
            _id: id,
            word: result[0],
            sentence: result[1]
          };
          console.log('Edit Object:', editObj);
          DefaultService.editSelection(editObj).then(function(response){
            vm.getWordCollection();
          });
        }, function () {
      });
    };

    // called from the student dashboard...
    vm.getSelectedWords = function(id){
      console.log('ID: ', id);
        if(vm.fname){
        DefaultService.getSelectedWords(id).then(function(response){
          for (var i = 0; i < response.data.length; i++) {
            vm.spellingWordArray.push(response.data[i].word);
            vm.spellingSentenceArray.push(response.data[i].sentence);
          }
          console.log('Spelling Array:', vm.spellingWordArray);
          vm.selectedWordsArray = response.data;
          vm.selectedWordCollection = vm.selectedWordsArray[0].collectionName;
          vm.wordArrayLength = vm.selectedWordsArray.length;
          vm.collectionMessage = true;
          vm.quoteMessage = false;
        });
      } else {
        swal({
          imageUrl: 'images/error.png',
          title: 'Oops...',
          text: "Please login before taking a quiz!",
          width: 830,
          padding: 20,
          confirmButtonColor: '#b00000',
        });
      }
    };




    /*---- REGISTRATION / LOGIN----*/
    vm.registerUser = function() {
      if(vm.fnameIn === '' || vm.lnameIn === '' || vm.emailIn === '' || vm.usernameIn === '' || vm.passwordIn === '' || vm. passwordConfirmIn === '' || vm.gradeIn === ''){
        swal({
          imageUrl: 'images/error.png',
          title: 'Oops...',
          text: "Please fill in all required fields!",
          width: 830,
          padding: 20,
          confirmButtonColor: '#b00000',
        });
      } else {
        if(vm.passwordIn !== vm.passwordConfirmIn) {
          swal({
            imageUrl: 'images/error.png',
            title: 'Oops...',
            text: "Passwords don't match!",
            width: 830,
            padding: 20,
            confirmButtonColor: '#b00000',
          });
          vm.passwordIn = '';
          vm.passwordConfirmIn = '';
        } else {
          if(vm.gradeIn == 'parent' || vm.gradeIn == 'teacher'){
            vm.adminRights = 1;
          } else {
            vm.adminRights = 0;
          }
          // create object to send to database
          var userObject = {
            fname: vm.fnameIn,
            lname: vm.lnameIn,
            email: vm.emailIn,
            username: vm.usernameIn,
            password: vm.passwordIn,
            grade: vm.gradeIn,
            adminRights: vm.adminRights,
            image: vm.uploadIn
          };
          DefaultService.registerNewUser(userObject).then(function(response){
            $location.path('/login').replace();
            vm.fnameIn = '';
            vm.lnameIn = '';
            vm.emailIn = '';
            vm.usernameIn = '';
            vm.passwordIn = '';
            vm.passwordConfirmIn = '';
            vm.gradeIn = '';
            vm.imageIn = '';
          });
        }
      }
    };

    vm.loginUser = function() {
        console.log('Login User Clicked!');
        vm.randomQuote();
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
            } else {
              swal({
                imageUrl: 'images/error.png',
                title: 'Oops...',
                text: "Username and Password do not match. Please try again, or Register.",
                width: 830,
                padding: 20,
                confirmButtonColor: '#b00000',
              });
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
        vm.rights = response.data[0].adminRights; // capturing adminRights after login
        });
      };

    vm.getLoginInformation = function(){
      vm.username = localStorage.getItem('username');
      vm.password = localStorage.getItem('password');
      vm.fname = localStorage.getItem('firstname');
      vm.lname = localStorage.getItem('lastname');
      vm.grade = localStorage.getItem('grade');
      vm.rights = localStorage.getItem('rights');
      if(localStorage.getItem('grade') === '6') {
        vm.grade = '6th Grade';
      }
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
      vm.spellingSentenceArray = [];
      vm.incorrectWordsArray = [];
      vm.allIncorrectWords = [];
      vm.collectionMessage = false;
      vm.quizState = false;
      vm.isDisabled = false;
      vm.submitQuiz = false;
      vm.wordCount = 1;
      vm.numCorrect = 0;
      vm.numIncorrect = 0;
    };


    vm.randomQuote = function(){
      vm.motivationalQuotes = [
        {
          quote: "Don’t let what you can’t do stop you from doing what you can do.", author: "John Wooden"
        },
        {
          quote: "Happiness doesn't result from what we get, but from what we give.", author: "Ben Carson"
        },
        {
          quote: "Anything is possible. Anything can be.",
          author: "Shel Silverstein"
        },
        {
          quote: "It’s not what happens to you, but how you react to it that matters.",
          author: "Epictetus"
        },
        {
          quote: "Being kind is never wasted.",
          author: ""
        },
        {
          quote: "When you know better you do better.",
          author: "Maya Angelou"
        },
        {
          quote: "Do what you can, with what you have, where you are.",
          author: "Theodore Roosevelt"
        },
        {
          quote: "You always pass failure on the way to success.",
          author: "Mickey Rooney"
        },
        {
          quote: "Make each day your masterpiece.",
          author: "John Wooden"
        },
        {
          quote: "Reach high, for stars lie hidden in your soul. Dream deep, for every dream precedes the goal.",
          author: "Pamela Vaull Starr"
        },
        {
          quote: "No one is perfect – that’s why pencils have erasers.",
          author: "Wolfgang Riebe"
        },
        {
          quote: "Never waste a minute thinking of anyone you don’t like.",
          author: "Eisenhower"
        },
        {
          quote: "Only surround yourself with people who will lift you higher.",
          author: "Oprah Winfrey"
        },
        {
          quote: "Why fit in when you were born to stand out?",
          author: "Dr. Suess"
        },
        {
          quote: "Never let the odds keep you from doing what you know in your heart you were meant to do.",
          author: "H. Jackson Brown"
        },
        {
          quote: "There is a voice inside of you, that whispers all day long, I feel this is right for me, I know that this is wrong.",
          author: ""
        },
        {
          quote: "You can steer yourself any direction you choose.",
          author: "Dr. Suess"
        },
        {
          quote: "The more that you read, the more things you will know. The more that you learn, the more places you’ll go.",
          author: "Dr. Suess"
        },
        {
          quote: "I think I can. I know I can.",
          author: ""
        },
        {
          quote: "We know what we are but know not what we may be.",
          author: "Shakespeare"
        },
        {
          quote: "Wheresoever you go, go with all your heart.",
          author: "Confucious"
        },
        {
          quote: "Don’t cry because it’s over, smile because it happened.",
          author: "Dr. Seuss"
        },
        {
          quote: "Yesterday is history. Tomorrow is a mystery. Today is a gift. That’s why we call it ‘The Present’.",
          author: "Eleanor Roosevelt"
        },
        {
          quote: "Fall seven times, stand up eight.",
          author: "Japanese Proverb"
        },
        {
          quote: "What one can be one must be.",
          author: "Unknown"
        },
        {
          quote: "Life is a gift.",
          author: ""
        },
        {
          quote: "Not only must we be good, but we must also be good for something.",
          author: "Henry David Thoreau"
        },
        {
          quote: "You’ve got to do your own growing, no matter how tall your grandfather was.",
          author: "Irish Proverb"
        },
        {
          quote: "We make a living by what we get, but we make a life by what we give.",
          author: "Winston Churchill"
        },
        {
          quote: "Row, row, row your boat. Gently down the stream. Merrily, merrily, merrily, merrily, life is but a dream.",
          author: "Alice Munro"
        },
        {
          quote: "I am only one, but I am one. I cannot do everything, but I can do something. And I will not let what I cannot do interfere with what I can do.",
          author: "Edward Everett Hale"
        },
        {
          quote: "Have a heart that never hardens, and a temper that never tires and a touch that never hearts.",
          author: "Charles Dickens"
        },
        {
          quote: "May you live all the days of your life.",
          author: "Jonathan Swift"
        },
        {
          quote: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose. You’re on your own. And you know what you know. And YOU are the one who’ll decide where to go…",
          author: "Dr. Seuss"
        },
        {
          quote: "The time is always right to do what is right.",
          author: "Martin Luther King, Jr."
        },
        {
          quote: "Every action in our lives touches on some chord that will vibrate in eternity.",
          author: "Edwin Hubbel Chapin"
        },
        {
          quote: "In any moment of decision, the best thing you can do is the right thing. The worst thing you can do is nothing.",
          authore: "Theordore Roosevelt"
        },
      ];

      var randomNum = Math.floor(Math.random() * 36) + 0;
      console.log('Random Number is: ', randomNum);

      vm.quote = vm.motivationalQuotes[randomNum].quote;
      vm.author = vm.motivationalQuotes[randomNum].author;

    }; // end of vm.randomQuote function





      vm.chartData = function() {

        var obj = { };
          for (var i = 0; i < vm.allIncorrectWords.length; i++) {
             obj[vm.allIncorrectWords[i]] = (obj[vm.allIncorrectWords[i]] || 0) + 1;
          }

        var sorted = [];

        for (var words in obj){
          sorted.push([words, obj[words]]);
        }

        sorted.sort(function(a, b) {
          return a[1] - b[1];
        });

        var sortedWords = sorted.reverse();
        console.log(sortedWords);

        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [sortedWords[0][0], sortedWords[1][0], sortedWords[2][0], sortedWords[3][0], sortedWords[4][0], sortedWords[5][0]],
            datasets: [{
                label: '# of misspellings',
                data: [sortedWords[0][1], sortedWords[1][1], sortedWords[2][1], sortedWords[3][1], sortedWords[4][1], sortedWords[5][1]],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
};


}
