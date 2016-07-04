var youTube = angular.module('youApi',[]);
var nextToken = '';
var searchTerm;
//controller to send ajax requests to backend to get video data from youtube api
youTube.controller('mainController', ['$scope', '$rootScope', '$location','$http',function($scope,$rootScope,$location,$http) {
	$rootScope.$on('$locationChangeSuccess', function() {		
		$scope.refreshItems();
    });        
// function made to refresh the controller on each navigation
	$scope.refreshItems = function() {

		if(window.location.pathname == '/'){
			$http.get('/?page=home').success(function(data){
				$scope.searchResults = data.items;
				$scope.navButtons = !$scope.navButtons; //for handling ng-show, ng-hide as mentioned below

			})
			.error(function(data){
				console.log("Error : " + data);

			});
		}

		else{
			$http.get('/search?q=' + $scope.searchTerm ).success(function(data){
					$scope.searchResults = data.items;
					searchTerm = data.searchTerm;
					nextToken = data.nextPageToken;
					$scope.searchTerm=searchTerm;
					$scope.navButtons = !$scope.navButtons; //Done to make sure that the "more" and "move to top" buttons appear only after the results are appearing
				
			})
			.error(function(data){
				console.log("Error : " + data);

			});

		}

	};

//function handling the search requests made on clikcing the search button or "more" 
	$scope.searchReq = function(flag){
		if(flag==0){
			window.location.href = '/search?page=render&q=' + $scope.searchTerm;
		}
		else{
			$http.get('/search?q=' + searchTerm + '&page=more&nextToken=' + nextToken).success(function(data){
				for (var i = 0; i < data.items.length; i++) {
					$scope.searchResults.push(data.items[i]);
				}	
				
				nextToken = data.nextPageToken;
			})
			.error(function(data){
				console.log("Error : " + data);

			});
		}
	}


	$scope.goTop = function(){
		window.scrollTo(0, 0);
	}


}]);

