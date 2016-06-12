import { h, render } from 'preact';
import Modal from '../components/Modal/Modal';

const appElement: HTMLElement = document.getElementById('modal-special-tab');

const elements = (
  <center>
    <Modal />
  </center>
);

render(
  elements,
  appElement.parentNode,
  appElement
);
