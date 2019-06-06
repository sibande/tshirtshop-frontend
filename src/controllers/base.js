var M = require('materialize-css/dist/js/materialize.js');

import {formatPrice} from './../shared/nunjucks';
import ShoppingcartService from './../services/shoppingcart';

var shoppingcartService = new ShoppingcartService();


export function updateCartHeader(totalAmount) {
  var cartDiv = document.querySelector('header .shopping-cart a');
  if (cartDiv) {
    cartDiv.innerHTML = formatPrice(totalAmount);
  }
}

export default class BaseController {

  constructor() {
    var authorizationKey = localStorage.getItem('authorizationKey'),
	customer = localStorage.getItem('customer');

    console.log(customer);
    try {
      customer = JSON.parse(customer);
    } catch (e) {
      customer = {};
    }

    this.customer = customer || {};
  }

  globalInit() {
    var elems = document.querySelectorAll('.customer-menu-trigger');
    var instances = M.Dropdown.init(elems, {});

    var shoppingcart = shoppingcartService.getShoppingcart();

    updateCartHeader(shoppingcart.totalAmount);
  }

  
}
