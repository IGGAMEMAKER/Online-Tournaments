import request from 'superagent';

function send(url) {
  request.get(url).end((e, resp) => {
    console.log('send stat', url, e, resp);
  })
}

function post(url, data) {
  request.post(url).send(data);
}

export default {
  pressedMenuFulfill: () => { send('/metrics/MenuDeposit'); },
  pressedMenuCashout: () => { send('/metrics/MenuCashout'); },
  pressedModalTournamentNoMoney: () => { send('/metrics/ModalTournamentNoMoney'); },
  pressedModalPackNoMoney: () => { send('/metrics/ModalPackNoMoney'); },
  pressedCashoutRequest: (amount) => { send(`/metrics/Cashout?amount=${amount}`); },

  shownPaymentPage: () => { send('/metrics/Payment-page-opened'); },

  goToElite: () => { send('/metrics/go-to-Elite')},
  goToFrees: () => { send('/metrics/go-to-Frees')},
  goToCrowd: () => { send('/metrics/go-to-Crowd')},

  shareLinkCopied: () => { send('/metrics/copy-share-link')}
};
