import { h, Component } from 'preact';
import BaseCard from './BaseCard';

type PropsType = {
  color: string,
  image: string,
  style: string,
  content: Component,
}

export default class Card extends Component {
  render(props: PropsType) {
    // const className = `card-new ${props.style}`;
    // const style = "width: 280px; display: inline-block;";

    // const className = `col-lg-4 ${props.style}`;
    const className = `col-sm-6 col-md-4 killPaddings ${props.style}`;
    // const className = `${props.style} padding`;
    const style = "min-height: 250px; overflow: hidden";
    // const style = "min-height: 250px; overflow: hidden; width: 320px; display: inline-block; float: left";

    return (
      <BaseCard className={className} style={style} content={props.content} />
    );
  }
}
