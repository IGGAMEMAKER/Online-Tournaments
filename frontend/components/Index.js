import { h, Component } from 'preact';
import store from '../stores/ProfileStore';
import actions from '../actions/ProfileActions';

type PropsType = {}

type StateType = {}

type ResponseType = {}

export default class Index extends Component {
  state = {};

  componentWillMount() {
    // store.addChangeListener(() => {
    //   this.setState({
    //     registeredIn: store.getMyTournaments(),
    //     money: store.getMoney(),
    //     value: store.getTestValue(),
    //     tournaments: store.getAvailableTournaments(),
    //   });
    // });

    actions.initialize();
  }

  render(props: PropsType, state: StateType) {
    const dailyFreeroll = (
      <div className="freeroll ctr green">
        <div className="white">
          <h1 className="fadeText"> Выиграй 50 рублей в бесплатной викторине!</h1>
          <p>
            <div>Время начала - 20:00 (каждый день)</div>
            <div>Присоединяйся!</div>
          </p>
          <center>
            <a
              className="btn btn-primary btn-large btn-lg btn-fixed"
              href="/Tournaments#daily"
            >Участвовать</a>
          </center>
        </div>
      </div>
    );

    const weeklyFreeroll = (
      <div className="freeroll ctr red">
        <div className="white">
          <h1 className="fadeText"> Сорви куш в еженедельной викторине!</h1>
          <p>
            <div>Время начала - 20:00 (воскресенье)</div>
            <div>Призовой фонд турнира - 500 рублей</div>
            <div>Призовых мест: 18</div>
            <div>Присоединяйся!</div>
          </p>
          <center>
            <a
              className="btn btn-primary btn-large btn-lg btn-fixed"
              href="/Tournaments#daily"
            >Участвовать</a>
          </center>
        </div>
      </div>
    );

    const teamTab = (
      <div>
        <div className="freeroll ctr purple">
          <div className="white">
            <h1 className="fadeText">Раздели радость побед с друзьями!</h1>
            <p>
              <div>Создай свою команду</div>
              <div>Побеждай с друзьями в турнирах</div>
              <div>Получи бонус в 300% призовых</div>
            </p>
            <hr width="40%" />
            <p>Если вы (или ваш друг) выиграете в ежедневном бесплатном турнире,</p>
            <p>то вся команда получит вплоть до 150 рублей</p>
            <p>(в зависимости от размера команды)</p>
            <center>
              <a
                className="btn btn-primary btn-large btn-lg btn-fixed"
                href="/Team"
              >Создать команду</a>
            </center>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <div id="Freeroll" className="row">{dailyFreeroll}</div>
        <div className="offset-lg">
          <div id="WeeklyFreeroll" className="row">{weeklyFreeroll}</div>
        </div>
        <div className="offset-lg">
          <div className="row">{teamTab}</div>
        </div>
      </div>
    );
  }
}
