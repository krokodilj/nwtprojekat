(function () {
    angular.module("myApp")
        .controller('eventController', eventController);


    function eventController($scope, $http, $cookies,$routeParams){
    	var vm=this;

    	$http.get("/api/events", { params: { "_id": $routeParams.id }, headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {

                //put the array of events inside eventsData
                vm.event = response.data.eventData.events[0];
               alert(JSON.stringify(vm.event))
            });

    }


})();