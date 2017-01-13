(function () {
    angular.module("myApp")
        .controller('registerController', registerController);

    //register page controller
    function registerController($http, $scope) {

        var vm = this;
        vm.register = register;
        
        //method for user registration
        function register () {
            var userData = {
                "username": vm.username, "password": vm.pass, "email": vm.email,
                "first_name": vm.firstName, "last_name": vms.lastName
            };
            $http.post('/users/register', userData).then(function (response) {
                if (response) {
                    $scope.indexCtrl.login(userData);
                }
            })
        }
    }
})();