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
  pressedMenuFulfill: () => { send('/mark/metrics/MenuDeposit'); },
  pressedMenuCashout: () => { send('/mark/metrics/MenuCashout'); },
  pressedModalTournamentNoMoney: () => { send('/mark/metrics/ModalTournamentNoMoney'); },
  pressedModalPackNoMoney: () => { send('/mark/metrics/ModalPackNoMoney'); },
  pressedCashout: (amount) => { post('/mark/metrics/Cashout', { amount }); },

  goToElite: () => { send('/mark/metrics/go-to-Elite')},
  goToFrees: () => { send('/mark/metrics/go-to-Frees')},
  goToCrowd: () => { send('/mark/metrics/go-to-Crowd')},

  shareLinkCopied: () => { send('/mark/metrics/copy-share-link')}
};
