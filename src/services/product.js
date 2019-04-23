import BaseService from './base_service';


export default class PostService extends BaseService {

  constructor() {
    super();
  }

  list() {
    let queryParams = this.getQuery({
    }, true);

    let url = this.baseUrl + '/products';

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }


  search(queryString, allWords) {
    let queryParams = this.getQuery({
      query_string: queryString,
      all_words: allWords
    }, true);

    let url = this.baseUrl + '/products/search?' + queryParams;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }


}
