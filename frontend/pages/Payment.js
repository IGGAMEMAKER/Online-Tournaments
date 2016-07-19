import { h, render, Component } from 'preact';
import Payment from '../components/Payments/index';
import Layout from '../layouts/index';
import query from '../helpers/queryParser';

// const appElement: HTMLElement = document.getElementById('app');
// const url = location;
// const captured = /ammount=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
const captured = query.parameter('ammount');
const ammount = captured ? captured : 100;

const elements = (
  <center>
    <Payment ammount={ammount} />
  </center>
);

// render(
//   elements,
//   appElement.parentNode,
//   appElement
// );

export default class PaymentPage extends Component {
  render() {
    return <Layout content={elements} nochat nofooter active="Payment" />;
  }
}