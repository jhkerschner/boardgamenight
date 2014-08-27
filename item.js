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
});