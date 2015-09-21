import R from 'ramda';
import guid from './utils/guid';
import Dispatcher from './utils/dispatcher';
// import Requester from './utils/requester';

const dispatcher = new Dispatcher()

export default class Hi {
  //- Initialization code
  constructor(options) {
    // setup Mediator || Pub/Sub Channels for event emitting
    this.channels = {};
    this.registeredModules = {};
  }

  /******************
  Module Registration
  ******************/
  register(module) {
    for (let key in module) {
      if (!this.isRegistered(key)) {
        this.registeredModules[key] = module[key];
        this.wireupModule(key);
      } else {
        // module is registered
        // wireup any new instances that were added to the DOM
        this.wireupModule(key);
      }
    }
  }
  unregister(module) {
    for (let key in module) {
      if (this.isRegistered(key)) {
        delete this.registeredModules[key];
      }
    }
  }
  isRegistered(key) {
    return R.curry((registered, item) => {
      return R.has(item, registered)
    })(this.registeredModules || {})(key)
  }
  instantiateModules(module) {
    const moduleName = module.getAttribute('data-module');
    if (this.isRegistered(moduleName)) {
      const newModule = this.registeredModules[moduleName].init(module, guid());
    }
  }
  wireupModule(key) {
    // run handlers and enhancers
    R.forEach(this.instantiateModules.bind(this), document.querySelectorAll('[data-module="'+key+'"]'));
  }

  /******************
  Mediator || Pub/Sub
  ******************/
  installTo(obj) {
    obj.subscribe = this.subscribe;
    obj.publish = this.publish;
  }
  subscribe(channel, callback) {
    if (!this.channels[channel]) this.channels[channel] = [];
    this.channels[channel].push({context: this, receive: callback});
    return this;
  }
  publish(channel, data) {
    if (!this.channels[channel]) return false;
    this.channels[channel].forEach((subscriber) => {
      subscriber.receive(subscriber.context, data);
    });
  }
}
