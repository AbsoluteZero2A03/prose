function HomeCtrl($http, $routeParams, $scope) {
	$http.post("/content.json", {number: $routeParams.num}).success(function (data) {
		$scope.story = data.story;
		$scope.pastStories = data.pastStories;
		
		if (data.story.num == 1) {
			$scope.previous = "";
		} else {
			$scope.previous = data.story.num - 1;
		}
		if (data.story.num == data.maxn) {
			$scope.next == "";
		} else {
			$scope.next = data.story.num + 1;
		}
	});
}

function HomeCtrl2($http, $routeParams, $scope) {
	
	$http.get("/maxnum").success(function(data) {
		var n = data;
		$http.post("/content.json", {number: n}).success(function (data) {
			$scope.story = data.story;
			$scope.pastStories = data.pastStories;
						
			if (data.story.num == 1) {
				$scope.previous = "";
			} else {
				$scope.previous = data.story.num - 1;
			}
			$scope.next == "";
			if (data.story.num == n) {
				$scope.next == "";
			} else {
				$scope.next = data.story.num + 1;
			}
		});
	});
}

/*function RandomCtrl($http, $location, $scope) {
	var x = parseInt(100 * Math.random());
	$http.post("/random", {number: x}).success(function (data) {
		
	});
}*/
