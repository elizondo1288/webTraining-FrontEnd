(function(){
    
    var model = {
            contacts: [{ name: "Esteban Elizondo", address: "San Jose Costa Rica", email:"elizondo1288@hotmail.com",phone:"8864-1981"},
                    { name: "Pedro Perez", address: "Cartago", email:"pedrop@gmail.com",phone:"8832-1123"}]
        };

    //we set the module for the angular page
    var contactsApp = angular.module("contactsApp", []);

    /*
    * We set the controller for this contact application
    */
    contactsApp.controller("ContactsCtrl", function ($scope) {

        //we assigned the model to the controller
        $scope.model = model;

        //visibility variables to show / hide panels
        $scope.visibililtyAdd = false;
        $scope.visibililtyList = true;

        $scope.wasInserted = false;
        $scope.tab = 1;
        
        
        $scope.isSelected=function(checkTab){
        return $scope.tab === checkTab;
        };

        $scope.addNewContact = function (nam, add, em, ph) {
                $scope.model.contacts.push({ name: nam, address: add, email:em, phone:ph});
                $scope.wasInserted = true;
                $scope.nameF='';
                $scope.adressF='';
                $scope.emailF='';
                $scope.phoneF='';
                $scope.addContactForm.$setPristine();
                
        };

        $scope.clearInsertForm = function(){

        }

        $scope.presentDiv = function (num) {

            $scope.tab = num;
            if (num == 1) {
                $scope.visibililtyAdd = false;
                $scope.visibililtyList = true;
            }else{
                $scope.visibililtyAdd = true;
                $scope.visibililtyList = false;
            };

            $scope.wasInserted = false;
        };

    });//end of controller


})();

