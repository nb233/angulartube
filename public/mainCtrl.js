var youTube = angular.module('youApi',[]);
var nextToken = '';
var searchTerm;

youTube.controller('mainController', ['$scope', '$rootScope', '$location','$http',function($scope,$rootScope,$location,$http) {
	$rootScope.$on('$locationChangeSuccess', function() {
		$scope.refreshItems();
    });        

	$scope.refreshItems = function() {

		if(window.location.pathname == '/'){
			$http.get('/?page=home').success(function(data){
				$scope.searchResults = data.items;
				$scope.navButtons = !$scope.navButtons;

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
					$scope.navButtons = !$scope.navButtons;
				
			})
			.error(function(data){
				console.log("Error : " + data);

			});

		}

	};

	$scope.searchReq = function(flag){
		if(flag==0){
			window.location.href = '/search?page=render&q=' + $scope.searchTerm;
		}
		else{
			$http.get('/search?q=' + searchTerm + '&page=more&nextToken=' + nextToken).success(function(data){
				for (var i = 0; i < data.items.length; i++) {
					data.items[i].snippet.description = data.items[i].snippet.description.substring(150);
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

