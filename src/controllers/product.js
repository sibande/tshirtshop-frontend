import {configure, renderString, render} from 'nunjucks';
import {tns} from 'tiny-slider/src/tiny-slider';
var M = require('materialize-css/dist/js/materialize.js');

import BaseController from './base';
import ProductService from './../services/product';
import ShoppingcartService from './../services/shoppingcart';
import AttributeService from './../services/attribute';
import {handleAddToCartEvent, handleAdjustQuantity} from './shoppingcart';
var forms = require('./../shared/forms');

var productService = new ProductService();
var attributeService = new AttributeService();
var shoppingcartService = new ShoppingcartService();


var timeoutId;
function updateItemQuantity(controller, quantityElem) {
  timeoutId = setTimeout(function() {
    // Quantity limited to a minimum of 1 and a maximum of 99
    if (quantityElem.value < 1) {
      quantityElem.value = 1;
    } else if (quantityElem.value > 99) {
      quantityElem.value = 99;
    }
  }, 1000);
}


export default class ProductController extends BaseController {

  constructor() {
    super();
  }

  handleQuantityChangeEvent() {
    var that = this;

    var quantityElem = document.querySelector(".product-view .quantity-select input");

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
  }

  render(params, query) {
    var that = this;

    this.params = params;

    productService.getProduct(params.productId).then(function(product) {
      if (!('error' in product)) {
	attributeService.getProductAttributes(params.productId).then(function(attributes) {

	  var mappedAttributes = attributeService.mapProductAttributes(attributes);
	  that.productAttributes = mappedAttributes;

	  var context = {
	    customer: that.customer,
	    product: product,
	    attributes: mappedAttributes
	  };

	  render('product.html', context, function(err, res) {
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

	    that.handleQuantityChangeEvent();
	    //
	    that.globalInit();
	  });
	});

      }
    });
  }
}
