var app = angular.module('docsApp', ['ngMaterial', 'ngAnimate', 'ngRoute', 'ngAria']);

var token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7Il9fdiI6ImluaXQiLCJhZG1pbiI6ImluaXQiLCJuYW1lIjoiaW5pdCIsImlkIjoiaW5pdCIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwiYWRtaW4iOnRydWUsIm5hbWUiOnRydWUsImlkIjp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiX192IjowLCJhZG1pbiI6ZmFsc2UsIm5hbWUiOiJI4buvdSBEdXkiLCJpZCI6MTY3NzUxMTEzNSwiX2lkIjoiNTgwZGU4MWMzMGY5ZGQwNzRjNTk0YjVlIn0sIl9wcmVzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltudWxsLG51bGxdLCIkX19vcmlnaW5hbF92YWxpZGF0ZSI6W251bGxdLCIkX19vcmlnaW5hbF9yZW1vdmUiOltudWxsXX0sIl9wb3N0cyI6eyIkX19vcmlnaW5hbF9zYXZlIjpbXSwiJF9fb3JpZ2luYWxfdmFsaWRhdGUiOltdLCIkX19vcmlnaW5hbF9yZW1vdmUiOltdfSwiaWF0IjoxNDc3NDAxMTc3LCJleHAiOjE0Nzc0ODc1Nzd9.fgCfX6ofCkkt3aWslvj2nnve4IuzfUDCQdPMwAFiQrY';

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
            url: 'http://localhost:3000/authenticate',
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
            url: 'http://localhost:3000/signup',
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
            url: 'http://localhost:3000/users?token=' + token,
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
            url: 'http://localhost:3000/movies?token=' + token,
        }).then(function(response) {
            console.log(response);
            $scope.movies = response.data;
            console.log($scope.movies);
        }, function(response) {
            console.log(response.data);
        });
    }
});
