import {h, Component} from "preact";
import store from "../stores/ProfileStore";
import actions from "../actions/ProfileActions";

type PropsType = {}

type StateType = {
  deposit: number,
  cashout: number,

  registeredIn: Array,
}

type ResponseType = {}

export default class Profile extends Component {
  state = {
    deposit: 200,
    cashout: 500,

    registeredIn: []
  };

  componentWillMount() {
    store.addChangeListener(() => {
      this.setState({
        registeredIn: store.getMyTournamentList(),
        money: store.getMoney()
      });
    });
    actions.initialize();
  }

  onDepositInput = () => {
    const deposit = document.getElementById("deposit").value;
    this.setState({ deposit });
  };

  onCashoutInput = () => {
    const cashout = document.getElementById("cashout").value;
    this.setState({ cashout });
  };

  getTournamentRegs = (state: StateType) => {
    console.log(state);
    const registeredIn = state.registeredIn;

    if (!registeredIn.length) {
      return (
        <div>
          <div className="text-center white">
            <h3>Вы не зарегистрированы ни в одном турнире((</h3>
            <a href="Tournaments" >Начните играть !</a>
            <br />
            <br />
          </div>
        </div>
      );
    }

    const tournaments = registeredIn.map(tournamentID => (
      <tr>
        <td>
          <i>{tournamentID}</i>
        </td>
        <td>регистрация</td>
        <td>
          <a href="" onclick={() => {actions.unregister(tournamentID)}}>сняться с турнира</a>
        </td>
      </tr>
    ));

    return (
      <table className="table table-bordered panel">
        <thead>
          <tr>
            <th>№</th>
            <th>Статус</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>{tournaments}</tbody>
      </table>
    );
  };

  render(props: PropsType, state: StateType) {
    // return (
    //   <div>
    //     <h1 className="text-center white page">Профиль</h1>
    //
    //     <div className="full">
    //       <h2 className="text-center white">Мои турниры</h2>
    //       <p>+drawTournamentRegs(msg.tournaments)</p>
    //     </div>
    //
    //     <div className="full pull-left">
    //       <div class="panel">
    //         <div class="panel-heading">
    //           <h3 class="mg-clear">Данные профиля</h3>
    //         </div>
    //         <div class="panel-body">
    //           <form id="form-928" novalidate="novalidate">
    //             <div class="form-group">
    //               <label>Имя</label>
    //               <h4 class="mg-md">{login}</h4>
    //             </div>
    //             <div class="form-group">
    //               <label>Email</label>
    //               <h4 class="mg-md">{email}</h4>
    //             </div>
    //             <div class="form-group">
    //               <label>Баланс</label>
    //               <h4 id="money1" class="mg-md">525p</h4>
    //             </div>
    //           </form>
    //         </div>
    //       </div>
    //     </div>
    //
    //     <div className="full" id="dep">
    //       <div class="panel">
    //         <div class="panel-heading">
    //           <h3 id="depositMoney" class="mg-clear">Пополнить счет</h3>
    //         </div>
    //         <div class="panel-body">
    //           <form id="form-928" method="POST" action="https://money.yandex.ru/quickpay/confirm.xml" novalidate="novalidate">
    //             <div class="form-group">
    //               <label>Сумма (в рублях)</label>
    //               <input type="hidden" name="receiver" value="410013860652119" />
    //               <input type="hidden" name="formcomment" value="Пополнение счёта в online-tournaments.org" />
    //               <input type="hidden" name="short-dest" value="Пополнение счёта в online-tournaments.org" />
    //               <input type="hidden" id="userLogin" name="label" />
    //               <input type="hidden" name="quickpay-form" value="shop" />
    //               <input type="hidden" id="targets" name="targets" value="Пополнение счёта у undefined" />
    //               <input type="hidden" id="sumAttribute" name="sum" value="4568.25" data-type="number" />
    //               <input type="hidden" name="comment" value="Платёж принят!" />
    //               <input type="hidden" name="paymentType" value="AC" />
    //               <input
    //                 name="sum"
    //                 id="deposit"
    //                 value={state.deposit}
    //                 required="required"
    //                 autocomplete="off"
    //                 className="form-control"
    //                 onInput={this.onDepositInput}
    //               />
    //             </div>
    //             <a id="depositLink3"
    //                href={`/Payment?ammount=${state.deposit}&buyType=2`}
    //                className="btn btn-lg btn-primary"
    //             >Пополнить счёт на {state.deposit} руб</a>
    //           </form>
    //         </div>
    //       </div>
    //     </div>
    //
    //     <div className="full" id="cashoutMoney">
    //       <div class="panel-body">
    //         <div class="ctr">
    //           <label class="full text-center">Минимальная сумма вывода - 500 рублей</label>
    //           <br />
    //           <input
    //             name="sum"
    //             id="cashout"
    //             value={state.cashout}
    //             required="required"
    //             autocomplete="off"
    //             className="form-control"
    //             onInput={this.onCashoutInput}
    //           />
    //           <button class="btn btn-lg btn-primary button">Вывести средства</button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );

    const tournaments = this.getTournamentRegs(state);

    const profileInfo = (
      <div class="panel">
        <div class="panel-heading">
          <h3 class="mg-clear">Данные профиля</h3>
        </div>
        <div class="panel-body">
          <form id="form-928" novalidate="novalidate">
            <div class="form-group">
              <label>Логин</label>
              <h4 class="mg-md">{login}</h4>
            </div>
            <div class="form-group">
              <label>Email</label>
              <h4 class="mg-md">{email}</h4>
            </div>
            <div class="form-group">
              <label>Баланс</label>
              <h4 id="money1" class="mg-md">{state.money} p</h4>
            </div>
          </form>
        </div>
      </div>
    );

    //  на {state.deposit} РУБ
    const deposit = (
      <div class="panel">
        <div class="panel-heading">
          <h3 id="depositMoney" class="mg-clear">Пополнить счет</h3>
        </div>
        <div class="panel-body">
          <form id="form-928" method="POST" action="https://money.yandex.ru/quickpay/confirm.xml" novalidate="novalidate">
            <div class="form-group">
              <label>Сумма</label>
              <input type="hidden" name="receiver" value="410013860652119" />
              <input type="hidden" name="formcomment" value="Пополнение счёта в online-tournaments.org" />
              <input type="hidden" name="short-dest" value="Пополнение счёта в online-tournaments.org" />
              <input type="hidden" id="userLogin" name="label" />
              <input type="hidden" name="quickpay-form" value="shop" />
              <input type="hidden" id="targets" name="targets" value="Пополнение счёта у undefined" />
              <input type="hidden" id="sumAttribute" name="sum" value="4568.25" data-type="number" />
              <input type="hidden" name="comment" value="Платёж принят!" />
              <input type="hidden" name="paymentType" value="AC" />
              <div className="button-sm">
                <div className="button-input-rur">
                  <input
                    name="sum"
                    id="deposit"
                    value={state.deposit}
                    required="required"
                    autocomplete="off"
                    className="form-control circle-input"
                    onInput={this.onDepositInput}
                  />
                </div>
              </div>
            </div>
            <a id="depositLink3"
               href={`/Payment?ammount=${state.deposit}&buyType=2`}
               className="btn btn-lg btn-primary"
            >Пополнить</a>
          </form>
        </div>
      </div>
    );

    const cashout = (
      <div>
        <div class="panel">
          <div class="panel-heading">
            <h3 id="depositMoney" class="mg-clear">Вывод средств</h3>
          </div>
          <div class="panel-body">
            <div class="form-group">
              <label class="full text-center">Минимальная сумма вывода - 500 рублей</label>
              <br />
              <div className="button-sm">
                <div className="button-input-rur">
                  <input
                    name="sum"
                    id="cashout"
                    value={state.cashout}
                    required="required"
                    autocomplete="off"
                    className="form-control circle-input"
                    onInput={this.onCashoutInput}
                  />
                </div>
              </div>
            </div>
            <button class="btn btn-lg btn-primary button">Вывести</button>
          </div>
        </div>
        <h2 class="page">Вывод средств</h2>
      </div>
    );
    return (
      <div>
        <h1 class="text-center white page">Профиль</h1>
        <div class="full">
          <h2 class="text-center white">Мои турниры</h2>
          {tournaments}

          {profileInfo}

          <div id="dep">{deposit}</div>
        </div>
        <div id="cashoutMoney" class="full">
          {cashout}
        </div>
      </div>
    );
  }
}
