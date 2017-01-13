angular
    .module("myApp", ["ngRoute", "ngCookies", 'ngMaterial', 'ngMessages'])
    .config(function ($routeProvider) { //defining routes for view and controllers in index.html
        $routeProvider
            .when("/", {
                templateUrl: "views/login.html",
                controller: "loginController",
                controllerAs: "loginCtrl"
            })
            .when("/register", {
                templateUrl: "views/register.html",
                controller: "registerController",
                controllerAs: "registerCtrl"
            })
            .when("/dashboard", {
                templateUrl: "views/dashboard.html",
                controller: "dashboardController",
                controllerAs: "dashboardCtrl"
            })
            .when("/registerApp", {
                templateUrl: "views/registerApp.html",
                controller: "registerApp",
                controllerAs: "registerAppCtrl"
            })
    });
