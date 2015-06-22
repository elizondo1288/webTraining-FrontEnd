(function(){
    
    var model = {
            contacts: []
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
            .when('/detailupdate',{
                templateUrl:'partials/detailupdate.html'
            })
            .otherwise({
                redirectTo:'/'
            })

    });


    /*
    * We set the controller for this contact application
    */
    contactsApp.controller("ContactsCtrl", ['$scope','$location','$route','$http', '$q', 'contactService',

        function ($scope, $location, $route, $http, $q, contactService) {

        //we assigned the model to the controller
        $scope.model = model;
        $scope.isUpdating = false;
        $scope.tab = 1;
        

        $scope.$on('$routeChangeSuccess', function() {
            if (($location.path() == '/')||($location.path() == '/detailupdate')) {

                if ($location.path() == '/') {
                    $scope.model.contacts = [];
                    var promise = contactService.getContactsDB();

                    promise.then(function(contacts){
                        angular.forEach(contacts, function (contact){
                        $scope.model.contacts.push({ name: contact.name,
                                                         address: contact.address, 
                                                         email:contact.email, 
                                                         phone:contact.phone, 
                                                         updating:false});

                        });

                    },function(data){
                        alert(data);
                    });
                };
                $scope.tab = 1;
            }else{
                $scope.tab = 2;
            }
        });
        
        
        $scope.isSelected=function(checkTab){
            return $scope.tab === checkTab;
        };

        $scope.presentDiv = function (num) {
            $scope.tab = num;
            if (num == 1) {
                $scope.clearInsertForm();
            }
        };

        $scope.clearInsertForm = function(){
            $scope.nameF='';
            $scope.adressF='';
            $scope.emailF='';
            $scope.phoneF='';
            //$scope.addContactForm.$setPristine();
            //$scope.addContactForm.$setUntouched();
        };

        $scope.changeUpdate = function(){
            
            if($scope.isUpdating){
                $scope.isUpdating = false;
            } else{
                $scope.isUpdating = true;
            }
        };

        $scope.addNewContact = function (nam, add, em, ph) {

            if (!$scope.existsContactbyMail(em)) {

                var status = contactService.addContactDB(nam, add, em, ph);
                console.log('This is the status: ', status);

                $scope.model.contacts.push({ name: nam, address: add, email:em, phone:ph, updating:false});
                $location.path("/");
                $scope.clearInsertForm();

            }else{
                alert("That email is already registered");
            }                
        };

        $scope.updateNewContact = function(selectedContact){

        	var exists = $scope.existsContactbyMail(selectedContact.email);
        	console.log(exists);

            if (!exists) {

                var promise = contactService.updateContactDB(selectedContact,$scope.oldEmail);

                promise.then(function(){
                    $location.path("/");

                },function(data){
                    alert(data);
                });       

            }else{

                if (selectedContact.email == $scope.oldEmail) {

                    var promise = contactService.updateContactDB(selectedContact,$scope.oldEmail);

                    promise.then(function(){
                        $location.path("/");
                    },function(data){
                        alert(data);
                    });             

                }else{
                    alert("That new email is already registered");    
                }                
            }
        }

        $scope.deleteContact = function(item){

            var promise = contactService.deleteContactDB(item);

            promise.then(function(){  
                var index=$scope.model.contacts.indexOf(item);
                $scope.model.contacts.splice(index,1);
                $location.path("/");
            },function(data){
                alert(data);
            });
        };

        $scope.viewContact = function(item){
        	$scope.selectedContact = angular.copy(item);
            $scope.oldEmail = item.email;
            $location.path("/detailupdate");
        }
        
        $scope.existsContactbyMail = function(email){

            var founded = false;
            angular.forEach($scope.model.contacts, function (contactRegistered){
                
                console.log(contactRegistered.email + " - " + email);
                if (contactRegistered.email == email) {
                    founded= true;
                    return founded;
                };
            });
            return founded;
        }

    }]);//end of controller
})();//end of javascript

