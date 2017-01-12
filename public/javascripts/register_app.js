app.controller('register_app', function($scope, $http, $cookies,userService) {

    $scope.register_app = function () {
        var app_data = {"name" : $scope.name, "stack" : [$scope.stack], "version" : $scope.version, 
            "repo" : $scope.repo};
        $http.post('api/app/add', app_data,{ headers: {'x-access-token': $cookies.get("token")} }).then(function(response) {
            	if(response.data.succes){
                alert("saved");
       			 }
                window.location="#/dashboard";
            
        })
    }
});