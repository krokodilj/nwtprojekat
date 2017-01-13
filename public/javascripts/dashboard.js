(function() {
    angular.module("myApp")
        .controller('dashboardController', dashboardController);

    function dashboardController($scope, $http, $cookies) {

        var vm = this;

        vm.selectedIndex = 0; // index of selected tab in view
        vm.selectApp = selectApp;
        $scope.indexCtrl.loggedIn = true; //user is logged in set to true
        console.log($cookies.getAll())

        $http.post("/users/dashboard", $cookies.getObject("userdata"), { headers: { 'x-access-token': $cookies.get("token") } }).then(function(response) {

            $cookies.putObject("userdata", response.data.userdata);
            $cookies.putObject("subscribed_apps", response.data.subscribed_apps);
            $cookies.putObject("admin_apps", response.data.admin_apps);

            vm.userdata = response.data.userdata;
            vm.subscribed_apps = response.data.subscribed_apps;
            vm.admin_apps = response.data.admin_apps;

        });

        function selectApp(appId) {
            console.log(appId);
            vm.selectedAppId = appId;
            vm.selectedIndex = 1;
        }

    }
})();