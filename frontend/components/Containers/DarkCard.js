import { h, Component } from 'preact';

type PropsType = {
  name: string,
  description: Component,
  src: string,
  
  // color: number
}

export default class DarkCard extends Component {
  render(props: PropsType) {
    let style = {};

    if (props.color > -1) {
      style['background-image'] = `url('/img/cardLayers/${props.color}.jpg')`;
    }

    style['background-image'] = `url(${props.src})`;
    style.height = '280px';

    return (
      <div
        style={`background-image: url('/img/cardLayers/${props.color}.jpg')`}
        className="pack-prize-offset light-blue responsive"
      >
        <div className="responsive img-demo relative" style={style}>
          <div className="pack-prize-description">{props.description}</div>
        </div>
      </div>
    );
  }
}
