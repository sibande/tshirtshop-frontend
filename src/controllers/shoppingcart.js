import {configure, renderString, render} from 'nunjucks';

import {formatPrice} from './../shared/nunjucks';

import { updateCartHeader } from './base';
import BaseController from './base';
import ProductService from './../services/product';
import ShoppingcartService from './../services/shoppingcart';

var messages = require('./../shared/messages');
var forms = require('./../shared/forms');


var productService = new ProductService();
var shoppingcartService = new ShoppingcartService();

function handleSaveItemClick(e) {
  e.preventDefault();
  e.stopPropagation();

  var elem = e.target;
  if (elem.tagName != 'A') {
    elem = elem.closest('a');
  }
  var row = elem.closest('.row');

  var controller = elem.customParams.controller;

  if (row.getAttribute('data-item-id')) {
    var itemId = row.getAttribute('data-item-id');

    shoppingcartService.saveForLater(itemId).then(function(data) {
      controller.renderItems();
    });
  }
}

function handleMoveItemClick(e) {
  e.preventDefault();
  e.stopPropagation();

  var elem = e.target;
  if (elem.tagName != 'A') {
    elem = elem.closest('a');
  }

  var row = elem.closest('.row');

  var controller = elem.customParams.controller;

  if (row.getAttribute('data-item-id')) {
    var itemId = row.getAttribute('data-item-id');

    shoppingcartService.moveToCart(itemId).then(function(data) {
      controller.renderItems();
    });
  }
}

function handleDeleteItemClick(e) {
  e.preventDefault();
  e.stopPropagation();

  var elem = e.target;
  if (elem.tagName != 'A') {
    elem = elem.closest('a');
  }
  var row = elem.closest('.row');

  var controller = elem.customParams.controller;

  if (row.getAttribute('data-item-id')) {
    var itemId = row.getAttribute('data-item-id');

    shoppingcartService.removeProduct(itemId).then(function(data) {
      controller.renderItems();
    });
  }
}

export function handleAddToCart(e) {

  var customParams = e.target.customParams;

  var form = customParams.form;
  var quantity = form.querySelector('input[name=quantity]').value || 1;
  var colorId = form.querySelector('input[name="Color"]:checked');
  colorId = colorId ? colorId.value : colorId;
  if (!colorId) {
    messages.error('Select an item color');
    return false;
  }
  var colorName = customParams.productAttributes['Color'][colorId].attribute_value;

  var sizeId = form.querySelector('input[name="Size"]:checked');

  sizeId = sizeId ? sizeId.value : sizeId;
  if (!sizeId) {
    messages.error('Select an item size');
    return false;
  }
  var sizeName = customParams.productAttributes['Size'][sizeId].attribute_value;

  var attributes = {
    Size: {id: sizeId, name: sizeName},
    Color: {id: colorId, name: colorName}
  };

  shoppingcartService.addToCart(customParams.productId, quantity, attributes).then(function(data) {
    updateCartHeader(data['total_amount']);

    messages.success('Product added to cart');
    if (customParams.afterCallback) {
      //
      var intervalId = setTimeout(() => {
	customParams.afterCallback();
      }, 300);
    }
  }).catch(function(error) {
    messages.error(error.message || 'Internal error');
  });;
  return false;
}

export function handleAddToCartEvent(element, customParams) {
  element.removeEventListener('click', handleAddToCart);
  element.addEventListener('click', handleAddToCart);
  element.customParams = customParams;
}

var timeoutId;

export function handleAdjustQuantity(e) {
  var elem = e.target;
  if (e.type == 'click' && elem.tagName != 'A') {
    elem = elem.closest('a');
  }

  var controller = elem.customParams.controller,
      quantityElem = elem.customParams.quantityElem;

  var value = parseInt(quantityElem.value) || 0;

  if (e.type == 'click') {  // Quanity changed by buttons
    if (elem.classList.contains('increase')) {
      quantityElem.value = value + 1;
    } else {
      quantityElem.value = value - 1;
    }
  }

  clearTimeout(timeoutId);

  // Handle updates to quantity
  elem.customParams.updateItemQuantity(controller, quantityElem);
}


function updateItemQuantity(controller, quantityElem) {
  timeoutId = setTimeout(function() {
    // Quantity limited to a minimum of 1 and a maximum of 99
    if (quantityElem.value < 1) {
      quantityElem.value = 1;
    } else if (quantityElem.value > 99) {
      quantityElem.value = 99;
    }

    var updating = document.createElement('div');
    updating.innerHTML ='<div class="updating-content"><div>'
      + '<img src="/static/img/ajax_small.gif" class="quick-view-loading" alt="Loading...">'
      + '</div></div>';


    var div = quantityElem.closest('.quantity-select'),
	row = div.closest('.row'),
	itemId = row.getAttribute('data-item-id');

    div.appendChild(updating.firstChild);

    shoppingcartService.updateItem(itemId, quantityElem.value).then(function(items) {
      items.forEach(function(item) {
	// Should probably update everything
	if (item.item_id == itemId) {
	  shoppingcartService.getCartTotalAmount(controller.cartId).then(function(data) {
	    //
	    updateCartHeader(data.total_amount);

	    row.querySelector('.price').innerHTML = formatPrice(item.subtotal);
	    //
	    row.querySelector('.updating-content').remove();

	  });
	}
      });
    });

  }, 1000);
}



