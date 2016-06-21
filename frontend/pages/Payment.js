/**
 * Created by gaginho on 04.06.16.
 */
import { h, render } from 'preact';
import Payment from '../components/Payments/index';

const appElement: HTMLElement = document.getElementById('app');

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
