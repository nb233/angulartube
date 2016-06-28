var youTube = angular.module('youApi',[]);
var nextToken = '';

youTube.controller('mainController', ['$scope', '$http',function($scope,$http) {
	$http.get('/?q=123').success(function(data){
		$scope.searchResults = data.items;

	})
	.error(function(data){
		console.log("Error : " + data);

	});





	$scope.searchReq = function(flag){
		if(flag == 0)
			nextToken= '';

		$http.get('/search?q=' + $scope.searchTerm + '&nextToken=' + nextToken).success(function(data){
			if(nextToken == '')
				$scope.searchResults = data.items;
			else{
				for (var i = 0; i < data.items.length; i++) {
					$scope.searchResults.push(data.items[i]);
				}
				
			}
			nextToken = data.nextPageToken;
		})
		.error(function(data){
			console.log("Error : " + data);

		});
	}


	$scope.goTop = function(){
		window.scrollTo(0, 0);
	}


}]);

