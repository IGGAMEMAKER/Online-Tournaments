import { h, Component } from 'preact';
import autoscroller from '../helpers/autoscroll';
import actions from '../actions/ProfileActions';

type PropsType = {}

type StateType = {}

type ResponseType = {}

export default class About extends Component {
  state = {};

  componentWillMount() {
    console.log('update componentWillMount');
    // setInterval(() => {
    //   console.log('upd');
    //   window.scrollTo(0, 0);
    // }, 3000);
    actions.initialize();
    // actions.loadNews();
    // actions.loadChatMessages();
  }

  componentDidUpdate() {
    console.log('update componentDidUpdate');
    setTimeout(() => {
      console.log('upd');
      // window.scrollTo(0, 0);
      autoscroller.autoscroll();
    });
  }

  // componentDidMount() {
  //   console.log('update componentDidMount');
  // }
  // componentWillUnmount() {
  //   console.log('update componentWillUnmount');
  // }
  // componentDidUnmount() {
  //   console.log('update componentDidUnmount');
  // }
  // componentWillReceiveProps() {
  //   console.log('update componentWillReceiveProps');
  // }
  // shouldComponentUpdate() {
  //   console.log('update shouldComponentUpdate');
  // }
  // componentWillUpdate() {
  //   console.log('update componentWillUpdate');
  // }
  // componentDidUpdate() {
  //   console.log('update componentDidUpdate');
  // }

  render() {
    /*
     В будущем, постараемся смягчить или даже отменить это ограничение.
     Это наша цель №1! Просим отнестись к этому с пониманием.
   */
    return (
      <div>
        <div className="white">
          <div className="col-sm-12">
            <h1 className="mg-md text-center">О нас</h1>
            <p className="justify">
              Мы проводим онлайн–турниры, в которых разыгрываем деньги и футбольную атрибутику.
              Ваша цель - ответить на наибольшее количество вопросов. Вы можете играть в любое время.
              Турниры начинаются тогда, когда в них регистрируется необходимое количество игроков.
            </p>
          </div>
          <div className="col-sm-12">
            <h2 className="mg-md text-center">Порядок проведения турниров</h2>
            <p className="justify">
              В самом начале турнира вам даётся 20 секунд на подготовку.
              После этого, вам предлагается ответить на ряд вопросов викторины.
              Число вопросов - от 6 до 20, в зависимости от типа турнира.
              В каждом вопросе 4 варианта ответа, где лишь один из них является верным.
              На ответ даётся 10 секунд и в зависимости от скорости и точности ответа начисляются очки.
              Для победы в турнире необходимо набрать наибольшее количество очков.
              В случае равенства очков (что крайне маловероятно),
              победа присуждается тому, кто первым зарегистрировался в турнире.
            </p>
          </div>
          <div className="col-sm-12">
            <h2 className="mg-md text-center">Как пополнить счёт?</h2>
            <p className="justify">
              Пополнить счёт вы можете в своём&nbsp;
              <a href="Profile#depositMoney">профиле</a>.
            </p>
          </div>
          <div className="col-sm-12">
            <h2 className="mg-md text-center">Как снять деньги?</h2>
            <p className="justify">
              Вывести средства вы можете в своём <a href="Profile#cashoutMoney">профиле</a>.
              Отправьте заявку в техподдержку и мы переведём вам деньги удобным для вас способом в течение одной рабочей недели.
              Минимальная сумма вывода - 500 рублей
            </p>
          </div>
        </div>
      </div>
    );
  }
}
