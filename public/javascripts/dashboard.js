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

            if(vm.admin_apps.length > 0) {
                selectApp(vm.admin_apps[0]._id);
            }
            else {
                if(vm.subscribed_apps.length > 0) {
                    selectApp(vm.subscribed_apps[0]._id);
                }
            }

        });

        function selectApp(appId) {
            console.log(appId);
            vm.selectedAppId = appId;
            $http.get("/api/events", {params: {"app" : appId}, headers: {'x-access-token': $cookies.get("token") }}).then(function(response){
                //put the array of events inside eventsData
                vm.eventsData = response.data.eventData.events;
                console.log(vm.eventsData);
            });
        }



    }
})();