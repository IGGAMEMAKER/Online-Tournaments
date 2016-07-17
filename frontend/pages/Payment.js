/**
 * Created by gaginho on 04.06.16.
 */
import { h, render } from 'preact';
import Payment from '../components/Payments/index';

const appElement: HTMLElement = document.getElementById('app');
const url = location;
const captured = /ammount=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
const ammount = captured ? captured : 100;

const elements = (
  <center>
    <Payment ammount={ammount} />
  </center>
);

render(
  elements,
  appElement.parentNode,
  appElement
);
