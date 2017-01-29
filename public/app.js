angular
    .module("myApp", ["ngRoute", "ngCookies", 'ngMaterial', 'ngMessages', 'angular.filter'])
    .config(function ($routeProvider ) { //defining routes for view and controllers in index.html
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
    //filtering by appVersion
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
    })
    //filtering by app fragment
    .filter("byFragment", function() {
        return function(events, fragment) {
            var retVal = [];
            if(events === undefined || fragment === undefined)
                return retVal;
            for(var i = 0; i < events.length; i++) {
                
                    if(events[i].fragment == fragment) {
                        retVal.push(events[i]);
                        
                    }
                
            }
            return retVal;
        }
    })

    //make filter by days
    .filter("byDays", function() {
        return function(events, fragment) {
            
            var retVal = [];
            if(events === undefined || fragment === undefined)
                return retVal;
            
            for(var i = 0; i < events.length; i++) {
                    
                    if(events[i].fragment == fragment) {
                        
                        var exists = false;
                        var date = events[i].date.split('T')[0]
                        
                        for(var j=0; j<retVal.length; j++){
                            if(retVal[j]['label']==date){
                                retVal[j]['value'] +=1;
                                exists = true;
                            }
                                
                        }
    
                        if(!exists){
                            var item = {"label": date, "value":1}
                            retVal.push(item);
                        }
                        
                        
                    }
                
            }
            retVal.sort(function (a, b) {
                return new Date(a.label) - new Date(b.label);
            });
            return retVal;
        }
    });
