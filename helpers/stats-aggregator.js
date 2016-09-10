function fits(obj, d1, d2) {
  return obj.date.getTime() >= d1 && obj.date.getTime() < d2;
}

var DAY = 3600 * 24 * 1000;

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
    // -------------------------------

    menuCashout,
    cashoutRequests,

    errors: errorCount
  };
};
