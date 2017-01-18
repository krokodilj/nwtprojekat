(function () {
    angular.module("myApp")
        .controller('dashboardController', dashboardController);

    function dashboardController($scope, $http, $cookies, $mdDialog, $mdToast,$log) {

        var vm = this;

        vm.selectedIndex = 0;               // currently selected Tab
        vm.selectedApp;                     // currently selected App
        vm.eventsData;                      // currently selected App's Events
        vm.selectedEvent;                   // currently selected Event
        vm.comments;                        // currently selected Event's Comments

        vm.selectApp = selectApp;           // function for App selection
        vm.selectEvent = selectEvent;       // function for Event selection
        vm.showPrompt = showPrompt;         // function to display Comment input prompt
        vm.postComment = postComment;       // function for Comment posting
        vm.displayMsg = displayMsg;         // display text to user
        vm.removeComment = removeComment;   // function for Comment removal
        $scope.indexCtrl.loggedIn = true;   //user is logged in set to true

        //load all user data from provided token
        $http.post("/users/dashboard", $cookies.getObject("userdata"), { headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {

            //put all user data in cookie
            $cookies.putObject("userdata", response.data.userdata);
            $cookies.putObject("subscribed_apps", response.data.subscribed_apps);
            $cookies.putObject("admin_apps", response.data.admin_apps);

            //put all user data in scope
            vm.userdata = response.data.userdata;                   //user data
            vm.subscribed_apps = response.data.subscribed_apps;     //apps user is subscribed to
            vm.admin_apps = response.data.admin_apps;               //apps user is admin of

        });

        //select one App on click, save App to scope and its Events
        function selectApp(app, e) {

            if(e) {
                $(e.currentTarget).addClass('info').siblings().removeClass('info');
            }
            console.log(app);
            vm.selectedApp = app;

            $http.get("/api/events", { params: { "app": app._id }, headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {
                vm.eventsData = response.data.eventData.events;
            });

            self.isDisabled=false;
        }

        //select one Event on click, save Event to scope and call 'getAllComments' function
        function selectEvent(event) {
            console.log(event);
            vm.selectedEvent = event;
            vm.selectedIndex = 4;

            getAllComments(event);
        }

        //fetches all Comments for provided Event
        function getAllComments(event) {
            $http.get("/api/comments", { params: { "eventId": event._id }, headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {
                //put comments on scope
                vm.comments = response.data.commentsData;
            });
        }

        //display Comment Input prompt, used only for Comment Response
        function showPrompt(ev, commentId) {

            var confirm = $mdDialog.prompt()
                .title('Leave a comment please:')
                .ariaLabel("comment")
                .placeholder('Write a comment...')
                .targetEvent(ev)
                .ok('Send!')
                .cancel('Dismiss');
            
            $mdDialog.show(confirm).then(function (result) {
                //"comment" je sadrzaj commentara, "commentId" je id commentara na koji se ovaj odnosi
                var params = { "comment": { "author": vm.userdata._id, "data": result }, "commentId": commentId };
                $http.post("/api/comment", params, { headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {

                    getAllComments(vm.selectedEvent);
                    displayMsg('Comment successfully sent!');
                });
            });
        };

        //post Comment for Event
        function postComment(data) {
            var params = { "comment": { "author": vm.userdata._id, "data": data }, "eventId": vm.selectedEvent._id };
            $http.post("/api/comment", params, { headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {
                getAllComments(vm.selectedEvent);
                $("#commentArea").val("");
                $("#commentArea").blur();

                displayMsg('Comment successfully sent!');
            });
        }

        //display some message to user
        function displayMsg(data) {

            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .textContent(data)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
            );
        }

        //remove Comment with provided ID
        function removeComment(comment) {
            $http.delete("/api/comment", { params: { "id": comment._id }, headers: { 'x-access-token': $cookies.get("token") }}).then(function (response) {
                displayMsg('Comment successfully removed!');
                getAllComments(vm.selectedEvent);
            });
        }

        //za autocomplete i subscribe
        var self=this;
        self.simulateQuery = false;
        self.isDisabled = true;

        $http.get("/users/", { headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {
          self.repos = response.data;
        });

        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;


        function querySearch(query) {
          var results = query ? self.repos.filter(createFilterFor(query)) : self.repos,
            deferred;
          if (self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
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
          vm.item = item;
        }

        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);

          return function filterFn(item) {
            return (item.username.indexOf(lowercaseQuery) === 0);
          };

        }

        vm.submit = function () {
          var data = { "user_id": vm.item._id, "app_id": vm.selectedApp._id };
          $http.post("/api/app/subscribe", data, { headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {
            alert(JSON.stringify(response))
          });

        }

    }
})();