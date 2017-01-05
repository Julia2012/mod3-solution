(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);


function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: MenuListDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

function MenuListDirectiveController() {
    
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var list = this;
  list.searchItem = '';  
  
  list.findItems = function (searchItem) {
    if (searchItem ==='') {
       list.items = [];
       return;
    }
    var promise = MenuSearchService.getMatchedMenuItems(searchItem);
    promise.then(function (response) {
    list.items = response;
    })
    .catch(function (error) {
      console.log(error);
    })
  };
  
  list.removeItem = function (itemIndex) {
    MenuSearchService.removeItem(itemIndex);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];

function MenuSearchService($http, ApiBasePath) {
  var service = this;
  var items = [];
  
  service.getMatchedMenuItems = function (searchItem) {
    return $http.get(ApiBasePath + "/menu_items.json")
    .then(function (result){
        items = [];
        for (var i = 0; i < result.data.menu_items.length; i++) {
          var descr = result.data.menu_items[i].description;
          if (descr.toLowerCase().indexOf(searchItem) !== -1) {
            items.push(result.data.menu_items[i]);
          }
        }
        return items;
    });
  };

  service.removeItem = function (itemIndex) {
    items.splice(itemIndex, 1);
  };
  
}

})();
