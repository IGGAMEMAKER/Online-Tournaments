/**
 * Created by gaginho on 29.05.16.
 */
import { h, Component } from 'preact';

type PropsType = {
  price: number,
  text: string,
  color: string,
  image: string,
}

export default class LeaguePayButton extends Component {
  // state = {
  //   joined: false,
  // };

  render() {
    const props: PropsType = this.props;

    let price = `Участвовать за ${props.price} руб`;
    let text = props.text;

    return (
      <div>
        <p>{text}</p>
        <button className="btn btn-primary btn-lg">{price}</button>
      </div>
    );
  }
}
