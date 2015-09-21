import Carousel from './lib/Carousel';

export default {
  carousel : {
    init(target, id) {
      return new Carousel(target, id);
    }
  }
}
