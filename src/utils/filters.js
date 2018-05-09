import df from 'dateformat-util'

//  时间戳转年月日时分
export const dateformat = (value, fromatStr = 'yyyy-MM-dd hh:mm') => {
  return df.format(new Date(value), fromatStr)
}


// js时间转化为几天前,几小时前，几分钟前
export const getDateDiff = (value, now) => {
  let nowTime = now ? now : new Date().getTime();
  let result = '';
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let month = day * 30;
  let diffValue = nowTime - value;
  if (diffValue < 0) {
    return '刚刚';
  }
  let monthC = diffValue / month;
  let weekC = diffValue / (7 * day);
  let dayC = diffValue / day;
  let hourC = diffValue / hour;
  let minC = diffValue / minute;
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}
// 为空处理
export const isEmpty = (value, params) => {
  if (value != '') {
    return value
  } else {
    return params ? params : '全部'
  }
}
