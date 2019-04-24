import {configure, renderString, render} from 'nunjucks';
import {tns} from 'tiny-slider/src/tiny-slider';

import ProductService from './../services/product';
import AttributeService from './../services/attribute';


var productService = new ProductService();
var attributeService = new AttributeService();

export default class ProductController {

  constructor() {
  }

  render(params, query) {
    var that = this;
    
    productService.getProduct(params.productId).then(function(product) {

      if (!('error' in product)) {
	attributeService.getProductAttributes(params.productId).then(function(attributes) {
	  var mappedAttributes = {};

	  for (var index in attributes) {
	    var attribute = attributes[index];
	    if (!(attribute.attribute_name in mappedAttributes)) {
	      mappedAttributes[attribute.attribute_name] = [];
	    }
	    mappedAttributes[attribute.attribute_name].push(attribute);
	  }

	  render('product.html', {product: product, attributes: mappedAttributes}, function(err, res) {	    
	    // Render the page
	    var mainDiv = document.getElementById('main');
	    mainDiv.innerHTML= res;
	    console.log(tns);
	    
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
	  });
	});

      }
    });

  }
}
