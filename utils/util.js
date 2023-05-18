export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 用毫秒表示分钟、小时、天、周、月
const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;
// 传入时间格式或时间戳，这里传入的时间格式: 2022-08-05T08:17:14.000+00:00
export function convertTimeToHumanReadable(dateTime) {

  // 获取当前时间并转换为时间戳，方便计算
  let timestamp_current = new Date().getTime();

  // 将传入的时间格式字符串解析为Date对象
  let _date = new Date(dateTime);

  // 将Date对象转换为时间戳，方便计算
  let timestamp_input = _date.getTime();

  // 计算当前时间与传入的时间之间相差的时间戳
  let timestamp_diff = timestamp_current - timestamp_input;

  // 计算时间差共有多少个分钟
  let minC = timestamp_diff / minute;
  // 计算时间差共有多少个小时
  let hourC = timestamp_diff / hour;
  // 计算时间差共有多少个天
  let dayC = timestamp_diff / day;
  // 计算时间差共有多少个周
  let weekC = timestamp_diff / week;
  // 计算时间差共有多少个月
  let monthC = timestamp_diff / month;

  if (monthC >= 1 && monthC < 4) {
    return parseInt(monthC) + "月前";
  } else if (weekC >= 1 && weekC < 4) {
    return parseInt(weekC) + "周前";
  } else if (dayC >= 1 && dayC < 7) {
    return parseInt(dayC) + "天前";
  } else if (hourC >= 1 && hourC < 24) {
    return parseInt(hourC) + "小时前";
  } else if (minC >= 1 && minC < 60) {
    return parseInt(minC) + "分钟前";
  } else if ((timestamp_diff >= 0) && (timestamp_diff <= minute)) {
    // 时间差大于0并且小于1分钟
    return "刚刚";
  } else {
    return _date.getFullYear() + "年" + _date.getMonth() + "月" + _date.getDate() + "日";
  }
}
