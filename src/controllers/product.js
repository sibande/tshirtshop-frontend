import {configure, renderString, render} from 'nunjucks';
import {tns} from 'tiny-slider/src/tiny-slider';
var M = require('materialize-css/dist/js/materialize.js');

import BaseController from './base';
import ProductService from './../services/product';
import ShoppingcartService from './../services/shoppingcart';
import AttributeService from './../services/attribute';
import {handleAddToCartEvent} from './shoppingcart';


var productService = new ProductService();
var attributeService = new AttributeService();
var shoppingcartService = new ShoppingcartService();


export default class ProductController extends BaseController {

  constructor() {
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


	    var element = document.querySelector('button.add-to-cart');
	    handleAddToCartEvent(element, {
	      productId: that.params.productId,
	      productAttributes: that.productAttributes,
	      form: document.querySelector('button.add-to-cart').closest('form')
	    });
	  });
	});

      }
    });
  }
}
