var validate = require("validate.js");


// Restricts input for the given textbox to the given inputFilter.
// https://stackoverflow.com/a/469362
export function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  });
}


export function showInputError(form, key, message) {
  var elem = form.querySelector('input[name=' + key + ']');

  if (elem) {

    elem.closest('.input-field').classList.add('has-error');

    var error = document.createElement('div');
    error.innerHTML = '<div class="error-msg">' + message + '</div>';

    elem.after(error.firstChild);
  }

}


export function clearAllErrors(form) {
  form.querySelectorAll('.error-msg').forEach(function(elem) {
    elem.closest('.input-field').classList.remove('has-error');
    elem.remove();
  });
}


export function validateForm(form, data, constraints) {
  clearAllErrors(form);

  var errors = validate(data, constraints);

  if (errors) {
    for (var key in errors) {
      showInputError(form, key, errors[key][0]);
    }
    return false;
  }

  return true;
}


export function showFormError(form, errorMsg) {
  var elem = form.querySelector('input:first-child');

  var error = document.createElement('div');
  error.innerHTML = '<div class="error-msg">' + errorMsg + '</div>';

  elem.before(error.firstChild);
}
