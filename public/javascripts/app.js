angular.module('prose', []).
	config(["$routeProvider", function ($routeProvider) {
		$routeProvider.
			when('/', {templateUrl:'html/home.html', controller: HomeCtrl2}).
/*			when('/random',{templateUrl:'html/home.html',controller: RandomCtrl}).				*/
			when('/:num',{templateUrl:'html/home.html', controller: HomeCtrl}).
			otherwise({redirectTo:'/'});	
	}]);
