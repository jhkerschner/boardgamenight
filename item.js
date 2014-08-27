var app = angular.module('item', ['ngRoute', 'firebase', 'ui.bootstrap']);
 
app.value('fbURL', 'https://boardgamenight.firebaseio.com/');
 
app.factory('Items', function($firebase, fbURL) {
  return $firebase(new Firebase(fbURL));
});
 
app.config(function($routeProvider) {
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
});

app.controller('ListCtrl', function($scope, Items) {
  $scope.items = Items;
});
 
app.controller('CreateCtrl', function($scope, $location, $timeout, Items) {
  $scope.save = function() {
    Items.$add($scope.item, function() {
      $timeout(function() { $location.path('/'); });
    });
  };
});
 
app.controller('EditCtrl', function($scope, $location, $routeParams, $firebase, fbURL) {
    var itemUrl = fbURL + $routeParams.itemId;
    $scope.item = $firebase(new Firebase(itemUrl));
 
    $scope.destroy = function() {
      $scope.item.$remove();
      $location.path('/');
    };
 
    $scope.save = function() {
      $scope.item.$save();
      $location.path('/');
    };
});


//Custom Form Validation

var NUMBER_REGEXP = /^\d+$/;

app.directive('number', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (NUMBER_REGEXP.test(viewValue)) {
          // it is valid
          ctrl.$setValidity('number', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('number', false);
          return undefined;
        }
      });
    }
  };
});