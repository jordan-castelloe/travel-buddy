'use strict';

angular.module("TravelBuddy").controller("BrowseTripsCtrl", function ($scope, $controller, TripFactory, UserFactory) {
  
  // inherits functions to get starting points and photos for trips
  $controller("HomepageCtrl", { $scope: $scope });

  // loops through $scope.trips and checks if each trip is in the current user's favorites
  // if the user has favorited a given trip, give that trip a property of 'favorite' with a value of 'true'
  const markAsFaves = (favoriteTrips) => {
    let allTrips = $scope.trips;
    allTrips.forEach(trip => {
      for(let fave in favoriteTrips){
        if (trip.id === favoriteTrips[fave].id){
          trip.favorite = true;
        }
      }
      return trip;
    });
  };

  // gets current user's favorite trips from Firebase
 const getFavorites = (uid) => {
    TripFactory.getMyFavorites(uid)
      .then(faves => {
        markAsFaves(faves);
      });
  };
  
  // on authentication state change, get the user's favorites
  firebase.auth().onAuthStateChanged(function (user) {
    if(user){
      getFavorites(user.uid);
    }
  });


  // assembles favorite object and posts to firebase
  const postFavorite = (tripId) => {
    let faveObj = {
      id: tripId,
      uid: firebase.auth().currentUser.uid
    };
    TripFactory.addFavorite(faveObj)
    .then(data => {
      getFavorites(firebase.auth().currentUser.uid);
    });
  };

  // checks whether a user is logged in and then calls postFavorite function
  $scope.addFavorite = (tripId) => {
    if (firebase.auth().currentUser !== null){
      postFavorite(tripId);
    } else {
      UserFactory.login()
      .then(()=> {
        postFavorite(tripId);
      });
    }
  };

  // defined in homepage.js, gets all public trips and formats with starting points and cover photos
  $scope.getTrips();

  if(firebase.auth().currentUser !== null){
    getFavorites(firebase.auth().currentUser.uid);
  }
  

});