(function () {
    angular.module("myApp")
        .controller('indexController', indexController);

    //controller bound to application body, parent controller to all others
    function indexController($cookies, $http, $window) {

        var vm = this;
        //is user logged in
        vm.loggedIn = false;
        //login and logout methods
        vm.logout = logout;
        vm.login = login;

        //method for deleting user data - cookies
        function logout() {
            vm.loggedIn = false;
            var cookies = $cookies.getAll();
            for (var x in cookies) {
                $cookies.remove(x);
            }
        };

        //retrieving user token and saving it to cookie
        function login(userData) {
            $http.post('/users/auth', userData).then(function (response) {
                if (response.data.success) {
                    $cookies.put("token", response.data.token);
                    $cookies.putObject("userdata", userData);
                    $window.location = "#/dashboard";
                }
                else {
                    alert("authentiaction failed!");
                }
            });
        };

    }

})();