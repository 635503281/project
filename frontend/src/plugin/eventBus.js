import Vue from 'vue';
/**
 * Event Bus
 */
const eventBus = (function () {
  return {
    subscribers: Object.create(null),
    listen(eventName, fn) {
      if (!this.subscribers[eventName]) {
        this.subscribers[eventName] = [];
      }
      this.subscribers[eventName] = fn;
    },
    emit() {
      let eventName = Array.prototype.shift.call(arguments);
      let fns = this.subscribers[eventName];
      if (!fns) {
        return false;
      }
      fns.call(this, ...arguments);
    }
  }
})();

Vue.mixin({
  beforeCreate: function () {
    this.$eventBus = eventBus;
  }
})