export default class ShoppingcartController extends BaseController {

  constructor() {
    super();
    //
  }

  handleSaveItemClickEvent() {
    var that = this;

    var elements = document.querySelectorAll('div.cart-items .save');

    elements.forEach(function(element) {
      element.removeEventListener('click', handleSaveItemClick);
      element.addEventListener('click', handleSaveItemClick);

      element.customParams = {
	controller: that
      };
    });
  }

  handleMoveItemClickEvent() {
    var that = this;

    var elements = document.querySelectorAll('div.saved-items .move');

    elements.forEach(function(element) {
      element.removeEventListener('click', handleMoveItemClick);
      element.addEventListener('click', handleMoveItemClick);

      element.customParams = {
	controller: that
      };
    });
  }

  handleDeleteItemClickEvent(itemType) {
    var that = this;

    var elements = document.querySelectorAll('div.' + itemType + '-items .delete');

    elements.forEach(function(element) {
      element.removeEventListener('click', handleDeleteItemClick);
      element.addEventListener('click', handleDeleteItemClick);

      element.customParams = {
	controller: that
      };
    });
  }

  handleQuantityChangeEvent() {
    var that = this;

    var quantities = document.querySelectorAll(".cart-items .quantity-select input");


    quantities.forEach(function(quantityElem) {
      function attachQuantityEvent(elem, event) {
	elem.removeEventListener(event, handleAdjustQuantity);
	elem.addEventListener(event, handleAdjustQuantity);
	elem.customParams = {
	  controller: that,
	  quantityElem: quantityElem,
	  updateItemQuantity: updateItemQuantity
	};
      }

      // Restrict input to digits and '.' by using a regular expression filter.
      forms.setInputFilter(quantityElem, function(value) {
	return /^[0-9]{0,2}$/.test(value);
      });

      var decreaseElem = quantityElem.previousElementSibling,
	  increaseElem = quantityElem.nextElementSibling;

      attachQuantityEvent(decreaseElem, 'click');
      attachQuantityEvent(increaseElem, 'click');
      attachQuantityEvent(quantityElem, 'keyup');
    });
  }

  renderItems() {
    var that = this;
    var cartId = null;

    var shoppingCart = shoppingcartService.getShoppingcart();
    var getCartItems = Promise.all([Promise.resolve([]), Promise.resolve([]), Promise.resolve({})]);
    if (shoppingCart.cartId) {
      cartId = shoppingCart.cartId;
      that.cartId = shoppingCart.cartId;

      getCartItems = Promise.all([
	shoppingcartService.getSavedProducts(cartId),
	shoppingcartService.getCartProducts(cartId),
	shoppingcartService.getCartTotalAmount(cartId)
      ]);
    }

    var savedElem = document.querySelector('div.saved-items > .item-list');
    var cartElem = document.querySelector('div.cart-items > .item-list');

    var loadingDiv = '<div>'
	+ '<img src="/static/img/ajax_small.gif" class="quick-view-loading" alt="Loading..."></div>';
    savedElem.innerHTML= loadingDiv;
    cartElem.innerHTML= loadingDiv;

    getCartItems.then(function(data) {
      var savedItems = data[0];
      var cartItems = data[1];
      var totalAmount = data[2]['total_amount'];

      updateCartHeader(totalAmount);

      // Cache cart data
      var shoppingCart = {};
      shoppingCart.cartId = cartId;
      shoppingCart.items = cartItems;
      shoppingCart.totalAmount = totalAmount;

      localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

      cartItems.map(function(item) {
	try {
	  item.attributes = JSON.parse(item.attributes);
	} catch (e) {
	}
	return item;
      });

      savedItems.map(function(item) {
	try {
	  item.attributes = JSON.parse(item.attributes);
	} catch (e) {
	}
	return item;
      });

      render('_cart_items.html', {cartItems: cartItems, totalAmount: totalAmount}, function(err, res) {
	cartElem.innerHTML= res;

	that.handleSaveItemClickEvent();
	that.handleDeleteItemClickEvent('cart');

	//
	that.handleQuantityChangeEvent();
      });

      render('_saved_items.html', {savedItems: savedItems}, function(err, res) {
	savedElem.innerHTML= res;

	that.handleMoveItemClickEvent();
	that.handleDeleteItemClickEvent('saved');
      });
    });
  }

  render() {
    var that = this;

    render('cart_details.html', {customer: that.customer}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.renderItems();

      //
      that.globalInit();
    });

  }
}
