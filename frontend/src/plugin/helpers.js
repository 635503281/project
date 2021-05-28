
/**
 * requestAnimationFrame polyfill
 */
export default {
  raf: (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
    })(),
  
  xssFilter (str) {
    return str.replace(/( |<|>)/g, function (matched) {
      switch (matched) {
        case ' ':
          return '&nbsp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
      }
    });
  },

  parseHTML (html) {
    let haveImg = false;
    const parsedHTML = html.replace(/[<][^>]+>|&nbsp;/g, function (matched) {
      if (matched === '&nbsp;') return ' ';
      else if (matched === '<em>' || matched === '</em>') return matched;
      else if (matched.indexOf('<img') > -1) {
        haveImg = true;
        return '';
      } else return '';
    });
    if (!parsedHTML && haveImg) {
      return '[图片]';
    } else {
      return parsedHTML;
    }
  }
}