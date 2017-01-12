app.controller('registerController', function($scope, $http, userService) {

    $scope.register = function () {
        var userData = {"username" : $scope.username, "password" : $scope.pass, "email" : $scope.email, 
            "first_name" : $scope.firstName, "last_name" : $scope.lastName};
        $http.post('/users/register', userData).then(function(response) {
            if(response) {
                userService.login(userData);
            }
        })
    }
});