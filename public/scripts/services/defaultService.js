/*-------- SERVICE --------*/

myApp.service('DefaultService', function($http) {
  var sv = this;

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
      //console.log('DB -get- response is:', response);
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

  sv.deleteWord = function(id){
    return $http.delete('/words/' + id).then(function(response){
      //console.log('Deleted word:', response);
      return response;
    });
  };


}); // end of myApp.service
