var app = angular.module('docsApp', ['ngMaterial', 'ngAnimate', 'ngRoute', 'ngAria']);
var baseURL = window.location.origin;
var token = '';

app.config(function($routeProvider) {
    $routeProvider
    // route for the home page
        .when('/', {
            templateUrl: 'pages/signin.html',
            controller: 'mainController'
        })
        .when('/movies', {
            templateUrl: 'pages/movies.html',
            controller: 'mainController'
        })
        // route for the about page
        .when('/users', {
            templateUrl: 'pages/users.html',
            controller: 'mainController'
        })
        // route for the contact page
        .when('/signup', {
            templateUrl: 'pages/signup.html',
            controller: 'mainController'
        })
        .when('/signin', {
            templateUrl: 'pages/signin.html',
            controller: 'mainController'
        });
});

app.controller('mainController', function($scope, $http) {
    $scope.signin = function() {
        console.log($scope.user);
        $http({
            method: 'POST',
            url: baseURL + '/authenticate',
            data: {
                name: $scope.user.name,
                password: $scope.user.password
            }
        }).then(function(response) {
            console.log(response);
            token = response.data.token;
        }, function(response) {
            console.log(response.data.message);
        });
    }

    $scope.signup = function() {
        console.log($scope.user);
        $http({
            method: 'POST',
            url: baseURL + '/signup',
            data: {
                id: $scope.user.id,
                name: $scope.user.name,
                password: $scope.user.password
            }
        }).then(function(response) {
            console.log(response);
            alert('Kết quả: ' + response.data.success);
        }, function(response) {
            console.log(response.data);
        });
    }

    $scope.loadUsers = function() {
        $http({
            method: 'GET',
            url: baseURL + '/users?token=' + token,
        }).then(function(response) {
            console.log(response);
            $scope.users = response.data;
        }, function(response) {
            console.log(response.data);
        });
    }

    $scope.loadMovies = function() {
        $http({
            method: 'GET',
            url: baseURL + '/movies?token=' + token,
        }).then(function(response) {
            console.log(response);
            $scope.movies = response.data;
            console.log($scope.movies);
        }, function(response) {
            console.log(response.data);
        });
    }
});
