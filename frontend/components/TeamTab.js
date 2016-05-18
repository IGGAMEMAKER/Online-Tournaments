/**
 * Created by gaginho on 18.05.16.
 */
import { h, Component } from 'preact';
const TEAM_JOINED_TRUE = 1;
const TEAM_JOINED_FALSE = 2;
const TEAM_JOINED_ERR = 3;
import request from 'superagent';

type PropsType = {
  joined: Boolean,
  team: Object
};

export default class TeamTab extends Component {
  state = {
    joined: TEAM_JOINED_ERR,
    team: null
  };

  componentWillMount() {
    setInterval(() => {
      request
        .get('/api/teams/')
        .end((err: String, res) => {
          const message: PropsType = res.body;
          console.log('got request', err, message);

          this.setState({ joined: TEAM_JOINED_TRUE, team: message.team });
        });
    }, 2000);
  }

  drawTeam = () => {
    const props: PropsType = this.state;
    console.log('drawTeam', props);
    const players = props.team.players.map((player) => (<p>{player.name}</p>));
    return (
      <div className="white text-center">
        <h1>Команда {props.team.name}</h1>
        <h3>На счету {props.team.money} РУБ</h3>
        <h2>Капитан команды: {props.team.captain}</h2>
        <h2>Состав команды</h2>
        <h4>{players}</h4>
      </div>
    );
  };

  drawCreateTeamForm = () => {
    const button = 'btn btn-primary btn-lg offset-lg';
    return (
      <div>
        <h2 className="white text-center">Название новой команды</h2>
        <center>
          <form action="/Team" method="post">
            <input type="text" className="circle-input clear-focus-border" autoFocus />
            <br />
            <input type="submit" value="Создать команду" className={button} />
          </form>
        </center>
      </div>
    );
  };
  // console.log('Team Tab');

  render() {
    const error = <h3 className="white text-center">Что-то пошло не так(((</h3>;
    let result = '';
    // console.log('render', this.state);
    if (this.state.joined === TEAM_JOINED_TRUE) result = this.drawTeam();
    if (this.state.joined === TEAM_JOINED_FALSE) result = this.drawCreateTeamForm(); // .bind(this);
    if (this.state.joined === TEAM_JOINED_ERR) result = error;
    // console.log(result);
    return (
      <div>
        {result}
      </div>
    );
  }
}
/*
 export default function f(props: PropsType): Component {
 console.log('Team Tab');
 if (props.joined === TEAM_JOINED_TRUE) return drawTeam(props);
 if (props.joined === TEAM_JOINED_FALSE) return drawCreateTeamForm();

 return <h3 className="white text-center">Что-то пошло не так(((</h3>;
 }

 */
/*
export default class TodoList extends Component {
  state = {};

  componentWillMount() {
    store.redraw(() => {
      this.setState({
        markedIDs: store.getMarkedIDs(),
        items: store.getItems(),
      });
    });
  }

  deleteList = () => {
    actions.removeList();
  };

  addItem = () => {
    let text = document.getElementById('textField').value;
    if (!text) return;
    document.getElementById('textField').value = '';
    actions.addItem(text);
  };

  addWannaDelete = (index) => {
    return (event) => {
      let status = document.getElementById('wannaDelete' + index).checked;
      actions.markForDeleting(index, status);
    };
  };

  deleteItem(index) {
    return () => {
      actions.removeItem(index);
    };
  };

  getItemList = () => {
    let items = store.getItems();
    let itemList = <li> No todos, sorry </li>;

    if (items.length) {
      itemList = items.map((item, index) => {
        let id = 'wannaDelete' + index;
        let key = item.key;
        return (
          <li key={key}>
            <input type="checkbox" id={id} name="wannaDelete" onChange={this.addWannaDelete(index)} />
            <TodoItem item={item} />
            <a href="#" onClick={this.deleteItem(index)}> X </a>
          </li>
        );
      });
    }
    return itemList;
  };

  render() {
    let itemList = this.getItemList();

    //let deleteListButton = this.getDeleteListButton();
    let deleteListButton = store.markedItemsExist() ?
      <input type="button" value="Delete all" onClick={this.deleteList} /> :
      '';

    return (
      <div>
        <ul>{itemList}</ul>
        <div>
          <input id="textField" type="text" />
          <input type="submit" value="Add" onClick={this.addItem} />
        </div>
        <div>{deleteListButton}</div>
      </div>
    );
  }
}
*/
