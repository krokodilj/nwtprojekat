app.controller('dashboardController', function($scope, $http, $cookies) {
    
    var user = $cookies.getObject("userdata");
    console.log($cookies.getAll())
    $scope.username = user.username;
    $scope.email = user.email;
    $scope.first_name = user.first_name;
    $scope.last_name = user.last_name;

    $scope.admin_apps = $cookies.getObject("admin_apps");
    $scope.subscribed_apps = $cookies.getObject("subscribed_apps");
});