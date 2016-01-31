'use strict';

angular.module('confusionApp')

.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

  $scope.tab = 1;
  $scope.filtText = '';
  $scope.showDetails = false;
  $scope.showMenu = false;
  $scope.message = "Loading ...";

  $scope.dishes = menuFactory.getDishes().query(
    function(response) {
      $scope.dishes = response;
      $scope.showMenu = true;
    },
    function(response) {
      $scope.message = "Error: " + response.status + " " + response.statusText;
    }
  );

  $scope.select = function(setTab) {
    $scope.tab = setTab;

    if (setTab === 2) {
      $scope.filtText = "appetizer";
    }
    else if (setTab === 3) {
      $scope.filtText = "mains";
    }
    else if (setTab === 4) {
      $scope.filtText = "dessert";
    }
    else {
      $scope.filtText = "";
    }
  };

  $scope.isSelected = function (checkTab) {
    return ($scope.tab === checkTab);
  };

  $scope.toggleDetails = function() {
    $scope.showDetails = !$scope.showDetails;
  };
}])

.controller('ContactController', ['$scope', function($scope) {

  $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

  var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

  $scope.channels = channels;
  $scope.invalidChannelSelection = false;

}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {

  $scope.sendFeedback = function() {

    console.log($scope.feedback);

    if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
      $scope.invalidChannelSelection = true;
      console.log('incorrect');
    }
    else {
      $scope.invalidChannelSelection = false;
      feedbackFactory.getFeedback().save($scope.feedback);

      $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
      $scope.feedback.mychannel="";
      $scope.feedbackForm.$setPristine();
      console.log($scope.feedback);
    }
  };
}])

.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
  $scope.showDish = false;
  $scope.message = "Loading ...";

  //another way of specifying the success and error functions, different from the one used on MenuController
  $scope.dish = menuFactory.getDishes().get({ id: parseInt($stateParams.id,10) })
    .$promise.then(
      function(response) {
        $scope.dish = response;
        $scope.showDish = true;
      },
      function(response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );
}])

.controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {
  $scope.mycomment = {rating:5, comment:"", author:"", date:""};

  $scope.submitComment = function () {
    $scope.mycomment.date = new Date().toISOString();
    $scope.dish.comments.push($scope.mycomment);

    menuFactory.getDishes().update({ id: $scope.dish.id }, $scope.dish);

    $scope.commentForm.$setPristine();
    $scope.mycomment = {rating:5, comment:"", author:"", date:""};
  };
}])

.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory) {
  $scope.showDish = false;
  $scope.message = "Loading ...";

  //another way of specifying the success and error functions, different from the one used on MenuController
  $scope.featuredDish = menuFactory.getDishes().get({ id: 0 })
    .$promise.then(
      function(response) {
        $scope.featuredDish = response;
        $scope.showDish = true;
      },
      function(response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );

  $scope.showPromotion = false;
  $scope.messagePromotion = "Loading Promotion...";
  $scope.featuredPromotion = menuFactory.getPromotion().get({ id: 0 })
    .$promise.then(
      function(response) {
        $scope.showPromotion = true;
        $scope.featuredPromotion = response;
      },
      function(response) {
        $scope.messagePromotion = "Error: " + response.status + " " + response.statusText;
      }
    );

  $scope.showExecutiveChef = false;
  $scope.messageExecutiveChef = "Loading Executive Chef...";
  $scope.executiveChef = corporateFactory.getLeaders().get({ id: 3 })
    .$promise.then(
      function(response) {
        $scope.showExecutiveChef = true;
        $scope.executiveChef = response;
      },
      function(response) {
        $scope.messageExecutiveChef = "Error: " + response.status + " " + response.statusText;
      }
    );
}])

.controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
  $scope.showLeaders = false;
  $scope.message = "Loading Leaders...";
  $scope.leaders = corporateFactory.getLeaders().query()
    .$promise.then(
      function(response) {
        $scope.showLeaders = true;
        $scope.leaders = response;
      },
      function(response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );
}])
;
