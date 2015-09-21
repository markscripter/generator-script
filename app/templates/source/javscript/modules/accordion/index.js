import Accordion from './lib/Accordion';

export default {
  accordion : {
    init(target, id) {
      return new Accordion(target, id);
    }
  }
}
