/**
 * Created by gaginho on 06.06.16.
 */
import { h, Component } from 'preact';
import request from 'superagent';
// import actions from '../../actions/ProfileActions';

type PropsType = {
  ammount: number,
  buyType: number,
};

const PAY_QIWI = 1;
const PAY_MOBILE = 2;
const PAY_YANDEX = 3;
const PAY_BANK = 4;

export default class Payment extends Component {
  state = {
    chosen: 0
  };

  componentWillMount() {
    // this.loadData();
    // actions.initialize();
  }

  loadData() {
    request
      .get('/api/teams/')
      .end((err: String, res) => {
        const message: PropsType = res.body;
        console.log('got request', err, message);

        this.setState({ joined: message.joined, team: message.team });
      });
  }

  payform = (value, paymentType) => {
    /*
     label Яндекс.Деньгами
     input(type="radio" name="paymentType" value="PC")
     label Банковской картой
     input(type="radio" name="paymentType" value="AC")
     label С мобильного
     input(type="radio" name="paymentType" value="MC")
     input(type="submit" id="depositLink1" class="btn btn-lg btn-primary" value="Оплатить " + value+ " руб")
     */
    return (
      <form id="form-928" method="POST" action="https://money.yandex.ru/quickpay/confirm.xml" noValidate>
        <div className="form-group">
          <input type="hidden" name="receiver" value="410013860652119" />
          <input type="hidden" name="formcomment" value="Пополнение счёта в online-tournaments.org" />
          <input type="hidden" name="short-dest" value="Пополнение счёта в online-tournaments.org" />
          <input type="hidden" id="userLogin" name="label" value={login} />
          <input type="hidden" name="quickpay-form" value="shop" />
          <input type="hidden" id="targets" name="targets" value={`Пополнение счёта у ${login}`} />
          <input type="hidden" id="sumAttribute" name="sum" value={value} data-type="number" />
          <input type="hidden" name="comment" value="Платёж принят!" />
          <input type="hidden" name="paymentType" value={paymentType} />
          <input type="submit" className="btn btn-lg btn-primary" value={`Оплатить ${value} руб`} />
        </div>
      </form>
    );
  };

  choosePaymentType = (id) => {
    return () => {
      this.setState({
        chosen: id,
      });
    };
  };

  getPaymentImage = (chosen, alt, src, width, height) => {
    return (
      // <div style="background-color: white;">
      <img
        src={src}
        alt={alt}
        onClick={this.choosePaymentType(chosen)}
        // width={width}
        height={height * 1.25}
        className="light-blue-big"
        color="white"
        style={{
          'margin-right': '35px',
          cursor: 'pointer',
          'border-radius': '15px',
          'margin-bottom': '25px',
        }}
      />
      // </div>
    );
  };

  drawChosenPaymentForm = (chosen, ammount) => {

    // const qiwi = '1) QIWI: +79648847260';
    // const mobile = '2) С мобильного';
    // const yandexMoney = '3) Яндекс.Деньги';
    // const bankCard = '4) Банковская карточка';

    const qiwi = 'QIWI: +79648847260';
    const mobile = 'С мобильного';
    const yandexMoney = 'Яндекс.Деньги';
    const bankCard = 'Банковская карточка';

    if (chosen === PAY_QIWI) {
      return (
        <div>
          <h2 className="page">{qiwi}</h2>
          <p className="page"> Укажите ваш логин ({login}) в комментарии к платежу </p>
          <a
            href="https://qiwi.ru"
            target="_blank"
            className="btn btn-lg btn-primary"
          >Оплатить {ammount} руб</a>
        </div>
      );
    }

    if (chosen === PAY_MOBILE) {
      return (
        <div>
          <h2 className="page">{mobile}</h2>
          <p className="page">НЕ УДАЛЯЙТЕ СМС до зачисления средств</p>
          {this.payform(ammount, 'MC')}
        </div>
      );
    }

    if (chosen === PAY_YANDEX) {
      return (
        <div>
          <h2 className="page">{yandexMoney}</h2>
          {this.payform(ammount, 'PC')}
        </div>
      );
    }

    if (chosen === PAY_BANK) {
      return (
        <div>
          <h2 className="page">{bankCard}</h2>
          {this.payform(ammount, 'AC')}
        </div>
      );
    }

    return '';
  };
  // <h2 className="page">Вы собираетесь пополнить счёт на {props.ammount} руб</h2>
  render(props: PropsType, state) {
    const paymentForm = this.drawChosenPaymentForm(state.chosen, props.ammount);
    const width = 50;
    const height = 50;
    // Если у вас возникли какие-то трудности, напишите в
    let choseText = 'Выберите способ оплаты';
    if (state.chosen === PAY_QIWI) {
      choseText = 'QIWI';
    }
    if (state.chosen === PAY_MOBILE) {
      choseText = 'Оплата с мобильного';
    }

    if (state.chosen === PAY_YANDEX) {
      choseText = 'Оплата Яндекс.Деньгами';
    }

    if (state.chosen === PAY_BANK) {
      choseText = 'Оплата банковской картой';
    }
    // {this.getPaymentImage(2, 'Оплата с мобильного', 'http://s1.iconbird.com/ico/2013/9/452/w352h5121380477012phone.png', width, height)}
    // {this.getPaymentImage(3, 'Яндекс.Деньги', 'http://avatars.mds.yandex.net/get-yablogs/28577/EkehfwEF_l/orig', width, height)}
    // {this.getPaymentImage(3, 'Яндекс.Деньги', '/img/yandex.png', width, height)}
    return (
      <div>
        <div style="width: 100%; height: auto;">
          <h1 className="page">Пополнение счёта на {props.ammount} РУБ</h1>
          <i className="fa fa-icon-ya-money" />
          <i className="fa fa-yandex" />
          <h2 className="page" >{choseText}</h2>
          {this.getPaymentImage(1, 'QIWI', 'http://qiwi.by/uploads/files/logo_qiwi_rgb.png', width, height)}
          {this.getPaymentImage(2, 'Оплата с мобильного', '/img/mobile.png', width, height)}
          <div
            style={{
              'background-color': 'white',
              display: 'inline-block',
              width: '245px',
              height: height * 1.25,
              'border-radius': '15px',
              'margin-right': '35px'
            }}
          >
            {this.getPaymentImage(3, 'Яндекс.Деньги', 'http://avatars.mds.yandex.net/get-yablogs/114306/VyZTMD4F_g/orig', width, height)}
          </div>
          {this.getPaymentImage(4, 'Оплата картой', 'http://learnthat.com/files/2010/02/credit-cards1.png', width, height)}

          <div style="height: 150px;">{paymentForm}</div>
        </div>
        <br />
        <div
          className="white text-center"
          style={{
            // position: 'fixed',
            // left: 0,
            // right: 0,
            // bottom: '35px',
            width: '100%',
          }}
        >
          Что-то не так? Пишите в &nbsp;
          <span>
            <a
              href="https://vk.com/topic-111187123_33419618"
              target="_blank"
            >техподдержку</a>
          </span>
        </div>
      </div>
    );
  }
}
