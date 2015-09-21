/**********
 The following two items are now global and don't need to be imported.
**********/
// import $ from 'jquery';
// import cbox from 'jquery-colorbox';
import R from 'ramda';

export default class Modal {
  constructor(target, id) {
    this.id = id;
    this.target = target;
    this.settings = JSON.parse(target.getAttribute('data-settings'));
    this.init();
  }

  init() {
    $(this.target).colorbox(R.merge(this.settings, {"href" : $(this.target).parent().find('.modal-content')}));
  }
}
