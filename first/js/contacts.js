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
    contactsApp.controller("ContactsCtrl", ['$scope','$location','$route','$http',

        function ($scope, $location, $route, $http) {

        //we assigned the model to the controller
        $scope.model = model;
        var SERVER_INFO = "http://localhost:8080/";
        $scope.isUpdating = false;
        $scope.tab = 1;
        

        $scope.$on('$routeChangeSuccess', function() {
            if (($location.path() == '/')||($location.path() == '/detailupdate')) {

                if ($location.path() == '/') {
                    $scope.getContactsDB();
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

                $scope.addContactDB(nam, add, em, ph);       

            }else{
                alert("That email is already registered");
            }                
        };

        $scope.updateNewContact = function(selectedContact){

        	var exists = $scope.existsContactbyMail(selectedContact.email);
        	console.log(exists);

            if (!exists) {

                $scope.updateContactDB(selectedContact,$scope.oldEmail); 

            }else{

            	console.log("---------- " + $scope.oldEmail);

                if (selectedContact.email == $scope.oldEmail) {
                    //we are not changing the email
                    $scope.updateContactDB(selectedContact,$scope.oldEmail);                     
                }else{
                    alert("That new email is already registered");    
                }
                
            }
        }

        $scope.deleteContact = function(item){
             $scope.deleteContactDB(item);
        };

        $scope.viewContact = function(item){

        	$scope.selectedContact = angular.copy(item);


           /* $scope.selectedContact.name = item.name;
            $scope.selectedContact.address = item.address;
            $scope.selectedContact.email = item.email;
            $scope.selectedContact.phone = item.phone;*/

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

        /*
        *  DATA ACCESS METHODS
        *
        */

        //methods to connect with the database
        $scope.addContactDB = function(nam, add, em, ph){
            
            var req = {
                        method: 'POST',
                        url: SERVER_INFO+'addContact',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {'name': nam,
                                'address':add,
                                'email': em,
                                'phone':ph
                        }
                    }
                    
            $http(req).
            success(function(data, status, headers, config){
                alert(data.message);

                $scope.model.contacts.push({ name: nam, address: add, email:em, phone:ph, updating:false});
                $location.path("/");
                $scope.clearInsertForm();
            }).
            error(function(data, status, headers, config){
                alert(status);
            });
        }

        //methods to connect with the database
        $scope.updateContactDB = function(contact,oldEmail){
            
            var req = {
                        method: 'PUT',
                        url: SERVER_INFO+'updateContact',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {'name': contact.name,
                                'address':contact.address,
                                'email': contact.email,
                                'phone':contact.phone,
                                'oldEmail':oldEmail
                        }
                    }

            $scope.loading = true;
            
            $http(req).
            success(function(data, status, headers, config){
                alert(data.message);
                $location.path("/");
            }).
            error(function(data, status, headers, config){
                alert(status);
            });
        }

        //methods to connect with the database
        $scope.deleteContactDB = function(contact){
            
            var req = {
                        method: 'DELETE',
                        url: SERVER_INFO+'deleteContact',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: { 'email': contact.email
                        }
                    }

            $scope.loading = true;
            
            $http(req).
            success(function(data, status, headers, config){
                var index=$scope.model.contacts.indexOf(contact);
                $scope.model.contacts.splice(index,1);
                alert(data.message);
                $location.path("/");
            }).
            error(function(data, status, headers, config){
                alert(status);
            });
        }

        $scope.getContactsDB = function(){

        	$scope.model.contacts = [];

            $http.get(SERVER_INFO+'getContacts').
              success(function(data, status, headers, config) {
                
                angular.forEach(data, function (contact){

                    $scope.model.contacts.push({ name: contact.name,
                                                     address: contact.address, 
                                                     email:contact.email, 
                                                     phone:contact.phone, 
                                                     updating:false});

                });
              }).
              error(function(data, status, headers, config) {
                	alert(status);
              });
        }



    }]);//end of controller


})();

