import {configure, renderString, render} from 'nunjucks';
import {tns} from 'tiny-slider/src/tiny-slider';
var M = require('materialize-css/dist/js/materialize.js');

import ProductService from './../services/product';
import ShoppingcartService from './../services/shoppingcart';
import AttributeService from './../services/attribute';


var productService = new ProductService();
var attributeService = new AttributeService();
var shoppingcartService = new ShoppingcartService();


export function handleAddToCart(e) {

  var customParams = e.target.customParams;

  var form = customParams.form;
  var quantity = form.querySelector('input[name=quantity]').value || 1;
  var colorId = form.querySelector('input[name="Color"]:checked');
  colorId = colorId ? colorId.value : colorId;
  var colorName = customParams.productAttributes['Color'][colorId].attribute_value;

  var sizeId = form.querySelector('input[name="Size"]:checked');
  sizeId = sizeId ? sizeId.value : sizeId;
  var sizeName = customParams.productAttributes['Size'][sizeId].attribute_value;

  var attributes = {
    Size: {id: sizeId, name: sizeName},
    Color: {id: colorId, name: colorName}
  };

  shoppingcartService.addToCart(customParams.productId, quantity, attributes).then(function(data) {
    if (customParams.afterCallback) {
      //
      var intervalId = setTimeout(() => {
	customParams.afterCallback();
      }, 300);
    }
  });
}

export default class ProductController {

  constructor() {
  }

  handleAddToCartEvent() {
    var that = this;

    var element = document.querySelector('button.add-to-cart');

    element.removeEventListener('click', handleAddToCart);
    element.addEventListener('click', handleAddToCart);
    element.customParams = {
      productId: that.params.productId,
      productAttributes: that.productAttributes,
      form: document.querySelector('form')
    };
  }

  render(params, query) {
    var that = this;

    this.params = params;

    productService.getProduct(params.productId).then(function(product) {
      if (!('error' in product)) {
	attributeService.getProductAttributes(params.productId).then(function(attributes) {

	  var mappedAttributes = attributeService.mapProductAttributes(attributes);
	  that.productAttributes = mappedAttributes;

	  render('product.html', {product: product, attributes: mappedAttributes}, function(err, res) {
	    // Render the page
	    var mainDiv = document.getElementById('main');
	    mainDiv.innerHTML= res;
	    
	    var slider = tns({
	      "container": "#customize",
	      "items": 1,
	      "controlsContainer": "#customize-controls",
	      "navContainer": "#customize-thumbnails",
	      "navAsThumbnails": true,
	      "autoplay": false,
	      "swipeAngle": false
	    });

	    M.updateTextFields();

	    that.handleAddToCartEvent();

	  });
	});

      }
    });
  }
}
