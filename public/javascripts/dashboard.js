(function () {
    angular.module("myApp")
        .controller('dashboardController', dashboardController);

    function dashboardController($scope, $http, $cookies, $mdDialog, $mdToast) {

        var vm = this;

        vm.selectedIndex = 0; // index of selected tab in view
        vm.selectApp = selectApp;
        vm.selectEvent = selectEvent;
        vm.showPrompt = showPrompt;
        vm.postComment = postComment;
        vm.displayMsg = displayMsg;
        $scope.indexCtrl.loggedIn = true; //user is logged in set to true
        console.log($cookies.getAll())

        $http.post("/users/dashboard", $cookies.getObject("userdata"), { headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {

            $cookies.putObject("userdata", response.data.userdata);
            $cookies.putObject("subscribed_apps", response.data.subscribed_apps);
            $cookies.putObject("admin_apps", response.data.admin_apps);

            vm.userdata = response.data.userdata;
            vm.subscribed_apps = response.data.subscribed_apps;
            vm.admin_apps = response.data.admin_apps;

            if (vm.admin_apps.length > 0) {
                selectApp(vm.admin_apps[0]);
            }
            else {
                if (vm.subscribed_apps.length > 0) {
                    selectApp(vm.subscribed_apps[0]);
                }
            }

        });

        function selectApp(app) {
            console.log(app);
            vm.selectedApp = app;

            $http.get("/api/events", { params: { "app": app._id }, headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {

                //put the array of events inside eventsData
                vm.eventsData = response.data.eventData.events;
                console.log(vm.eventsData);
            });
        }

        function selectEvent(event) {
            console.log(event);
            vm.selectedEvent = event;
            vm.selectedIndex = 4;

            getAllComments(event);
        }

        function showPrompt(ev, commentId) {

            var confirm = $mdDialog.prompt()
                .title('Leave a comment please:')
                .ariaLabel("comment")
                .placeholder('Write a comment...')
                .targetEvent(ev)
                .ok('Send!')
                .cancel('Dismiss');

            $mdDialog.show(confirm).then(function (result) {

                var params = { "comment": { "author": vm.userdata._id, "data": result }, "commentId": commentId };
                $http.post("/api/comment", params, { headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {

                    getAllComments(vm.selectedEvent._id);
                    displayMsg('Comment successfully sent!');
                });
            });
        };

        function getAllComments(event) {
            $http.get("/api/comments", { params: { "eventId": event._id }, headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {
                //put comments on scope
                vm.comments = response.data.commentsData;
            });
        }

        function postComment(data) {
            console.log('funct gets called');
            var params = { "comment": { "author": vm.userdata._id, "data": data }, "eventId": vm.selectedEvent._id };
            $http.post("/api/comment", params, { headers: { 'x-access-token': $cookies.get("token") } }).then(function (response) {
                getAllComments(vm.selectedEvent._id);
                $("#commentArea").val("");
                $("#commentArea").blur();

                displayMsg('Comment successfully sent!');
            });
        }

        function displayMsg(data) {

            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .textContent(data)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
            );

        }


    }
})();