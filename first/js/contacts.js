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

        function ($scope, $location, $route) {

        //we assigned the model to the controller
        $scope.model = model;

        var SERVER_INFO = "http://localhost:8080/test/";

        //visibility variables to show / hide panels
        $scope.visibililtyAdd = false;
        $scope.visibililtyList = true;

        $scope.wasInserted = false;
        $scope.isUpdating = false;

        $scope.tab = 1;
        
        $scope.$on('$routeChangeSuccess', function() {
            if (($location.path() == '/')||($location.path() == '/detailupdate')) {
                $scope.tab = 1;
            }else{
                $scope.tab = 2;
            }
        });
        
        
        $scope.isSelected=function(checkTab){
        return $scope.tab === checkTab;
        };

        $scope.changeUpdate = function(){
            if($scope.isUpdating){
                $scope.isUpdating = false;
            } else{
                $scope.isUpdating = true;
            }
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

            $scope.selectedContact = item;
            $location.path("/detailupdate");

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


        //methods to connect with the database
        $scope.addContactDB = function(contact){
            
            var req = {
                        method: 'POST',
                        url: SERVER_INFO+'greetingpost',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {'name': contact.name,
                                'address':contact.address,
                                'email': contact.email,
                                'phone':contact.phone
                        }
                    }

                    $scope.loading = true;
                    
                    $http(req).
                    success(function(data, status, headers, config){
                        model.greetingPost = data;
                    }).
                    error(function(data, status, headers, config){
                        alert(status);
                    });
        }

        //methods to connect with the database
        $scope.updateContactDB = function(contact,oldEmail){
            
            var req = {
                        method: 'POST',
                        url: SERVER_INFO+'greetingpost',
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
                        model.greetingPost = data;
                    }).
                    error(function(data, status, headers, config){
                        alert(status);
                    });
        }

        //methods to connect with the database
        $scope.deleteContactDB = function(email){
            
            var req = {
                        method: 'POST',
                        url: SERVER_INFO+'greetingpost',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: { 'email': contact.email
                        }
                    }

                    $scope.loading = true;
                    
                    $http(req).
                    success(function(data, status, headers, config){
                        model.greetingPost = data;
                    }).
                    error(function(data, status, headers, config){
                        alert(status);
                    });
        }

        $scope.getContactsDB = function(){

            $http.get(SERVER_INFO+'getContacts').
              success(function(data, status, headers, config) {
                
              }).
              error(function(data, status, headers, config) {
                
              });
        }



    }]);//end of controller


})();

