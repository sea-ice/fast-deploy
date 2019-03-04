export function formatDate(date) {
  return [
    date.getFullYear(), fixNumber(date.getMonth() + 1),
    fixNumber(date.getDate()), fixNumber(date.getHours()),
    fixNumber(date.getMinutes()), fixNumber(date.getSeconds())
  ].join('_')
}

export function fixNumber(num, fix = 2) {
  return num < 10 ? `0${num}` : '' + num
}