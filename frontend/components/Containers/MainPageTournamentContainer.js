import { h, Component } from 'preact';

type PropsType = {
  name: string,
  description: Component,
  src: string,
  light: boolean
  // color: number
}

export default class MainPageTournamentContainer extends Component {
  render(props: PropsType) {
    let style = {};

    if (props.color > -1) {
      style['background-image'] = `url('/img/cardLayers/${props.color}.jpg')`;
    }

    style['background-image'] = `url(${props.src})`;
    style.height = '280px';

    // style={`background-image: url('/img/cardLayers/${props.color}.jpg')`}
    return (
      <div
        className="darkened-centered-container light-blue responsive"
      >
        <div className="responsive img-demo relative" style={style}>
          <div className="darkened-centered-container-content">
            <div className="total-centering">
              {props.description}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
