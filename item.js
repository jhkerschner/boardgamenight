var item = angular.module('item', ['ngRoute', 'firebase'])
 
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

.controller('ListCtrl', ['$scope', 'Items', 'Games', function($scope, Items, Games) {
  $scope.items = Items;
  $scope.games = Games;
}])

.directive('myCalc', function(){
  function link(scope) {
    scope.game.endorsementCount = 0;
    for(var i=0; i < scope.$parent.items.length; i++){
      if (scope.game.name == scope.$parent.items[i].choice){
        scope.game.endorsementCount ++;
      }
    }
  }
  return {
    link: link
  };
})
 
.controller('CreateCtrl', function($scope, $location, $timeout, Items, Games) {
  $scope.games = Games;

  $scope.save = function() {
    if($scope.item.choice != null){
      $scope.item.choice = $scope.item.choice.name;
    }else{
      $scope.item.choice = "";
    }
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
    $scope.item = $scope.items.$getRecord(itemId);

    $scope.destroy = function() {
      $scope.items.$remove($scope.item).then(function(data) {
          $location.path('/');
      });
    };

    $scope.save = function() {

      $scope.item.choice = $scope.item.choice.name || "";
      $scope.items.$save($scope.item).then(function(data) {
         $location.path('/');
      });
    };
})

.controller('GameCtrl', function($scope, $location, $routeParams, Games) {
  $scope.save = function() {
    $scope.game.endorsementCount = 0;
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

    $scope.monopoly = function(){
      if ($scope.game.name == 'monopoly'){
        return true;
      }
    };

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
  $scope.scheduledDate = new Date('Nov 21 2014 5:00 pm');
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

//Custom Form Validation

var MONOPOLY_REGEXP = /monopoly/i;

item.directive('monopoly', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (MONOPOLY_REGEXP.test(viewValue)) {
          ctrl.$setValidity('monopoly', false);
          return undefined;
          // it is monopoly, return undefined (no model update)
        } else {
          ctrl.$setValidity('monopoly', true);
          return viewValue;
          // it's not valid
          
        }
      });
    }
  };
});
