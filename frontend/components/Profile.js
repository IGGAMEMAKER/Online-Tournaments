import { h, Component } from 'preact';
import store from '../stores/ProfileStore';

type PropsType = {}

type StateType = {
  deposit: number,
  cashout: number
}

type ResponseType = {}

export default class Profile extends Component {
  state = {
    deposit: 200,
    cashout: 500
  };

  componentWillMount() {}

  onDepositInput = () => {
    const deposit = document.getElementById("deposit").value;
    this.setState({ deposit });
  };

  onCashoutInput = () => {
    const cashout = document.getElementById("cashout").value;
    this.setState({ cashout });
  };

  render(props: PropsType, state: StateType) {
    return (
      <div>
        <br /><br />
        <h1 class="text-center white page">Профиль</h1>
        <div class="full">
          <h2 class="text-center white">Мои турниры</h2>
          <div class="panel">
            <div class="panel-heading">
              <h3 class="mg-clear">Данные профиля</h3>
            </div>
            <div class="panel-body">
              <form id="form-928" novalidate="novalidate">
                <div class="form-group">
                  <label>Имя</label>
                  <h4 class="mg-md">{login}</h4>
                </div>
                <div class="form-group">
                  <label>Email</label>
                </div>
                <div class="form-group">
                  <label>Баланс</label>
                  <h4 id="money1" class="mg-md">50p</h4>
                </div>
              </form>
            </div>
          </div>
          <div class="panel">
            <div class="panel-heading">
              <h3 id="depositMoney" class="mg-clear">Пополнить счет</h3>
            </div>
            <div class="panel-body">
              <form id="form-928" method="POST" action="https://money.yandex.ru/quickpay/confirm.xml" novalidate="novalidate">
                <div class="form-group">
                  <label>Сумма (в рублях)</label>
                  <input type="hidden" name="receiver" value="410013860652119" />
                  <input type="hidden" name="formcomment" value="Пополнение счёта в online-tournaments.org" />
                  <input type="hidden" name="short-dest" value="Пополнение счёта в online-tournaments.org" />
                  <input type="hidden" id="userLogin" name="label" />
                  <input type="hidden" name="quickpay-form" value="shop" />
                  <input type="hidden" id="targets" name="targets" value="Пополнение счёта у undefined" />
                  <input type="hidden" id="sumAttribute" name="sum" value="4568.25" data-type="number" />
                  <input type="hidden" name="comment" value="Платёж принят!" />
                  <input type="hidden" name="paymentType" value="AC" />
                  <input
                    name="sum"
                    id="deposit"
                    value={state.deposit}
                    required="required"
                    autocomplete="off"
                    className="form-control"
                    onInput={this.onDepositInput}
                  />
                </div>
                <a id="depositLink3"
                   href={`/Payment?ammount=${state.deposit}&buyType=2`}
                   className="btn btn-lg btn-primary"
                >Пополнить счёт на {state.deposit} руб</a>
              </form>
            </div>
          </div>
        </div>
        <div id="cashoutMoney" class="full">
          <div class="panel">
            <div class="panel-heading">
              <h3 id="depositMoney" class="mg-clear">Вывод средств</h3>
            </div>
            <div class="panel-body">
              <div class="ctr">
                <label class="full text-center">Минимальная сумма вывода - 500 рублей</label>
                <br />
                <input
                  name="sum"
                  id="cashout"
                  value={state.cashout}
                  required="required"
                  autocomplete="off"
                  className="form-control"
                  onInput={this.onCashoutInput}
                />
                <button class="btn btn-lg btn-primary button">Вывести средства</button>
              </div>

            </div>
          </div>
          <h2 class="page">Вывод средств</h2>
        </div>
      </div>
    );
  }
}
