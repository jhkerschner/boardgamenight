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

//Angular Bootstrap UI

function CarouselDemoCtrl($scope, $http, Items) {

  $scope.myInterval = 5000;
  $scope.mySearch = "Larping";
  $scope.oldSearch = $scope.mySearch;
  
  $scope.pointer = 0;
  var slides = $scope.slides = [],
      carousel = this;

  var config = {
    headers: {
      'Authorization': 'Client-ID 697b3889c71f3c0'
    }
  };

  $http.get("https://api.imgur.com/3/gallery/search/score/all?q_exactly="+ encodeURI($scope.mySearch), config)
  .success(function(data){
    carousel.pictures = [];
    carousel.data = data.data;
    for (var i = 0; i < carousel.data.length; i++) {
      if (!carousel.data[i].is_album) {
        carousel.pictures.push(
          carousel.data[i]
        );
      }
    };
    for (var i=0; i<4; i++) {
      $scope.pointer = i;
      $scope.addSlide();
    }
  })

  $scope.changeTopic = function(){
    if ($scope.mySearch != $scope.oldSearch){
      console.log($scope.oldSearch)
      console.log($scope.mySearch)
      $scope.oldSearch = $scope.mySearch;
      $scope.pointer = 0;
      $http.get("https://api.imgur.com/3/gallery/search/score/all?q_exactly="+ encodeURI($scope.mySearch), config)
      .success(function(data){
        carousel.pictures = [];
        carousel.data = data.data;
        console.log(carousel.data.length);
        //Not a good way to do this I know but it works
        if (carousel.data.length == 0){
          $scope.noResults = "No-results";
        }else{
          $scope.noResults = "";
        }

        for (var i = 0; i < carousel.data.length; i++) {
          if (!carousel.data[i].is_album) {
            carousel.pictures.push(
              carousel.data[i]
            );
          }
        };
        //obliterate the existing slides and start over this doesn't work for some reason
        // slides = [];
        // console.log(slides);
        // for (var i=0; i<4; i++) {
        //   $scope.pointer = i;
        //   $scope.addSlide();
        // }
      })
      .error(function(){
        console.log("error")
        // var $scope.apiError = error
      })
    }else{
      console.log("same search term")
    }
  }

  $scope.addSlide = function() {

    var newWidth = 600 + slides.length;

    if (carousel.pictures.length == 0) {
      console.log("no-results")
    }else if (!carousel.pictures[$scope.pointer]){
      $scope.noneMore = "No more images for that term";
    }else{
      console.log(slides)
      slides.push({
        image: carousel.pictures[$scope.pointer].link,
        text: carousel.pictures[$scope.pointer].title
      });
      console.log(slides)
      $scope.pointer++;
    }
  };
}

// Egg Head IO stuff


app.factory('Data', function () {
  return {message:"I'm data from a service"}
})

// app.filter('reverse', function () {
//   return function(text){
//     return text.split("").reverse().join("");
//   }
// })

function FirstCtrl($scope, Data){
  $scope.data = Data;
}
function SecondCtrl($scope, Data){
  $scope.data = Data;
}

