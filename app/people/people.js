'use strict';

angular.module('myApp.people', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people', {
    templateUrl: 'people/people.html',
    controller: 'PeopleCtrl'
  });
}])

.controller('PeopleCtrl', function($window, $scope, peopleService) {
	$scope.jwt = $window.localStorage.getItem("moviesJWT");
	$scope.loggedIn = $scope.jwt !== null;
	$scope.person = {};

	peopleService.getPeople().success(function (people) {
    $scope.people = people;
  }).catch(function(error) {
  	alert("Hubo un problema al querer cargar las personas. Intente en otro momento");
  });

  $scope.deletePerson = function(person) {
  	peopleService.deletePerson($scope.jwt, person).success(function (response) {
	  	var index = $scope.people.indexOf(person);
  		$scope.people.splice(index, 1);
	  }).catch(function(error) {
	  	alert("Hubo un problema al querer eliminar la persona. Intente en otro momento");
	  });
  };

  $scope.createPerson = function() {
  	peopleService.createPerson($scope.jwt, $scope.person.last_name, $scope.person.first_name, $scope.person.aliases).success(function (person) {
	  	$scope.people.push(person);
	  	$scope.person = {};
	  }).catch(function(error) {
	  	alert("Hubo un problema al querer crear la persona. Intente en otro momento");
	  });
  };
})

.factory('peopleService', function($http) {
  var peopleAPI = {};

  peopleAPI.getPeople = function() {
    return $http({
      method: 'GET', 
      url: 'https://it-crowd-movies-api.herokuapp.com/v1/people'
    });
  };

  peopleAPI.deletePerson = function(jwt, person) {
    return $http({
      method: 'DELETE', 
      url: 'https://it-crowd-movies-api.herokuapp.com/v1/people/' + person.id,
      headers: {
      	'Content-Type': 'application/json',
			  'Authorization': jwt
			},
    });
  };

  peopleAPI.createPerson = function(jwt, last_name, first_name, aliases) {
    return $http({
      method: 'POST', 
      url: 'https://it-crowd-movies-api.herokuapp.com/v1/people',
      data: {
      	last_name: last_name,
      	first_name: first_name,
      	aliases: aliases
      },
      headers: {
      	'Content-Type': 'application/json',
			  'Authorization': jwt
			},
    });
  };

  return peopleAPI;
});