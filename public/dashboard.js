app.controller('dashboardController', function($scope, $http, userService) {
    var user = userService.getUser();
    console.log(user);
    $scope.username = user.username;
    $scope.email = user.email;
    $scope.first_name = user.first_name;
    $scope.last_name = user.last_name;
});