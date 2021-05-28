/**
 * time parser
 * 
 * 时间显示规则
 * 发布当天：显示时间差
 * 超过当天但未超过7天：显示为x天前
 * 超过7天：显示 月/日
 * 超过一年：显示 年/月/日
 */
function padStart (str) {
  if (Object.prototype.toString.call(str) !== '[object String]') str = str.toString();
  return str.length < 2 ? `0${str}` : str;
}

const timeStrategy = {
  withinDay: function (stampSpacing) {
    if (stampSpacing > 60 * 60 * 1e3 && stampSpacing <= 24 * 60 * 60 * 1e3) {
      return `${parseInt(stampSpacing / 60 / 60 / 1e3)}小时前`;
    } else if (stampSpacing > 60 * 1e3 && stampSpacing <= 60 * 60 * 1e3) {
      return `${parseInt(stampSpacing / 60 / 1e3)}分钟前`; 
    } else if (stampSpacing >= 0 && stampSpacing <= 60 * 1e3) {
      return `${parseInt(stampSpacing / 1e3)}秒前`;
    }
  },
  beyondDay: function () {
    return '1天前';
  },
  withinWeek: function (spacingDay) {
    return `${spacingDay}天前`;
  },
  beyondWeek: function (date) {
    return `${padStart(date.getMonth() + 1)} - ${padStart(date.getDate())}`;
  },
  beyondYear: function (date) {
    return `${date.getFullYear()} - ${padStart(date.getMonth() + 1)} - ${padStart(date.getDate())}`;
  }
}

const parseMiddleware = function () {
  const type = Array.prototype.shift.call(arguments);
  return timeStrategy[type](...arguments);
}

const parseSpacingTime = (function () {
  let hDate;
  let curDate;
  let spacingDay;
  let stampSpacing;
  let unParseTime;
  return function (time) {
    hDate = new Date(time);
    curDate = new Date();
    stampSpacing = curDate.getTime() - hDate.getTime();
    unParseTime = stampSpacing / 24 / 60 / 60 / 1e3;
    spacingDay = unParseTime >= 1 ? parseInt(unParseTime) : 0;
    if (curDate.getFullYear() > hDate.getFullYear()) {
      return parseMiddleware('beyondYear', hDate);
    } else if (spacingDay > 7 && curDate.getFullYear() === hDate.getFullYear()) {
      return parseMiddleware('beyondWeek', hDate);
    } else if (spacingDay >= 1 && spacingDay <= 7) {
      return parseMiddleware('withinWeek', spacingDay);
    } else if (curDate.getDate() !== hDate.getDate() && spacingDay < 1) {
      return parseMiddleware('beyondDay');
    } else if (curDate.getDate() === hDate.getDate()) {
      return parseMiddleware('withinDay', stampSpacing);
    }
  }
})();

export default parseSpacingTime;