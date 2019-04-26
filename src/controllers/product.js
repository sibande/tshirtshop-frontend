import {configure, renderString, render} from 'nunjucks';
import {tns} from 'tiny-slider/src/tiny-slider';
var M = require('materialize-css/dist/js/materialize.js');

import ProductService from './../services/product';
import ShoppingcartService from './../services/shoppingcart';
import AttributeService from './../services/attribute';


var productService = new ProductService();
var attributeService = new AttributeService();
var shoppingcartService = new ShoppingcartService();

export default class ProductController {

  constructor() {
  }

  handleAddToCartEvent() {
    var that = this;

    var element = document.querySelector('button.add-to-cart');

    var handleAddToCart = function(e) {

      var form = document.querySelector('form');
      var quantity = form.querySelector('input[name=quantity]').value;
      var colorId = form.querySelector('input[name="Color"]:checked');
      colorId = colorId ? colorId.value : colorId;
      var colorName = that.productAttributes[that.params.productId]['Color'][colorId].attribute_value;
      
      var sizeId = form.querySelector('input[name="Size"]:checked');
      sizeId = sizeId ? sizeId.value : sizeId;
      var sizeName = that.productAttributes[that.params.productId]['Size'][sizeId].attribute_value;

      var attributes = {
	Size: {id: sizeId, name: sizeName},
	Color: {id: colorId, name: colorName}
      };

      shoppingcartService.addToCart(that.params.productId, quantity, attributes).then(function(data) {
	//
      });
    };
    element.removeEventListener('click', handleAddToCart);
    element.addEventListener('click', handleAddToCart);

  }

  handleProductAttributes(attributes) {
    // Store in localStorage
    this.productAttributes = {};

    var mappedAttributes = {};

    for (var index in attributes) {
      var attribute = attributes[index];
      if (!(attribute.attribute_name in mappedAttributes)) {
	mappedAttributes[attribute.attribute_name] = {};
      }
      mappedAttributes[attribute.attribute_name][attribute.attribute_value_id] = attribute;

      this.productAttributes[this.params.productId] = mappedAttributes;
    }

    return mappedAttributes;
  }

  render(params, query) {
    var that = this;

    this.params = params;

    productService.getProduct(params.productId).then(function(product) {
      if (!('error' in product)) {
	attributeService.getProductAttributes(params.productId).then(function(attributes) {
	  var mappedAttributes = that.handleProductAttributes(attributes);

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
