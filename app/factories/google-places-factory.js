'use strict';

angular.module("TravelBuddy").factory("GMapsFactory", (GMapsCreds, $http, $q) => {

  function placesSearch(searchString) {
    return $q((resolve, reject) => {
      $http.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchString}&key=${GMapsCreds.apiKey}`)
        .then((places) => {
          resolve(places.data.results);
        });
    });
  }


  return {placesSearch};

});