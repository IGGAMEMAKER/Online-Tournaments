import { h, Component } from 'preact';
import Container from '../Containers/Container';
import DarkCard from '../Containers/DarkCard';
import MainPageTournamentContainer from '../Containers/MainPageTournamentContainer';
import Button from '../Shared/Button';

type PropsType = {
  date: Date,
  time: number,
  points: number,

  isRegistered: boolean,
  onRegister: Function,

  players: number,

  id: number
}

type StateType = {}

export default class PointTournament extends Component {
  state = {};

  render(props: PropsType, state: StateType) {
    const registerStatus = (
      props.isRegistered?
        <div>Вы участвуете</div>
        :
        <Button onClick={props.onRegister} text="Участвовать" />
    );

    const players = (
      props.players?
        <div>
          <i className="fa fa-user">&nbsp;{props.players}</i>
        </div>
        :
        <div><br />Стань первым</div>
    );
    // font-family: "Source Sans Pro",Calibri,Candara,Arial,sans-serif;
    // <div className="container-mobile">
    const description = (
      <div>
        <div className="text-big" style="font-weight: 500">Приз: {props.points}XP</div>
        <span className="text-micro">Турнир начнётся в 21-00</span>
        <br />
        <br />
        {registerStatus}
        <br />
        <div>{players}</div>
      </div>
    );

    let image = 'http://www.newspress.co.il/wp-content/uploads/2016/02/fortune500_hero_cropped1.jpg';
    if (props.points === 100) {
      image = "http://prizvanie.kz/wp-content/uploads/2016/02/71922912_100_thinkstock.jpg";
    }
    if (props.points === 1000) {
      // image = "http://www.jllvantagepoint.com/wp-content/uploads/2015/10/2015-Fortune-500.jpg";
      image = "http://static1.squarespace.com/static/54e04352e4b0ef0a3e3b870b/t/54e3b113e4b0de3fad755f2c/1424208149751/1000-2.jpg?format=2500w";
    }
    if (props.points === 2000) {
      // image = "http://www.jllvantagepoint.com/wp-content/uploads/2015/10/2015-Fortune-500.jpg";
      image = "http://cdn.playbuzz.com/cdn/b813587c-f36c-4845-8989-a5503ebdeb50/73a8b1e6-7601-498e-b52c-fe475ad659e3.jpg";
    }

    const size = 100;
    // return (
    //   <div className="full height-fix offset">
    //     <div className="center">
    //       <div style={`float: left; width: ${size}px; height: ${size}px; background-image: url(${image})`} className="img-responsive"></div>
    //       <div style={`float: left; padding-left: 15px; padding-right: 15px`}>
    //         <div className="text-micro">Каждый день в 21-00</div>
    //         <br />
    //         <button className="btn btn-primary btn-lg">Участвовать</button>
    //       </div>
    //     </div>
    //   </div>
    // );

    return (
      <div className="col-md-4 col-sm-6 col-xs-12 killPaddings">
        <div style="position: relative; border-radius: 6px; cursor: pointer">
          <div style="position: absolute; margin-top: 10px;" className="center">
            <div className="text-small">Каждый день в 21-00</div>
          </div>
          <MainPageTournamentContainer
            description={description}
            src={image}
          />
        </div>
      </div>
    );
  }
}
