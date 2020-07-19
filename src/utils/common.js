// export function formateDate(time) {
//   console.log(time)
//   if (!time) return ''
//   let date = new Date(time * 1000)
//   console.log(date)
//   return date.getFullYear() + '-' + (date.getMonth() + 1) +
//     '-' + date.getDate() + ' ' + date.getHours() + ':' +
//     date.getMinutes() + ':' + date.getSeconds()
// }
export function formateDate(timestamp) {
  var date = new Date(timestamp * 1000)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return Y + M + D + h + m + s


}