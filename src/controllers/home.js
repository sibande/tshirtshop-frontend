import {configure, renderString, render} from 'nunjucks';


import ProductService from './../services/product';

var productService = new ProductService();

export default class HomeController {

  constructor() {
    //
    this.departmentId = null;
    this.categoryId = null;
    this.searchString = null;
  }

  renderProducts() {

    var productList;

    if (this.searchString) {
      productList = productService.list();
    } else if (this.categoryId) {
      productList = productService.list();
    } else if (this.departmentId) {
      productList = productService.list();
    } else {
      productList = productService.list();
    }

    productList = productService.search('beautiful', 'yes');

    productList.then(function(products) {
      render('_products.html', {products: products}, function(err, res) {
	var productsElem = document.querySelector('div.products-list');

	productsElem.innerHTML= res;
      });
    });
  }
  
  render() {
    var that = this;

    render('home.html', {}, function(err, res) {
      var mainDiv = document.getElementById('main');
      mainDiv.innerHTML= res;

      that.renderProducts();

      M.updateTextFields();
    });
  }
}
