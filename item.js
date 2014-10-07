angular.module('item', ['ngRoute', 'firebase'])
 
.value('itemsURL', 'https://boardgamenight.firebaseio.com/items')
.value('gamesURL', 'https://boardgamenight.firebaseio.com/games')
 
.factory('Items', function($firebase, itemsURL) {
  return $firebase(new Firebase(itemsURL)).$asArray();
})
.factory('Games', function($firebase, gamesURL) {
  return $firebase(new Firebase(gamesURL)).$asArray();
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
    .when('/addGame',{
      controller:'GameCtrl',
      templateUrl:'gamedetail.html'
    })
    .when('/editGame/:gameId',{
      controller: 'GameEditCtrl',
      templateUrl:'gamedetail.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('ListCtrl', function($scope, Items, Games) {
  $scope.items = Items;
  $scope.games = Games;
})
 
.controller('CreateCtrl', function($scope, $location, $timeout, Items) {
  $scope.save = function() {
    Items.$add($scope.item).then(function(data) {
      $location.path('/');
    });
  };
})

.controller('EditCtrl',
  function($scope, $location, $routeParams, Items, Games) {
    var itemId = $routeParams.itemId,
        itemIndex;
    $scope.games = Games;
    $scope.items = Items;
    itemIndex = $scope.items.$indexFor(itemId);
    $scope.item = $scope.items[itemIndex];

    $scope.destroy = function() {
        $scope.items.$remove($scope.item).then(function(data) {
            $location.path('/');
        });
    };

    $scope.save = function() {
        console.log($scope.item);
        $scope.item.choice = $scope.item.choice.name;
        $scope.items.$save($scope.item).then(function(data) {
           $location.path('/');
        });
    };
})

.controller('GameCtrl', function($scope, $location, $routeParams, Games) {
  $scope.save = function() {
    Games.$add($scope.game).then(function(data) {
      $location.path('/');
    });
  };
})

.controller('GameEditCtrl', function($scope, $location, $routeParams, Games) {
    var gameId = $routeParams.gameId,
        gameIndex;

    $scope.games = Games;
    gameIndex = $scope.games.$indexFor(gameId);
    $scope.game = $scope.games[gameIndex];

    $scope.destroy = function() {
        $scope.games.$remove($scope.game).then(function(data) {
            $location.path('/');
        });
    };

    $scope.save = function() {
        $scope.games.$save($scope.game).then(function(data) {
           $location.path('/');
        });
    };
})

.controller('TimerCtrl', ['$scope', function($scope) {
  $scope.scheduledDate = new Date('Oct 15 2014 5:00 pm');
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
