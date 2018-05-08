import df from 'dateformat-util'

//  2位数不足10前面补0
export const addZero = (value) => {
  return value < 10 ? '0' + value : value
}

//  将毫秒转为天时分秒
/*
*params 1、 转为 天时分秒
*params 2、 转为 时分秒
*params 3、 转为 天-时:分:秒
params 转为 时:分:秒
*/
export const formatDuring = (mss, params) => {

  let days = parseInt(mss / (1000 * 60 * 60 * 24));
  let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = (mss % (1000 * 60)) / 1000;
  switch (params * 1) {
    case 1:
      return days + " 天 " + hours + " 小时 " + addZero(minutes) + " 分钟 " + addZero(seconds) + " 秒 ";
      break;
    case 2:
      return hours + " 小时 " + addZero(minutes) + " 分钟 " + addZero(seconds) + " 秒 ";
      break;
    case 3:
      return days + '-' + addZero(hours) + ':' + addZero(minutes) + ':' + addZero(seconds);
      break;
    default:
      return addZero(hours) + ':' + addZero(minutes) + ':' + addZero(seconds);
      break
  }
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

//  时间戳转年月日时分
export const dateformat = (value, fromatStr = 'yyyy-MM-dd hh:mm') => {
  return df.format(new Date(value), fromatStr)
}
