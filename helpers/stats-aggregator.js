function fits(obj, d1, d2) {
  return obj.date.getTime() >= d1 && obj.date.getTime() < d2;
}

module.exports = (actions, errors, d1, d2) => { // d1 and d2 in milliseconds
  var search = (tag) => {
    // && a.date.getTime() >= d1.getTime() && a.date.getTime() < d2.getTime()
    return actions.filter(a => a.type === tag && fits(a, d1, d2));
  };

  var errorCount = errors.filter(e => fits(e, d1, d2)).length;

  var copiedShareLink = search('copy-share-link').length;

  var registered = search('register').length;
  var registeredSocial = search('register-social').length;
  var registerByInvite = search('register-by-invite').length;

  var selfPayments = search('MenuDeposit').length;
  var forcedPayments = search('forced-payment').length;
  var shownPaymentModals = search('modal-no-money').length;

  // var shownPaymentPage = search('shown-payment-page').length;
  var shownPaymentPage = search('Payment-page-opened').length;

  var pressedPaymentButtonQiwi = search('pressed-payment-qiwi').length;
  var pressedPaymentButtonYandex = search('pressed-payment-yandex').length;
  var pressedPaymentButtonMobiles = search('pressed-payment-mobile').length;
  var pressedPaymentButtonBankCard = search('pressed-payment-bank-card').length;

  var cashoutRequests = search('cashout-request').length;

  return {
    copiedShareLink,
    registered,
    registeredSocial,
    registerByInvite,

    // ---------- payments -----------
    selfPayments,
    shownPaymentModals,
    forcedPayments,

    shownPaymentPage,
    pressedPaymentButtonQiwi,
    pressedPaymentButtonYandex,
    pressedPaymentButtonMobiles,
    pressedPaymentButtonBankCard,
    // -------------------------------

    cashoutRequests,

    errors: errorCount
  };
};
