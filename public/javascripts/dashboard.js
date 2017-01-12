app.controller('dashboardController', function($scope, $http, $cookies) {
    var user = $cookies.getObject("userData");
    console.log($cookies.getAll());
    $scope.username = user.username;
    $scope.email = user.email;
    $scope.first_name = user.first_name;
    $scope.last_name = user.last_name;
});