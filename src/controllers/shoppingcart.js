import {configure, renderString, render} from 'nunjucks';

import ProductService from './../services/product';
import ShoppingcartService from './../services/shoppingcart';


var productService = new ProductService();
var shoppingcartService = new ShoppingcartService();


export default class ShoppingcartController {

  constructor() {
    //
  }

  render() {
    var cartId = null;

    var shoppingCart = shoppingcartService.getShoppingcart();
    var getCartItems = Promise.all([Promise.resolve([]), Promise.resolve([])]);
    if (shoppingCart.cartId) {
      cartId = shoppingCart.cartId;
      getCartItems = Promise.all([
	shoppingcartService.getSavedProducts(cartId), shoppingcartService.getCartProducts(cartId)]);
    }

    getCartItems.then(function(data) {
      var savedItems = data[0];
      var cartItems = data[1];
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


      
      render('cart_details.html', {savedItems: savedItems, cartItems: cartItems}, function(err, res) {
	var mainDiv = document.getElementById('main');
	mainDiv.innerHTML= res;
      });
    });

  }
}
