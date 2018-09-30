'use strict';

angular.module('myApp.movies', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/movies', {
    templateUrl: 'movies/movies.html',
    controller: 'MoviesCtrl'
  });
}])

.controller('MoviesCtrl', function($window, $scope, moviesService) {
	$scope.jwt = $window.localStorage.getItem("moviesJWT");
	$scope.loggedIn = $scope.jwt !== null;
	$scope.movie = {};

	moviesService.getMovies().success(function (movies) {
    $scope.movies = movies;
  }).catch(function(error) {
  	alert("Hubo un problema al querer cargar las peliculas. Intente en otro momento");
  });

  $scope.deleteMovie = function(movie) {
  	moviesService.deleteMovie($scope.jwt, movie).success(function (response) {
	  	var index = $scope.movies.indexOf(movie);
  		$scope.movies.splice(index, 1);
	  }).catch(function(error) {
	  	alert("Hubo un problema al querer eliminar la pelicula. Intente en otro momento");
	  });
  };

  $scope.createMovie = function() {
  	moviesService.createMovie($scope.jwt, $scope.movie.title, $scope.movie.release_year).success(function (movie) {
	  	$scope.movies.push(movie);
	  	$scope.movie = {};
	  }).catch(function(error) {
	  	alert("Hubo un problema al querer crear la pelicula. Intente en otro momento");
	  });
  };
})

.factory('moviesService', function($http) {
  var moviesAPI = {};

  moviesAPI.getMovies = function() {
    return $http({
      method: 'GET', 
      url: 'https://it-crowd-movies-api.herokuapp.com/v1/movies'
    });
  };

  moviesAPI.deleteMovie = function(jwt, movie) {
    return $http({
      method: 'DELETE', 
      url: 'https://it-crowd-movies-api.herokuapp.com/v1/movies/' + movie.id,
      headers: {
      	'Content-Type': 'application/json',
			  'Authorization': jwt
			},
    });
  };

  moviesAPI.createMovie = function(jwt, title, release_year) {
    return $http({
      method: 'POST', 
      url: 'https://it-crowd-movies-api.herokuapp.com/v1/movies',
      data: {
      	title: title,
      	release_year: release_year
      },
      headers: {
      	'Content-Type': 'application/json',
			  'Authorization': jwt
			},
    });
  };

  return moviesAPI;
});
