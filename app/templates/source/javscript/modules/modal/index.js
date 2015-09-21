import Modal from './lib/Modal';

export default {
  modal : {
    init(target, id) {
      return new Modal(target, id);
    }
  }
}
