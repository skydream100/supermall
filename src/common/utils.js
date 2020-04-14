export function debounce(func, delay = 50) {
  // 防抖
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
export function formatDate(date, fmt) {
  // 对Date的扩展，将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  // 例子：
  // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
  // 1.获取年份
  /* 
  y+ -> 1个或者多个y
  y* -> 0个或者多个y
  y? -> 0个或者1个y
  */
  if (/(y+)/.test(fmt)) {
    // RegExp.$1是RegExp的一个属性,指与正则表达式匹配的第一个子匹配(以括号为标志)字符串，
    // 以此类推，RegExp.$2，RegExp.$3，..RegExp.$99共可有99个匹配
    // 几个y表示字符串的长度，这里只有4 substr()截取字符串
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  // 2.定义正则表达式对象
  let o = {
    "M+": date.getMonth() + 1, // 0~11表示月份，所以要 + 1
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  // 3.遍历正则表达式对象
  for (let k in o) {
    // RegExp 构造函数 k: M+ d+ h+ m+ s+ 通过这个字符串去构造这个正则表达式
    if (new RegExp(`(${k})`).test(fmt)) {
      // 先构造成正则表达式，再匹配
      let str = o[k] + ""; // 先将其转换成StringS
      // 月份是0~9的话，前面要补0
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
}
function padLeftZero(str) {
  // 如果str是9，那009，再经过substr()截取，从下标为1开始截取到最后。
  return ("00" + str).substr(str.length);
}
