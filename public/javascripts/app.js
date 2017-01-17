(function () {
    angular.module("myApp")
        .controller('appController', appController);

    function appController($log,$scope, $http, $cookies,$routeParams) {
    	var vm = this;
    	
    	//preuzmi podatke o aplikaciji
    	$http.get("/api/app/"+$routeParams.id, {  headers: { 'x-access-token': $cookies.get("token") } })
    		.then(function (response) {
    			vm.app=response.data.app_data;
                console.log(JSON.stringify(vm.app))
                $http.get("/api/events", { params: { "app": vm.app._id }, headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {

                //put the array of events inside eventsData
                vm.eventsData = response.data.eventData.events;
                console.log(vm.eventsData);
        });

        vm.submit=function(){
            var data={"user_id":vm.item._id,"app_id":vm.app._id};
            $http.post("/api/app/subscribe",data,{headers: { 'x-access-token': $cookies.get("token") }}).then(function(response){
                alert(JSON.stringify(response))
            });

        }

    });

    //za autocomplete    
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

     $http.get("/users/", { headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {
        self.repos=response.data;
     });

    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

   
    function querySearch (query) {
      var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
      vm.item=item;
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.username.indexOf(lowercaseQuery) === 0);
      };

    }
  }
    	

    	
    
})();
