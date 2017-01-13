(function () {
    angular.module("myApp")
        .controller('dashboardController', dashboardController);

    function dashboardController($scope, $http, $cookies) {

        var vm = this;
        vm.selectedIndex = 0; // index of selected tab in view
        $scope.indexCtrl.loggedIn = true; //user is logged in set to true
        var user = $cookies.getObject("userdata");
        console.log($cookies.getAll())
        $http.post("/users/dashboard", user, { headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {

            $cookies.putObject("userdata", response.data.userdata);
            $cookies.putObject("subscribed_apps", response.data.subscribed_apps);
            $cookies.putObject("admin_apps", response.data.admin_apps);

            vm.userdata = response.data.userdata;
            vm.subscribed_apps = response.data.subscribed_apps;
            vm.admin_apps = response.data.admin_apps;
            
        });
    }
})();