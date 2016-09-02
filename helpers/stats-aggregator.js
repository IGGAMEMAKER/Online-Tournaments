module.exports = (actions, errors) => {
  var search = (tag) => {
    return actions.filter(a => a.type === tag);
  };

  var copiedShareLink = search('copy-share-link').length;

  var registered = search('register').length;
  var registeredSocial = search('register-social').length;
  var registerByInvite = search('register-by-invite').length;

  var selfPayments = search('MenuDeposit').length;
  var forcedPayments = search('forced-payment').length;
  var shownPaymentModals = search('modal-no-money').length;

  return {
    copiedShareLink,
    registered,
    registeredSocial,
    registerByInvite,

    selfPayments,
    shownPaymentModals,
    forcedPayments,

    errors: errors.length
  };
};
