import Hi from './app/index.js';
import Accordion from './modules/accordion';
import Modal from './modules/modal';
import Carousel from './modules/carousel';

const app = new Hi();

// register modules
app.register(Accordion);
app.register(Modal);
app.register(Carousel);

// test events
app.publish('destroy', 'hi');
