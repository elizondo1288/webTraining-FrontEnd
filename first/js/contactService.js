angular.module('contactsApp').service('contactService', ['$http','$q',

	function($http, $q){       
		
		var SERVER_INFO = "http://localhost:8080/";

        this.getContactsDB = function(){

        	var newcontacts = [];

        	var deferred = $q.defer();

            $http.get(SERVER_INFO+'getContacts').
              success(function(data, status, headers, config) {
                
                   deferred.resolve(data);

              }).
              error(function(data, status, headers, config) {
              		deferred.reject('Error in the connection: ' + status);
                	alert(status);
              });

              return deferred.promise;
        }


		//methods to connect with the database
        this.addContactDB = function(nam, add, em, ph){
            
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

            	console.log(data.status);
                alert(data.status);
                return data.status;
            }).
            error(function(data, status, headers, config){
                alert(status);
            });
        }

        this.deleteContactDB = function(contact){
            
            var req = {
                        method: 'DELETE',
                        url: SERVER_INFO+'deleteContact',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: { 'email': contact.email
                        }
                    }

          	var deferred = $q.defer();

            $http(req).
            success(function(data, status, headers, config){
                deferred.resolve();
                alert(data.message);

   
            }).
            error(function(data, status, headers, config){
                deferred.reject('Error in the connection: ' + status);
                alert(status);
            });

            return deferred.promise;
        }

        this.updateContactDB = function(contact,oldEmail){
            
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

            var deferred = $q.defer();
            
            $http(req).
            success(function(data, status, headers, config){
            	alert(data.message);
                deferred.resolve();
            }).
            error(function(data, status, headers, config){
                deferred.reject('Error in the connection: ' + status);
                alert(status);
            });

            return deferred.promise;
        }   
}]);