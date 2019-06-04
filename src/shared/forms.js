var validate = require("validate.js");


export function validateForm(form, data, constraints) {

  form.querySelectorAll('.error-msg').forEach(function(elem) {
    elem.closest('.input-field').classList.remove('has-error');
    elem.remove();
  });

  var errors = validate(data, constraints);

  if (errors) {
    for (var key in errors) {
      var value = errors[key];

      var elem = form.querySelector('input[name=' + key + ']');
      if (elem) {
	elem.closest('.input-field').classList.add('has-error');
	
	var error = document.createElement('div');
	error.innerHTML = '<div class="error-msg">' + value[0] + '</div>';

	elem.after(error.firstChild);
      }
    }
    return false;
  }

  return true;
}


export function showFormError(form, errorMsg) {
  form.querySelectorAll('.error-msg').forEach(function(elem) {
    elem.closest('.input-field').classList.remove('has-error');
    elem.remove();
  });
  
  var elem = form.querySelector('input:first-child');

  var error = document.createElement('div');
  error.innerHTML = '<div class="error-msg">' + errorMsg + '</div>';

  elem.before(error.firstChild);
}
