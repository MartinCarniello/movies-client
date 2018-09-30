'use strict';

angular.module('myApp.controllers', []).
controller('navController', function($window, $scope, $location) {
	$scope.loggedIn = $window.localStorage.getItem("moviesJWT") !== null;

  $scope.getClass = function(path) {
    return ($location.path().substr(0, path.length) === path) ? 'active' : '';
  };

  $scope.logOut = function() {
  	$window.localStorage.removeItem("moviesJWT");
  	$window.location.reload();
  };
});