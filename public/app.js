angular
    .module("myApp", ["ngRoute", "ngCookies", 'ngMaterial', 'ngMessages', 'angular.filter'])
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
    })
    .filter("byAppVersion", function() {
        return function(events, versions) {
            var retVal = [];
            if(events === undefined || versions === undefined)
                return retVal;
            for(var i = 0; i < events.length; i++) {
                for(var j = 0; j < versions.length; j++) {
                    if(events[i].version == versions[j]) {
                        retVal.push(events[i]);
                        break;
                    }
                }
            }
            return retVal;
        }
    });
