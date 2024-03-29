var M = require('materialize-css/dist/js/materialize.js');

import {formatPrice} from './../shared/nunjucks';
import ShoppingcartService from './../services/shoppingcart';
import {SMALL_SUBMITTING_DIV} from './../constants';

var forms = require('./../shared/forms');

var routes = require('./../routes');

var shoppingcartService = new ShoppingcartService();


export function updateCartHeader(totalAmount) {
  var cartDiv = document.querySelector('header .shopping-cart a');
  if (cartDiv) {
    cartDiv.innerHTML = formatPrice(totalAmount);
  }
}

function handleSearch(e) {
  e.preventDefault();
  e.stopPropagation();

  var elem = e.target;
  if (elem.tagName != 'A') {
    elem = elem.closest('a');
  }
  var label = elem.closest('label');

  if (elem.classList.contains('close')) {
    label.classList.remove('shown');
  } else if (elem.classList.contains('show')) {
    label.classList.add('shown');
  }
}

function handleSearchProducts() {
  var searchString = document.querySelector('input[name=search]').value;
  var searchAll = document.querySelector('input[name=search_all]').checked ? 'on' : 'off';

  routes.router.navigate('/?search=' + searchString + '&searchAll=' + searchAll, true);
};


export function handleFormCatch(form, error) {
  forms.clearAllErrors(form);

  if (error.field) {
    forms.showInputError(form, error.field, error.message);
  } else {
    forms.showFormError(form, (error.message || 'Internal error'));
  }
}


export function showSubmitting(form) {
  var submitting;

  var button = form.querySelector('button');
  button.classList.add('hide');

  submitting = document.createElement('div');
  submitting.innerHTML = SMALL_SUBMITTING_DIV;

  button.closest('div').appendChild(submitting.firstChild);
}


export function hideSubmitting(form) {
  var submitting = form.querySelector('img.submitting');

  if (submitting) {
    submitting.remove();
  }

  var button = form.querySelector('button');
  button.classList.remove('hide');
}


export default class BaseController {

  constructor() {
    var authorizationKey = localStorage.getItem('authorizationKey'),
	customer = localStorage.getItem('customer'),
	isFacebookLogin = localStorage.getItem('isFacebookLogin');

    try {
      customer = JSON.parse(customer);
    } catch (e) {
      customer = {};
    }

    this.customer = customer || {};
    this.isFacebookLogin = isFacebookLogin;
  }

  handleSearchEvent() {


    if (element) {
      element.removeEventListener('click', handleSearchProducts);
      element.addEventListener('click', handleSearchProducts);
    }
  }

  handleSearchEvent() {
    var elements = document.querySelectorAll('header a.close, header a.show');

    elements.forEach(function(element) {
      element.removeEventListener('click', handleSearch);
      element.addEventListener('click', handleSearch);
    });
    //
    var form = document.querySelector('.search form');
    form.removeEventListener('submit', handleSearchProducts);
    form.addEventListener('submit', handleSearchProducts);
  }

  globalInit() {
    var elems = document.querySelectorAll('.customer-menu-trigger');
    var instances = M.Dropdown.init(elems, {});

    var shoppingcart = shoppingcartService.getShoppingcart();

    updateCartHeader(shoppingcart.totalAmount);

    this.handleSearchEvent();
  }

  
}
