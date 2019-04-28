import BaseService from './base_service';


export default class ShoppingcartService extends BaseService {

  constructor() {
    super();
  }

  getShoppingcart() {
    var shoppingCart = localStorage.getItem('shoppingCart');
    try {
      shoppingCart = JSON.parse(shoppingCart);
    } catch (e) {
      shoppingCart = null;
    }
    shoppingCart = shoppingCart ? shoppingCart : {items: []};

    shoppingCart.items = shoppingCart.items ? shoppingCart.items : [];

    shoppingCart.items.map(function(attribute) {
      try {
	attribute.attributes = JSON.parse(attribute.attributes);
      } catch (e) {
      }
      return attribute;
    });

    return shoppingCart;
  }
  

  addToCart(productId, quantity, attributes) {
    var that = this;

    var shoppingCart = this.getShoppingcart();

    var getCartId = null;

    if (!shoppingCart.cartId) {
      getCartId = this.getCartId().then(function(data) {
	shoppingCart.cartId = data.cart_id;

	localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

	return data.cart_id;
      });
    } else {
      getCartId = Promise.resolve(shoppingCart.cartId);
    }

    return getCartId.then(function(cartId) {
      var formData = new FormData();

      formData.append('cart_id', cartId);
      formData.append('product_id', productId);
      formData.append('attributes', JSON.stringify(attributes));

      return fetch(that.baseUrl + '/shoppingcart/add', Object.assign({
      	body: formData, // must match 'Content-Type' header
      	method: 'POST'
      }, that.getOptions())).then(function(res) {

      	return res.json();
      }).then(function(data) {


	var itemIndex = data.length - 1;
	var addedItem = data[itemIndex];

	if (addedItem && addedItem.product_id == productId) {

	  return that.updateItem(addedItem.item_id, quantity).then(function(items) {
	    that.getCartTotalAmount(cartId).then(function(data) {
	      shoppingCart.items = items;
	      shoppingCart.totalAmount = data['total_amount'];

	      localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
	      return data;
	    });
	  });
	}
	return data;
      });

    });
  }

  updateItem(itemId, quantity) {
    var url = this.baseUrl + '/shoppingcart/update/' + itemId;

    var formData = new FormData();
    formData.append('quantity', quantity);

    return fetch(url, Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'PUT'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  saveForLater(itemId) {
    var url = this.baseUrl + '/shoppingcart/saveForLater/' + itemId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.text();
    });
  }

  moveToCart(itemId) {
    var url = this.baseUrl + '/shoppingcart/moveToCart/' + itemId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.text();
    });
  }

  removeProduct(itemId) {
    var url = this.baseUrl + '/shoppingcart/removeProduct/' + itemId;

    return fetch(url, Object.assign({
      method: 'DELETE'
    }, this.getOptions())).then(function(res) {
      return res.text();
    });
  }

  getCartTotalAmount(cartId) {
    var url = this.baseUrl + '/shoppingcart/totalAmount/' + cartId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getCartProducts(cartId) {
    var url = this.baseUrl + '/shoppingcart/' + cartId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getSavedProducts(cartId) {
    var url = this.baseUrl + '/shoppingcart/getSaved/' + cartId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getRefreshCart(cartId) {
    return this.getCartProducts(cartId).then(function(data) {
    });
  }
  
  getCartId() {
    var url = this.baseUrl + '/shoppingcart/generateUniqueId';

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

}
