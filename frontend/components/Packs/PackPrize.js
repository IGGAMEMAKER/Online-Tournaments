import { h, Component } from 'preact';

type PropsType = {
  name: string,
  description: string,
  src: string,
  // color: number
}

export default class PackPrize extends Component {
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
        className={`pack-prize-offset color${props.color} light-blue responsive`}
      >
        <div className="responsive img-demo relative" style={style}>
          <div className="pack-prize-description">{props.description}</div>
        </div>
      </div>
    );

    // return (
    //   <div className="pack-cover">
    //     <img
    //       className="pack-card pack-wrapper"
    //       src={props.src}
    //       style={style}
    //       border="0"
    //       alt=""
    //     />
    //     <p className="card-description">{props.description}</p>
    //   </div>
    // );
  }
}
