var M = require('materialize-css/dist/js/materialize.js');


export function error(message) {
  M.Toast.dismissAll();
  M.toast({html: message, classes: 'error-message red'});
}

export function success(message) {
  M.Toast.dismissAll();
  M.toast({html: message, classes: 'success-message green'});
}
