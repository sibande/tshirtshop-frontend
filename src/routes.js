import {configure, renderString, render} from 'nunjucks';
import Navigo from 'navigo';

import HomeController from './controllers/home';

var root = '';
var router = new Navigo(root);

router
  .on({
    '/hello': function () {

      console.log('hello hello');

    },
    '*': function () {
      console.log('hello dashboard');
      
      var controller = new HomeController;
      controller.render();
      
    },
    '/hello2': function () {

      console.log('hello2 hello2');

    }
  })
  .resolve();
