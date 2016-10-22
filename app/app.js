(function () {
	// You app starts here
	'use strict';

	var app = angular.module('blogapp', ['ngRoute']);
	
	app.config(function($routeProvider){
		$routeProvider
			.when('/',{
				redirectTo: '/posts'
			})
			.when('/posts/:page?',{
				templateUrl: 'data/posts/posts.view.html',
				controller: 'PostsCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	});

	app.factory('postsData', function($http){
		return $http.get('data/posts.json');
	});
	
	app.controller('PostsCtrl', function($scope, $location, $routeParams, postsData){
		var authorArr = [],
			titleArr = [],
			dateArr = [],
			titleSort = {},
			authorSort = {},
			dateSort = {},
			monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'D‌​ecember'];	 

		postsData
			.success(function(data, status){
				$scope.postsData = data.posts;
				sortData($scope.postsData);
				$scope.titleSort = titleSort;
				$scope.authorSort = authorSort;
				$scope.dateSort = dateSort;
			})
			.error(function(data, status){
				console.error(status, data);
			});

		// sort the data from the json to names and count (times repeating)	
			function sortData(data){
				angular.forEach(data, function(value, key){
					angular.forEach(data[key], 
						function(v, k){
							if(k === 'author'){
								authorArr.push(v);
							}
							if(k === 'tags'){
								angular.forEach(data[key][k], function(V, K){
									titleArr.push(V);
								});
							}
							if(k === 'date'){
								var newDate = new Date(+v);
								dateArr.push(monthNames[newDate.getMonth()] + "," + newDate.getFullYear());
								//dateArr.push(v);	
							}
					});
				});

					authorSort = unique(authorArr);
					titleSort = unique(titleArr);
					dateSort = unique(dateArr);

					angular.forEach(dateSort,function(value, key){
						if(key === 'name'){
							angular.forEach(dateSort[key], function(v,k){
								dateSort[key][k] = v.split(',');
							});
						}
					});
				};

		// filter how many times a value returns store the value and the count+1 (for readability and display)
		function unique(inputArr) {
		    // sort the array to arrange duplicates alphabethically
		    inputArr = inputArr.sort();
		    var newArr = [],
		    	matchArr = [], 
		    	countArr = [],
		        inArrLen = inputArr.length,
		        found;

		    for (var i = 0; i < inArrLen; i++) {
		        found = undefined;
		        for (var y = 0; y < newArr.length; y++) {
		            if (inputArr[i] === newArr[y]) {
		                found = true;
		                break;
		            }
		        }
		        if (!found) {
		            newArr.push(inputArr[i]);
		            matchArr.push(i);
		        }
		    }
		    for (var j = 0; j < matchArr.length; j++) {
		    	// store all the times there was a match
		    	countArr.push((matchArr[j+1]||inArrLen)-matchArr[j]);
		    }
		    return {
		    	'name':newArr,
		    	'count':countArr
		    };
		}

		$scope.startIndex = 0; 
		console.log('refreshed');
		$scope.prevPosts = function(){
			if($scope.postsData.length>($scope.startIndex+3)){
				$scope.startIndex += 3;	
				$scope.startIndex;
				$scope.hideMe = false;
			} else {
				$scope.startIndex;
				console.log($scope.startIndex); 	
				return $scope.hideMe = true;			
			}
		};
		$scope.nextPosts = function(){
			if(0<$scope.startIndex){
				$scope.startIndex -= 3;
				$scope.startIndex;
				$scope.hideMe = false;
			} else {
				$scope.startIndex;
			}
		};
	});

	app.filter('startFrom', function() {
	    // input is the postsData array, index is the new start point
	    return function(input, index) {
	        // start the postsData array at the index point
	        return input.slice(index);
	    };
	});

	app.filter('spaceToDash',function(){
		return function(value){
			return (!value) ? '' : value.replace(/ /g, '-').toLowerCase();
		}
	});

	app.filter('removeSpace',function(){
		return function(value){
			return value.replace(/[\s\W]/g, '-').replace(/-{2,}/g, '-').toLowerCase();
		}
	});

	app.filter('monthShort',function(){
		return function(value){
			var shortmon = value[0].substring(0, 3);
			return (shortmon + "-" + value[1]).toLowerCase();
		}
	});
	
	app.filter('searchBy', function() {
		return function(arr, searchText, prop) {
            if (!searchText) {
                return arr;
            }
            return arr.filter(function(item) {
                return item[prop].toLowerCase().indexOf(searchText) > -1;
            });
        };
    });

}());

    