import BaseService from './base_service';


export default class PostService extends BaseService {

  constructor() {
    super();
  }


  getProductAttributes(productId) {
    let url = this.baseUrl + '/attributes/inProduct/' + productId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }


  mapProductAttributes(attributes) {
    // Store in localStorage
    var mappedAttributes = {};

    for (var index in attributes) {
      var attribute = attributes[index];
      if (!(attribute.attribute_name in mappedAttributes)) {
	mappedAttributes[attribute.attribute_name] = {};
      }
      mappedAttributes[attribute.attribute_name][attribute.attribute_value_id] = attribute;
    }

    return mappedAttributes;
  }
}
