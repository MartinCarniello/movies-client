'use strict';

angular.module('myApp.moviesPeople', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/moviesPeople/:movieId', {
    templateUrl: 'moviesPeople/moviesPeople.html',
    controller: 'MoviesPeopleCtrl'
  });
}])

.controller('MoviesPeopleCtrl', function($window, $routeParams, $filter, $scope, moviesPeopleService, peopleService) {
	$scope.jwt = $window.localStorage.getItem("moviesJWT");
  $scope.loggedIn = $scope.jwt !== null;
  $scope.movieId = $routeParams.movieId;
  $scope.movieActor = { personId: null, movieId: $scope.movieId, type: 'actor' };
  $scope.movieDirector = { personId: null, movieId: $scope.movieId, type: 'director' };
  $scope.movieProducer = { personId: null, movieId: $scope.movieId, type: 'producer' };
  $scope.moviesPeople = [];
  $scope.people = [];

  $scope.actors = function () {
    return $filter('filter')($scope.moviesPeople, { type: 'actor' });
  };

  $scope.directors = function () {
    return $filter('filter')($scope.moviesPeople, { type: 'director' });
  };

  $scope.producers = function () {
    return $filter('filter')($scope.moviesPeople, { type: 'producer' });
  };

	moviesPeopleService.getMoviesPeople().success(function (moviesPeople) {
    $scope.moviesPeople = $filter('filter')(moviesPeople, { movie_id: $scope.movieId });

    peopleService.getPeople().success(function (people) {
      $scope.people = people;
    }).catch(function(error) {
      alert("Hubo un problema al querer cargar las personas. Intente en otro momento");
    });
  }).catch(function(error) {
  	alert("Hubo un problema al querer cargar las personas. Intente en otro momento");
  });

  $scope.deleteMoviePerson = function(moviePerson) {
  	moviesPeopleService.deleteMoviePerson($scope.jwt, moviePerson).success(function (response) {
	  	var index = $scope.moviesPeople.indexOf(moviePerson);
  		$scope.moviesPeople.splice(index, 1);
	  }).catch(function(error) {
	  	alert("Hubo un problema al querer eliminar la persona. Intente en otro momento");
	  });
  };

  $scope.createMovieActor = function() {
  	moviesPeopleService.createMoviePerson($scope.jwt, $scope.movieActor.movieId, $scope.movieActor.personId, $scope.movieActor.type).success(function (moviePerson) {
	  	$scope.moviesPeople.push(moviePerson);
	  	$scope.moviePerson = {};
	  }).catch(function(error) {
	  	alert("Hubo un problema al querer crear la persona. Intente en otro momento");
	  });
  };

  $scope.createMovieDirector = function() {
    moviesPeopleService.createMoviePerson($scope.jwt, $scope.movieDirector.movieId, $scope.movieDirector.personId, $scope.movieDirector.type).success(function (moviePerson) {
      $scope.moviesPeople.push(moviePerson);
      $scope.moviePerson = {};
    }).catch(function(error) {
      alert("Hubo un problema al querer crear la persona. Intente en otro momento");
    });
  };

  $scope.createMovieProducer = function() {
    moviesPeopleService.createMoviePerson($scope.jwt, $scope.movieProducer.movieId, $scope.movieProducer.personId, $scope.movieProducer.type).success(function (moviePerson) {
      $scope.moviesPeople.push(moviePerson);
      $scope.moviePerson = {};
    }).catch(function(error) {
      alert("Hubo un problema al querer crear la persona. Intente en otro momento");
    });
  };
})

.factory('moviesPeopleService', function($http) {
  var moviesPeopleAPI = {};

  moviesPeopleAPI.getMoviesPeople = function() {
    return $http({
      method: 'GET', 
      url: 'https://it-crowd-movies-api.herokuapp.com/v1/movies_people'
    });
  };

  moviesPeopleAPI.deleteMoviePerson = function(jwt, moviePerson) {
    return $http({
      method: 'DELETE', 
      url: 'https://it-crowd-movies-api.herokuapp.com/v1/movies_people/' + moviePerson.id,
      headers: {
      	'Content-Type': 'application/json',
			  'Authorization': jwt
			},
    });
  };

  moviesPeopleAPI.createMoviePerson = function(jwt, movieId, personId, type) {
    return $http({
      method: 'POST', 
      url: 'https://it-crowd-movies-api.herokuapp.com/v1/movies_people',
      data: {
      	movie_id: movieId,
      	person_id: personId,
        type: type
      },
      headers: {
      	'Content-Type': 'application/json',
			  'Authorization': jwt
			},
    });
  };

  return moviesPeopleAPI;
})

.filter('includedInList', function () {
  var personInList = function (people, person) {
    return people.find(function(arrayPerson) {
      return arrayPerson.person_id === person.id;
    });
  };

  return function (people, peopleAlreadyInList) {
    var filtered = [];
    for (var i = 0; i < people.length; i++) {
      var person = people[i];

      if (!personInList(peopleAlreadyInList(), person)) {
        filtered.push(person);
      }
    }
    return filtered;
  };
});
