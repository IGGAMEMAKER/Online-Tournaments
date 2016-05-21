/**
 * Created by gaginho on 20.05.16.
 */
import { h, Component } from 'preact';

export default ():Component => (
  <div>
    <h2 className="white text-center">Название новой команды</h2>
    <center>
      <form action="/Team" method="post">
        <input type="text" name="name" className="circle-input clear-focus-border" autoFocus />
        <br />
        <br />
        <input type="submit" value="Создать команду" className="btn btn-primary btn-lg offset-lg" />
      </form>
    </center>
  </div>
);
