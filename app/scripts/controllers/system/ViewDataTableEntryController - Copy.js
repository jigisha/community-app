(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewDataTableEntryController: function(scope, location, routeParams, route, resourceFactory) {

      scope.tableName = routeParams.tableName;
      scope.entityId = routeParams.entityId;
      scope.resourceId = routeParams.resourceId;

      scope.columnHeaders = [];
      scope.formData = {};
      scope.isViewMode = true;

      var reqparams = {datatablename:scope.tableName, entityId:scope.entityId, genericResultSet:'true'};
      if (scope.resourceId) { reqparams.resourceId = scope.resourceId; }

      resourceFactory.DataTablesResource.getTableDetails(reqparams, function(data) {
        for(var i in data.columnHeaders) {
          if (data.columnHeaders[i].columnCode) {
            for (var j in data.columnHeaders[i].columnValues){
              if (data.data[0].row[i] == data.columnHeaders[i].columnValues[j].id) {
                data.columnHeaders[i].value = data.columnHeaders[i].columnValues[j].value;
              }
            }
          } else {
            data.columnHeaders[i].value = data.data[0].row[i];
          }
        }
        scope.columnHeaders = data.columnHeaders;
      });

      scope.editDatatableEntry = function () {
        scope.isViewMode = false;
        var colName = scope.columnHeaders[0].columnName;
        if(colName == 'id') { scope.columnHeaders.splice(0,1); }

        colName = scope.columnHeaders[0].columnName;
        if(colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
          scope.columnHeaders.splice(0,1);
        }

        for(var i in scope.columnHeaders) {
          scope.formData[scope.columnHeaders[i].columnName] = [scope.columnHeaders[i].value;
          if (scope.columnHeaders[i].columnCode) {
            for (var j in scope.columnHeaders[i].columnValues){
              if (scope.columnHeaders[i].value == scope.columnHeaders[i].columnValues[j].value) {
                scope.formData[scope.columnHeaders[i].columnName] = scope.columnHeaders[i].columnValues[j].id;
              }
            }
          }
        }
      };

      scope.deleteDatatableEntry = function () {
        resourceFactory.DataTablesResource.delete(reqparams, {}, function(data){
          var destination = "";
          if ( data.loanId) {
            destination = '/viewloanaccount/'+data.loanId;
          } else if ( data.savingsId) {
            destination = '/viewsavingaccount/' + data.savingsId;
          } else if ( data.clientId) {
            destination = '/viewclient/'+data.clientId;
          } else if ( data.groupId) {
            destination = '/viewgroup/'+data.groupId;
          } else if ( data.centerId) {
            destination = '/viewcenter/'+data.centerId;
          } else if ( data.officeId) {
            destination = '/viewoffice/'+data.officeId;
          }
          location.path(destination);
        });
      };

      scope.cancel = function () {
        route.reload();
      };

      scope.submit = function () {
        this.formData.locale = 'en';
        this.formData.dateFormat =  'dd MMMM yyyy';
        resourceFactory.DataTablesResource.update(reqparams, this.formData, function(data){
          var destination = "";
          if ( data.loanId) {
            destination = '/viewloanaccount/'+data.loanId;
          } else if ( data.savingsId) {
            destination = '/viewsavingaccount/' + data.savingsId;
          } else if ( data.clientId) {
            destination = '/viewclient/'+data.clientId;
          } else if ( data.groupId) {
            destination = '/viewgroup/'+data.groupId;
          } else if ( data.centerId) {
            destination = '/viewcenter/'+data.centerId;
          } else if ( data.officeId) {
            destination = '/viewoffice/'+data.officeId;
          }
          location.path(destination);
        });
      };

    }
  });
  mifosX.ng.application.controller('ViewDataTableEntryController', ['$scope', '$location', '$routeParams', '$route', 'ResourceFactory', mifosX.controllers.ViewDataTableEntryController]).run(function($log) {
    $log.info("ViewDataTableEntryController initialized");
  });
}(mifosX.controllers || {}));