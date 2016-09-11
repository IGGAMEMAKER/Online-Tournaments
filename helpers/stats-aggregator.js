function fits(obj, d1, d2) {
  return obj.date.getTime() >= d1 && obj.date.getTime() < d2;
}

var logger = require('../helpers/logger');

var DAY = 3600 * 24 * 1000;

var registeredMoreThanN1daysButLessThenN2Days = (N1, N2, visits) => {
  return visits.filter(v => {
    var activeForMS = new Date().getTime() - v.registered.getTime();

    return activeForMS >= N1 * DAY && activeForMS < N2;
  })
};
// date - current date
// by default is today, but you might want to look stats for some different dates
// f.e : what was the retention of new users three months ago. Did we hold them better than now?

var isLoyalUser = (visit, date = new Date()) => {

  return date.getTime() - visit.registered.getTime() > 21 * DAY
};

var isNewUser = (visit, date = new Date()) => {
  // if (isLoyalUser(visit, date)) return false;

  return currentDate.getTime() - visit.registered.getTime() < 7 * DAY
};

var isMiddleUser = (visit, date = new Date()) => {
  if (isNewUser(visit, date)) return false;

  if (isLoyalUser(visit, date)) return false;

  return true;
};

module.exports = (actions, errors, visits, d1, d2) => { // d1 and d2 in milliseconds
  var search = (tag) => {
    // && a.date.getTime() >= d1.getTime() && a.date.getTime() < d2.getTime()
    return actions.filter(a => a.type === tag && fits(a, d1, d2));
  };

  var aggregateVisits = () => {
    return visits;
  };

  var errorCount = errors.filter(e => fits(e, d1, d2)).length;

  var copiedShareLink = search('copy-share-link').length;

  var registered = search('register').length;
  var registeredSocial = search('register-social').length;
  var registerByInvite = search('register-by-invite').length;

  var menuDeposit = search('MenuDeposit').length;
  var forcedPayments = search('forced-payment').length;
  var shownPaymentModals = search('modal-no-money').length;

  // var shownPaymentPage = search('shown-payment-page').length;
  var shownPaymentPage = search('Payment-page-opened').length;

  var pressedPaymentButtonQiwi = search('pressed-payment-qiwi').length;
  var pressedPaymentButtonYandex = search('pressed-payment-yandex').length;
  var pressedPaymentButtonMobiles = search('pressed-payment-mobile').length;
  var pressedPaymentButtonBankCard = search('pressed-payment-bank-card').length;

  var menuCashout = search('MenuCashout').length;
  var cashoutRequests = search('Cashout').length;
  
  var loyalUsers = 0;
  var middleUsers = 0;
  var newUsers = 0;

  var registeredToday = registeredMoreThanN1daysButLessThenN2Days(0, 1, visits).length || 0; // zero days ago
  var registeredYesterday = registeredMoreThanN1daysButLessThenN2Days(1, 2, visits).length || 0; // 1 day ago
  var registeredTwoDaysAgo = registeredMoreThanN1daysButLessThenN2Days(2, 3, visits).length || 0; // 2 day ago
  var registeredThreeDaysAgo = registeredMoreThanN1daysButLessThenN2Days(3, 4, visits).length || 0; // 3 days ago

  var registeredSevenDaysAgo = registeredMoreThanN1daysButLessThenN2Days(6, 8, visits).length || 0;
  var registered14DaysAgo = registeredMoreThanN1daysButLessThenN2Days(8, 15, visits).length || 0;
  var registered21DaysAgo = registeredMoreThanN1daysButLessThenN2Days(15, 22, visits).length || 0;
  var registeredMonthAgo = registeredMoreThanN1daysButLessThenN2Days(22, 31, visits).length || 0;

  logger.debug(visits);
  logger.debug(visits.length);
  var registeredMoreThanMonthAgo = registeredMoreThanN1daysButLessThenN2Days(31, 365, visits).length || 0;

  return {
    copiedShareLink,
    registered,
    registeredSocial,
    registerByInvite,

    // ---------- payments -----------
    menuDeposit,
    shownPaymentModals,
    forcedPayments,

    shownPaymentPage,
    pressedPaymentButtonQiwi,
    pressedPaymentButtonYandex,
    pressedPaymentButtonMobiles,
    pressedPaymentButtonBankCard,
    // -------------------------------

    // ----------- retention ---------
    loyalUsers,
    middleUsers,
    newUsers,

    registeredToday,
    registeredYesterday,
    registeredTwoDaysAgo,
    registeredThreeDaysAgo,
    registeredSevenDaysAgo,
    registered14DaysAgo,
    registered21DaysAgo,
    registeredMonthAgo,
    registeredMoreThanMonthAgo,

    visits,
    // -------------------------------

    menuCashout,
    cashoutRequests,

    errors: errorCount
  };
};
