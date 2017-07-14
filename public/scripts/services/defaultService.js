/*-------- SERVICE --------*/

myApp.service('DefaultService', function($http) {
  var sv = this;


/*---- QUIZ RESULTS ----*/
  sv.addQuizResults = function(scoreResults){
    console.log('Score Results: ', scoreResults);
    return $http.post('/score', scoreResults).then(function(response){
      console.log('Back from adding quiz scores to DB with: ', response);
      return response;  // return is needed when using .then in controller
    });
  };

  sv.getResults = function() {
    return $http.get('/score').then(function(response){
      //console.log('DB -get- results response is:', response);
      return response;
    });
  };


  /*---- AUDIO INFORMATION FROM API ----*/
  sv.getAudio = function(input){
    console.log('In getAudio with:', input);

    sv.wordObjects = [];

    // var webster = 'http://www.dictionaryapi.com/api/v1/references/sd2/xml/' + input + '?key=c718d2e8-bf66-4605-bfb8-fece23e2a059';

    var wordnik = 'https://api.wordnik.com:80/v4/word.json/' + input + '/definitions?limit=200&includeRelated=true&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';

    return $http({
      method: "GET",
      url: wordnik
    }).then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        sv.wordObject = {
          id: i,
          word: response.data[i].word,
          speech: response.data[i].partOfSpeech,
          text: response.data[i].text
        };
        sv.wordObjects.push(sv.wordObject);
      }
      console.log('Word Objects:', sv.wordObjects);
  }); // end of .then response
}; // end of getAudio function


  /*---- COLLECTION NAME ----*/
  sv.addCollection = function(collectionToAdd) {
    //console.log("In Service with the collection:", collectionToAdd);
    return $http.post('/collections', collectionToAdd).then(function(response){
      //console.log('Back from adding collection to DB with: ', response);
      return response;
    });
  };

  sv.getCollections = function() {
    return $http.get('/collections').then(function(response){
      console.log('DB -get- response is:', response);
      return response;
    });
  };

  sv.deleteCollection = function(id){
    console.log('In .deleteCollection with id: ', id);
    return $http.delete('/collections/' + id).then(function(response){
      console.log('Deleted collection:', response);
      return response;
    });
  };


  /*---- WORD COLLECTION ----*/
  sv.addWord = function(wordToAdd) {
    console.log("In Service with the word to add:", wordToAdd);
    return $http.post('/words', wordToAdd).then(function(response){
      //console.log('Back from adding word to DB with: ', response);
      return response;
    });
  };

  sv.getWords = function() {
    return $http.get('/words').then(function(response){
      //console.log('DB -get- response is:', response);
      return response;
    });
  };

  sv.getSelectedWords = function(id){
    console.log('ID in service:', id);
    return $http.get('/words/' + id).then(function(response){
      return response;
    });
  };

  sv.deleteWord = function(id){
    return $http.delete('/words/' + id).then(function(response){
      //console.log('Deleted word:', response);
      return response;
    });
  };

  sv.editSelection = function(results) {
    console.log('In service with these results: ', results);
    return $http.put('/words', results).then(function(response){
      console.log('Back from updating word to DB with: ', response);
      return response;
    });
  };


  /*---- REGISTRATION ----*/
  sv.registerNewUser = function(newUser){
    console.log('In service with new user', newUser);
    return $http.post('/register', newUser).then(function(response){
      return response;
    });
  };

  sv.postLogin = function(loginCredentials){
    console.log('In service with loginCredentials:', loginCredentials);
    return $http.post('/', loginCredentials).then(function(response){
      return response;
    });
  };

  sv.getAllUserInformation = function(username){
    console.log('Username in service:', username);
    return $http.get('/register/' + username).then(function(response){
      return response;
    });
  };

}); // end of myApp.service
