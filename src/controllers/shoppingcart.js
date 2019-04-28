import {configure, renderString, render} from 'nunjucks';

import ProductService from './../services/product';
import ShoppingcartService from './../services/shoppingcart';


var productService = new ProductService();
var shoppingcartService = new ShoppingcartService();

function handleSaveItemClick(e) {
  e.preventDefault();
  e.stopPropagation();

  var elem = e.target;
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
  var row = elem.closest('.row');

  var controller = elem.customParams.controller;

  if (row.getAttribute('data-item-id')) {
    var itemId = row.getAttribute('data-item-id');

    shoppingcartService.removeProduct(itemId).then(function(data) {
      controller.renderItems();
    });
  }
}


export default class ShoppingcartController {

  constructor() {
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

  renderItems() {
    var that = this;
    var cartId = null;

    var shoppingCart = shoppingcartService.getShoppingcart();
    var getCartItems = Promise.all([Promise.resolve([]), Promise.resolve([]), Promise.resolve({})]);
    if (shoppingCart.cartId) {
      cartId = shoppingCart.cartId;
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

    render('cart_details.html', {}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.renderItems();
    });

  }
}
