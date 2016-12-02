app.controller('loginController', function($scope, $http, userService) {

    $scope.login = function() {
        var userData = undefined;
        if($scope.id.includes("@")) {
            userData = {"email" : $scope.id, "password" : $scope.pass};
        }
        else {
            userData = {"username" : $scope.id, "password" : $scope.pass};
        }
        userService.setUser(userData);
        userService.login();
    }
});