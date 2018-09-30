'use strict';

angular.module('myApp.signin', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signin', {
    templateUrl: 'signin/signin.html',
    controller: 'SigninCtrl'
  });
}])

.controller('SigninCtrl', function($window, $location, $scope, signinService) {
  $scope.signinError = null;
  $window.localStorage.setItem = ("moviesJWT", null);
  $scope.email = null;
  $scope.password = null;
  $scope.loading = false;

  $scope.submitForm = function() {
    $scope.loading = true;
    signinService.signin($scope.email, $scope.password).success(function (jwt) {
      $window.localStorage.moviesJWT = jwt.auth_token;
      // $window.location.reload();
      $location.path('/movies');
      // $window.location.href = '/#!/movies';
    }).catch(function(error) {
      $scope.signinError = error.data.message;
      alert("Hubo un problema al querer loguearse. Intente en otro momento");
    });
    $scope.loading = false;
  };
})

.factory('signinService', function($http) {
  var signinAPI = {};

  signinAPI.signin = function(email, password) {
    return $http({
      method: 'POST', 
      url: 'https://it-crowd-movies-api.herokuapp.com/auth/login',
      data: {
        email: email,
        password: password
      }
    });
  };

  return signinAPI;
});