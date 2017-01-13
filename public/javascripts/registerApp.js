(function () {
    angular.module("myApp")
        .controller('registerApp', registerApp);

    function registerApp($http, $cookies) {

        var vm = this; 
        
        vm.register_app = register_app;

        function register_app() {
            var app_data = {
                "name": vm.name, "stack": [vm.stack], "version": vm.version,
                "repo": vm.repo
            };
            $http.post('api/app/add', app_data, { headers: { 'x-access-token': $cookies.get("token") } }).then(function(response) {
                if (response.data.succes) {
                    alert("saved");
                }
                window.location = "#/dashboard";

            })
        }
    }
})();