(function(){
    
    var model = {
            contacts: [{ name: "Esteban Elizondo", address: "San Jose Costa Rica", email:"elizondo1288@hotmail.com",phone:"8864-1981",updating:false},
                    { name: "Pedro Perez", address: "Cartago", email:"pedrop@gmail.com",phone:"8832-1123",updating:false}]
        };

    //we set the module for the angular page
    var contactsApp = angular.module("contactsApp", ['ngRoute']);

    contactsApp.config(function($routeProvider){

        $routeProvider
            .when('/',{
                templateUrl:'partials/list.html'
            })
            .when('/add',{
                templateUrl:'partials/add.html'
            })
            .otherwise({
                redirectTo:'/'
            })

    });


    /*
    * We set the controller for this contact application
    */
    contactsApp.controller("ContactsCtrl", function ($scope, $location, $route) {

        //we assigned the model to the controller
        $scope.model = model;

        //visibility variables to show / hide panels
        $scope.visibililtyAdd = false;
        $scope.visibililtyList = true;

        $scope.wasInserted = false;
        $scope.tab = 1;
        
        $scope.$on('$routeChangeSuccess', function() {
            if ($location.path() == '/') {
                $scope.tab = 1;
            }else{
                $scope.tab = 2;
            }
        });
        
        
        $scope.isSelected=function(checkTab){
        return $scope.tab === checkTab;
        };

        $scope.addNewContact = function (nam, add, em, ph) {
                $scope.model.contacts.push({ name: nam, address: add, email:em, phone:ph, updating:false});
                $scope.wasInserted = true;
                $location.path("/");
                $scope.clearInsertForm();
                
                
        };

        $scope.deleteContact = function(item){
            var index=$scope.model.contacts.indexOf(item)
            $scope.model.contacts.splice(index,1);
        };

        $scope.updateContact = function(item){

            if(item.updating){
                item.updating = false;
            } else{
                item.updating = true;
            }
        }

        $scope.presentDiv = function (num) {

            $scope.tab = num;
            if (num == 1) {
                $scope.visibililtyAdd = false;
                $scope.visibililtyList = true;
                $scope.clearInsertForm();
            }else{
                $scope.visibililtyAdd = true;
                $scope.visibililtyList = false;
            };

            $scope.wasInserted = false;
        };

        $scope.clearInsertForm = function(){
            $scope.nameF='';
            $scope.adressF='';
            $scope.emailF='';
            $scope.phoneF='';
            $scope.addContactForm.$setPristine();
            $scope.addContactForm.$setUntouched();
        };

    });//end of controller


})();

