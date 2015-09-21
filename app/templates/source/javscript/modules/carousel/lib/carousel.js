/**********
 The following two items are now global and don't need to be imported.
**********/
// import $ from 'jquery';
// import slick from 'slick';
import R from 'ramda';
import fetch from 'whatwg-fetch';

export default class Carousel {
  constructor(target, id) {
    this.id = id;
    this.target = target;
    this.settings = JSON.parse(target.getAttribute('data-settings'));
    this.init();
  }

  init() {
    $(this.target).slick(this.settings);
  }
}
