angular.module('item', ['ngRoute', 'firebase'])
 
.value('fbURL', 'https://boardgamenight.firebaseio.com/')
 
.factory('Items', function($firebase, fbURL) {
  return $firebase(new Firebase(fbURL)).$asArray();
})
 
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'ListCtrl',
      templateUrl:'list.html'
    })
    .when('/edit/:itemId', {
      controller:'EditCtrl',
      templateUrl:'detail.html'
    })
    .when('/new', {
      controller:'CreateCtrl',
      templateUrl:'detail.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('ListCtrl', function($scope, Items) {
  $scope.items = Items;
})
 
.controller('CreateCtrl', function($scope, $location, $timeout, Items) {
  $scope.save = function() {
    Items.$add($scope.item).then(function(data) {
      $location.path('/');
    });
  };
})

.controller('EditCtrl',
  function($scope, $location, $routeParams, Items) {
    var itemId = $routeParams.itemId,
        itemIndex;

    $scope.items = Items;
    itemIndex = $scope.items.$indexFor(itemId);
    $scope.item = $scope.items[itemIndex];

    $scope.destroy = function() {
        $scope.items.$remove($scope.item).then(function(data) {
            $location.path('/');
        });
    };

    $scope.save = function() {
        $scope.items.$save($scope.item).then(function(data) {
           $location.path('/');
        });
    };
})
.controller('TimerCtrl', ['$scope', function($scope) {
  $scope.scheduledDate = new Date("Aug 28 2014 5:00 PM");
}])
.directive('myCurrentTime', ['$interval', 'dateFilter', function($interval, dateFilter) {

  function link(scope, element, attrs) {
    var scheduledDate,
        timeoutId;

    function updateTime() {
      // find the amount of "seconds" between now and target
      var current_date = new Date().getTime();
      var seconds_left = (new Date(scheduledDate).getTime() - current_date) / 1000;
      
      // do some time calculations
      days = parseInt(seconds_left / 86400);
      seconds_left = seconds_left % 86400;
       
      hours = parseInt(seconds_left / 3600);
      seconds_left = seconds_left % 3600;
       
      minutes = parseInt(seconds_left / 60);
      seconds = parseInt(seconds_left % 60);

      element.text(days + "d, " + hours + "h, " + minutes + "m, " + seconds + "s");
    }

    scope.$watch(attrs.myCurrentTime, function(value) {
      scheduledDate = value;
      updateTime();
    });

    element.on('$destroy', function() {
      $interval.cancel(timeoutId);
    });

    // start the UI update process; save the timeoutId for canceling
    timeoutId = $interval(function() {
      updateTime(); // update DOM
    }, 1000);
  }

  return {
    link: link
  };
}]);
// .controller('TimerCtrl', ['$scope', function($scope) {
//   $scope.timer = function(){
//     // set the date we're counting down to
//     var target_date = new Date("Aug 15, 2019").getTime();
     
//     // variables for time units
//     var days, hours, minutes, seconds;
     
//     // get tag element
//     var countdown = document.getElementById("countdown");
     
//     // update the tag with id "countdown" every 1 second
//     setInterval(function () {
     
//         // find the amount of "seconds" between now and target
//         var current_date = new Date().getTime();
//         var seconds_left = (target_date - current_date) / 1000;
     
//         // do some time calculations
//         days = parseInt(seconds_left / 86400);
//         seconds_left = seconds_left % 86400;
         
//         hours = parseInt(seconds_left / 3600);
//         seconds_left = seconds_left % 3600;
         
//         minutes = parseInt(seconds_left / 60);
//         seconds = parseInt(seconds_left % 60);
         
//         // format countdown string + set tag value
//         countdown.innerHTML = days + "d, " + hours + "h, "
//         + minutes + "m, " + seconds + "s";  
     
//     }, 1000);
//   };
// }])
// .directive('timer', function() {
//   return {
//     template: 'Countdown to GameboardNight: {{timer}}'
//   };
// });
