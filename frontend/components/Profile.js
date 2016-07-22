import {h, Component} from "preact";
import store from "../stores/ProfileStore";
import actions from "../actions/ProfileActions";
import Card from '../components/Shared/Card';
import AdvancedCard from '../components/Shared/AdvancedCard';
import autoscroller from '../helpers/autoscroll';
import { route } from 'preact-router';

type PropsType = {}

type StateType = {
  deposit: number,
  cashout: number,
  money: number,

  registeredIn: Array,
}

type ResponseType = {}

export default class Profile extends Component {
  state = {
    deposit: 200,
    cashout: 500,

    money: 0,
    registeredIn: []
  };

  componentWillMount() {
    if (!login) {
      setTimeout(() => { route('/Login'); }, 0);
    }

    store.addChangeListener(() => {
      this.setState({
        registeredIn: store.getMyTournamentList(),
        money: store.getMoney()
      });
      // console.log('changes!');
    });

    actions.initialize();
  }

  componentDidUpdate() {
    console.log('update componentDidUpdate');
    setTimeout(() => {
      // console.log('upd');
      // window.scrollTo(0, 0);
      autoscroller.autoscroll();
    });
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
    // console.log(state);
    const registeredIn = state.registeredIn;

    if (!registeredIn.length) {
      return '';
    }

    if (!registeredIn.length) {
      return (
        <div>
          <div className="text-center white">
            <h3>Вы не зарегистрированы ни в одном турнире((</h3>
            <a href="Tournaments" className="btn btn-primary pointer">Начните играть !</a>
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
          <a className="pointer" onclick={() => {actions.unregister(tournamentID)}}>сняться с турнира</a>
        </td>
      </tr>
    ));

    return (
      <div className="center">
        <h2 class="text-center white offset-bg">Мои турниры</h2>
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
      </div>
    );
  };

  render(props: PropsType, state: StateType) {
    const tournaments = this.getTournamentRegs(state);
    const email = '';
    // <h3 class="mg-clear">Профиль</h3>

    // const profileInfo = (
    //   <div class="panel">
    //     <div class="panel-heading"></div>
    //     <div class="panel-body">
    //       <form id="form-928" novalidate="novalidate">
    //         <div class="form-group">
    //           <label>Логин</label>
    //           <h4 class="mg-md">{login}</h4>
    //         </div>
    //         <div class="form-group">
    //           <label>Email</label>
    //           <h4 class="mg-md">{email}</h4>
    //         </div>
    //         <div class="form-group">
    //           <label>Баланс</label>
    //           <h4 id="money1" class="mg-md">{state.money} p</h4>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // );

    const profileInfo = (
      <form novalidate="novalidate">
        <div class="form-group">
          <label>Логин</label>
          <h4 class="mg-md">{login}</h4>
        </div>
        <div class="form-group">
          <label>Баланс</label>
          <h4 id="money1" class="mg-md">{state.money} pуб</h4>
        </div>
      </form>
    );

    /*

     <div class="form-group">
     <label>Email</label>
     <h4 class="mg-md">{email}</h4>
     </div>

     */

    const depositForm = (
      <div className="container-mobile">
        <div className="input-mid inline pull-left">
          <div className="button-input-rur">
            <input
              name="sum"
              // type="number"
              id="deposit"
              value={state.deposit}
              required="required"
              autocomplete="off"
              className="form-control circle-input"
              onInput={this.onDepositInput}
            />
          </div>
        </div>
        <a
           href={`/Payment?ammount=${state.deposit}&buyType=2`}
           className="btn btn-lg btn-primary inline pull-left"
        >Пополнить</a>
      </div>
    );

    //  на {state.deposit} РУБ

    // const deposit = (
    //   <div className="panel">
    //     <div className="panel-heading">
    //       <h3 id="depositMoney" className="mg-clear">Пополнить счет</h3>
    //     </div>
    //     <div className="panel-body">
    //       {depositForm}
    //     </div>
    //   </div>
    // );


    // const deposit: Component = (
    //   <div className="panel">
    //     <div className="panel-heading">
    //       <h3 id="depositMoney" className="mg-clear">Пополнить счет</h3>
    //     </div>
    //     <div className="panel-body">
    //       {depositForm}
    //     </div>
    //   </div>
    // );

    const deposit: Component = (
      <div>
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
        <div className="offset">
          <a
            href={`/Payment?ammount=${state.deposit}&buyType=2`}
            className="btn btn-lg btn-primary"
          >Пополнить</a>
        </div>
      </div>
    );

    /*
     <form id="form-928" method="POST" action="https://money.yandex.ru/quickpay/confirm.xml" novalidate="novalidate">
     <div className="form-group">
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
     {depositForm}
     </div>
     </form>

     */
    const cashoutForm = (
      <div className="container-mobile">
        <div className="input-mid inline pull-left">
          <div className="button-input-rur">
            <input
              name="sum"
              min="500"
              id="cashout"
              value={state.cashout}
              required="required"
              autocomplete="off"
              className="form-control circle-input"
              onInput={this.onCashoutInput}
            />
          </div>
        </div>
        <button
          className="btn btn-lg btn-primary button"
          onClick={() => { console.log('cashout'); }}
        >Вывести</button>
      </div>
    );

    const cashout: Component = (
      <div>
        <div className="button-input-rur">
          <input
            name="sum"
            min="500"
            id="cashout"
            value={state.cashout}
            required="required"
            autocomplete="off"
            className="form-control circle-input"
            onInput={this.onCashoutInput}
          />
        </div>
        <div className="offset">
          <button
            className="btn btn-lg btn-primary button"
            onClick={() => { console.log('cashout'); }}
          >Вывести</button>
        </div>
      </div>
    );
    // const cashout = (
    //   <div>
    //     <div className="panel">
    //       <div className="panel-heading">
    //         <h3 id="depositMoney" className="mg-clear">Вывод средств</h3>
    //       </div>
    //       <div className="panel-body">
    //         <div className="form-group">
    //           <label className="full text-center">Минимальная сумма вывода - 500 рублей</label>
    //           <br />
    //           {cashoutForm}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );

    // <h1 class="text-center white page">Профиль</h1>
    const profileTab = (
      <AdvancedCard
        title="Данные профиля"
        button={profileInfo}
        color="purple"
        type="big"
      />
    );
    return (
      <div>
        <div className="padding killPaddings">{profileTab}</div>
        <div className="padding killPaddings">{tournaments}</div>
        <div className="center">
          <div id="dep" style="height: auto;">
            <AdvancedCard
              title="Пополните счёт"
              info={['и начните играть!']}
              button={deposit}
              color="green"
            />
          </div>
          <div id="cashoutMoney" style="height: auto;">
            <AdvancedCard
              title="Вывод средств"
              info={['минимально - 500 рублей']}
              color="red"
              button={cashout}
            />
          </div>
        </div>
      </div>
    );
  }
}
