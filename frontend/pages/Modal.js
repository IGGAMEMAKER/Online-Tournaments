import { h, render } from 'preact';
import ModalContainer from '../components/Modal/ModalContainer';

const appElement: HTMLElement = document.getElementById('modal-special-tab');

const elements = (
  <center>
    <ModalContainer />
  </center>
);

render(
  elements,
  appElement.parentNode,
  appElement
);
