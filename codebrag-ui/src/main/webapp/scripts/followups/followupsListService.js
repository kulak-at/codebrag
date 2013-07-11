angular.module('codebrag.followups')

    .factory('followupsListService', function($resource, $q, $http, $rootScope, events) {

        var followups = new codebrag.AsyncCollection();

        function _httpRequest(method, id) {
            var followupsUrl = 'rest/followups/' + (id || '');
            return $http({method: method, url: followupsUrl});
        }

        function loadFollowupGroupsFromServer() {
            return $http({method: 'GET', url: 'rest/followups/'}).then(function(response) {
                return response.data.followupsByCommit;
            })
        }

    	function loadFollowupsFromServer() {
            var requestPromise = _httpRequest('GET').then(function (response) {
                _broadcastNewFollowupCountEvent(response.data.followups.length);
                return response.data.followups;
            });
            return followups.loadElements(requestPromise)
    	}

        function allFollowups() {
            return followups.elements;
        }

        function removeFollowup(followupId) {
            return _removeFollowupUsingFunction(followups.removeElement.bind(followups), followupId)
        }

        function removeFollowupAndGetNext(followupId) {
            return _removeFollowupUsingFunction(followups.removeElementAndGetNext.bind(followups), followupId)
        }

        function _removeFollowupUsingFunction(removingFunction, followupId) {
            var responsePromise = _httpRequest('DELETE', followupId);
            responsePromise.then(function () {
                _broadcastNewFollowupCountEvent(followups.elements.length - 1);
            });
            return removingFunction(function (el) {
                return el.followupId === followupId;
            }, responsePromise)
        }

        function loadFollowupById(followupId) {
            return _httpRequest('GET', followupId).then(function(response) {
                return response.data;
            });
        }

        function _broadcastNewFollowupCountEvent(newFollowupCount) {
            $rootScope.$broadcast(events.followupCountChanged, {followupCount: newFollowupCount})
        }

        return {
            loadFollowupGroupsFromServer: loadFollowupGroupsFromServer,
			loadFollowupsFromServer: loadFollowupsFromServer,
            allFollowups: allFollowups,
            removeFollowupAndGetNext: removeFollowupAndGetNext,
            removeFollowup: removeFollowup,
            loadFollowupById: loadFollowupById
		};

    });

