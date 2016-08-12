import { h, Component } from 'preact';
import Container from '../Containers/Container';
import DarkCard from '../Containers/DarkCard';

type PropsType = {
  date: Date,
  time: number,
  points: number,
  isRegistered: boolean,

  id: number
}

type StateType = {}

export default class PointTournament extends Component {
  state = {};

  render(props: PropsType, state: StateType) {
    const content = (
      <div className="white main-title">
        {props.points} points
        <br />
        <br />
        <div className="sub-title">{props.time}</div>
      </div>
    );
        // <Container
        //   image="http://www.applewallpapers.net/wallpapers/violet_colour-1920x1200.jpg"
        //   faded
        //   centerize
        //   width="330px"
        //   minHeight="280px"
        //   content={content}
        // />
    // font-family: "Source Sans Pro",Calibri,Candara,Arial,sans-serif;
    // <div className="container-mobile">
    const description = (
      <span>
        Выиграй {props.points}XP
        <br />
        <span className="text-micro">Вы участвуете. Турнир начнётся в 21-00</span>
      </span>
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
          {
            props.isRegistered?
              <div
                style="position: absolute; z-index: 5; background-color: #333; opacity: 0.8"
                className="center"
              >
                <span className="text-small">Вы участвуете</span>
              </div>
              :
              <div style="position: absolute; z-index: 5" className="centerize">
                <button className="btn btn-primary btn-lg">Участвовать</button>
              </div>
          }
          <div style="position: absolute; margin-top: 10px;" className="center">
            <div className="text-small">Каждый день в 21-00</div>
          </div>
          <DarkCard
            description={description}
            src={image}
          />
        </div>
      </div>
    );
  }
}
