const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function diff(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function isNearDate(date1: Date, days, todayOffset) {
  const now: Date = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  today.setDate(today.getDate() + todayOffset);
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  tomorrow.setDate(tomorrow.getDate() + days);

  const date = new Date(date1);
  const dateDiff = diff(date, today);
  const result = dateDiff < 1 && dateDiff >= 0; //&& date.toDateString() < tomorrow.toDateString();
  // console.log(today, tomorrow, date, todayOffset === 1 ? 'isTomorrow' : 'isToday', result);
  return result;
}

export function isToday(date: Date) {
  return isNearDate(date, 1, 0);
}

export function isTomorrow(date: Date) {
  return isNearDate(date, 2, 1);
}
