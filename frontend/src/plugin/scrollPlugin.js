import Helpers from './helpers';
export default class ScrollPlugin {
  constructor() {
    this.scrollCTN = document.querySelector('#app');
    this.scrollYOffset = 0 // this.scrollCTN.children.item(0).offsetHeight - this.scrollCTN.offsetHeight;
  }
  scrollToBottom () {
    let curPosition = this.scrollCTN.scrollTop;
    let startTime = Date.now();
    let vt = this.scrollYOffset * 3 / 500;
    let v0 = vt / 2;
    let av = (vt - v0) / 500;
    let animFn = () => {
      let spacingTime = Date.now() - startTime;
      if(curPosition < this.scrollYOffset) {
        curPosition += v0 * spacingTime + av * Math.pow(spacingTime, 2) / 2;
        this.scrollCTN.scrollTop = curPosition;
        Helpers.raf.call(window, animFn);
      }
    };
    Helpers.raf.call(window, animFn);
  }
  saveScrollYPos () {
    localStorage.setItem('scrollYPos', this.scrollCTN.scrollTop);
  }
  setScrollYPos () {
    const savedYpos = localStorage.getItem('scrollYPos');
    if (savedYpos) {
      this.scrollCTN.scrollTop = parseInt(savedYpos);
    }
  }
  scrollToTop (type = 'default') {
    if (type === 'smooth') {
      let scrollLoop = (() => {
        return () => {
          if (this.scrollCTN.scrollTop > 1) {
            this.scrollCTN.scrollTop /= 1.2;
            Helpers.raf.call(window, scrollLoop);
          }
        }
      })();
      scrollLoop();
    } else {
      this.scrollCTN.scrollTop = 0;
    }
  }
}