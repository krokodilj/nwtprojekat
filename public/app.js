var app = angular.module("myApp", ["ngRoute"]);
            
//definisanje routova za view i controllere unutar glavnog index.html
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "login.html",
            controller : "loginController"
        })
        .when("/register", {
            templateUrl : "register.html",
            controller : "registerController"
        })
        .when("/dashboard", {
            templateUrl : "dashboard.html",
            controller : "dashboardController"
        })
    });

//definisanje angular servisa koji sadrzi podatke i metode za korisnika, koje mozemo deliti izmedju kontrolera
app.service('userService', function($http, $window) {

    var user = undefined;

    var setUser = function(usr) {
        user = usr;
    };

    var getUser = function(){
        return user;
    };

    var login = function() {
        $http.post('/users/auth', user).then( function(response) { 
            if(response.data.success) {
                user.token = response.data.token;
                $window.location = "#/dashboard";
            }
            else {
                alert("authentiaction failed!");
            }
        });
    };

    return {
        getUser: getUser,
        setUser: setUser,
        login : login
    };

});