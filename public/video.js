var youTube = angular.module('youApi',[]);
var nextToken = '';

youTube.controller('mainController', ['$scope', '$http','$sce',function($scope,$http,$sce) {
	$scope.trustSrc = function(src) {
    	return $sce.trustAsResourceUrl(src);
  	}

	$http.get('/getVideo').success(function(data){
		console.log(data);
		data.id = 'https://www.youtube.com/embed/' + data.id;
		console.log(data.id);
		$scope.vidInfo = data;

		$http.get('/channelInfo?chId=' + data.snippet.channelId).success(function(data2){	
			$scope.channelInfo = data2;

		});


	});

	$scope.getDate = function(datetime){
		var dtime = datetime.replace("T"," ").replace(/\..+/g,"")
		dtime = new Date( dtime );
		var month = dtime.getUTCMonth() + 1; //months from 1-12
		var day = dtime.getUTCDate();
		var year = dtime.getUTCFullYear();
		var newdate = day + "/" + month + "/" + year;
		return newdate;

	}



	$scope.searchReq = function(flag){
		if(flag == 0)
			nextToken= '';

		window.location.href ="/?h";
		$http.get('/search?q=' + $scope.searchTerm + '&nextToken=' + nextToken).success(function(data){
			console.log("HEy");
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



}]);