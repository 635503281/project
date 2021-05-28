/** golbal filter */
import Vue from 'vue';
import parseSpacingTime from './parseTime';

Vue.filter('parseSpacingTime', (time) => {
  return parseSpacingTime(time);
});

Vue.filter('countFilter', (count) => {
  if (count === void 0) return '--';
  else if (count >= 1e3 && count < 1e4) return `${parseInt(count / 1e3)},${parseInt(count.toString().slice(parseInt(count / 1e3).toString().length))}`;
  else if (count >= 1e4) return `${parseInt(count / 1e4)}.${parseInt(count.toString().slice(parseInt(count / 1e4).toString().length))}万`;
  else return count;
});

Vue.filter('parseHTMLToText', (html) => {
  return html.replace(/<[^>]+>|&nbsp;/g, function (matched) {
    if (matched === '&nbsp;') return ' ';
    else return '';
  });
});
