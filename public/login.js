app.controller('loginController', function($scope, $http, userService) {

    $scope.login = function() {
        var userData = undefined;
        if($scope.id.includes("@")) {
            userData = {"email" : $scope.id, "password" : $scope.pass};
        }
        else {
            userData = {"username" : $scope.id, "password" : $scope.pass};
        }
        $http.post("/users/dashboard", userData).then( function(response) {
            // poslati zahtev za login
        });
        userService.setUser(userData);
        userService.login();
    }
});