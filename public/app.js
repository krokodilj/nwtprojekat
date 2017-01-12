var app = angular.module("myApp", ["ngRoute", "ngCookies"]);
            
//definisanje routova za view i controllere unutar glavnog index.html
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "views/login.html",
            controller : "loginController"
        })
        .when("/register", {
            templateUrl : "views/register.html",
            controller : "registerController"
        })
        .when("/dashboard", {
            templateUrl : "views/dashboard.html",
            controller : "dashboardController"
        })
    });

//definisanje angular servisa koji sadrzi login metodu
app.service('userService', function($http, $window, $cookies) {

    var login = function(userData) {
        $http.post('/users/auth', userData).then( function(response) { 
            if(response.data.success) {
                $cookies.put("token", response.data.token);
                $http.post("/users/dashboard", userData).then( function(response) {
                    $cookies.putObject("userData", response.data.userdata);
                    $window.location = "#/dashboard";
                });
            }
            else {
                alert("authentiaction failed!");
            }
        });
    };

    return {
        login : login
    };

});