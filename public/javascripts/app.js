(function () {
    angular.module("myApp")
        .controller('appController', appController);

    function appController($scope, $http, $cookies,$routeParams) {
    	var vm = this;
    	
    	//preuzmi podatke o aplikaciji
    	$http.get("/api/app/"+$routeParams.id, {  headers: { 'x-access-token': $cookies.get("token") } })
    		.then(function (response) {
    			vm.app=response.data.app_data;
    		});

    	

    	
    }
})();
