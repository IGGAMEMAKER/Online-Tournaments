/**
 * Created by gaginho on 18.05.16.
 */
import { h, Component } from 'preact';
const TEAM_JOINED_TRUE = 1;
const TEAM_JOINED_FALSE = 2;
const TEAM_JOINED_ERR = 3;
import request from 'superagent';

import TeamCreateForm from './Team/TeamCreateForm';
import TeamDraw from './Team/TeamDraw';
import TeamShareButton from './Team/TeamShareButton';

type PropsType = {
  joined: Boolean,
  team: Object
};

const stdTeam = {
  name: 'КрутыеКексы',
  players: [
    { name: 'Гага' },
    { name: 'Гага1' },
    { name: 'Гага3' },
  ],
  captain: 'Гага',
  money: 100,
  settings: {},
};

export default class TeamTab extends Component {
  // state = {
  //   joined: TEAM_JOINED_ERR,
  //   team: null,
  //   copied: false
  // };
  state = {
    joined: TEAM_JOINED_TRUE,
    team: stdTeam,
    copied: false
  };

  componentWillMount() {
    this.loadData();
  }

  loadData() {
    request
      .get('/api/teams/')
      .end((err: String, res) => {
        const message: PropsType = res.body;
        console.log('got request', err, message);

        this.setState({ joined: message.joined, team: message.team });
      });
  }

  acceptRequest= (player) => {
    return () => {
      request
        .get(`/api/teams/accept/${player}/${this.state.team.name}`)
        .end((err: String, res) => {
          const message: PropsType = res.body;
          console.log('got request', err, message);

          this.loadData();
        });
      console.log('accept ', player);
    };
  };

  CopyShareLink = () => {
    const id = 'team-link';
    const node = document.getElementById(id);
    node.select();
    document.execCommand('copy');
    node.blur();
    this.setState({ copied: true });
  };

  render() {
    // console.log('team tab render()', this.state.team);
    if (this.state.joined === TEAM_JOINED_TRUE) {
      return (
        <div>
          <TeamDraw update={this.loadData} accept={this.acceptRequest} team={this.state.team} />
          <TeamShareButton
            team={this.state.team}
            onClick={this.CopyShareLink}
            copipasted={this.state.copied}
          />
        </div>
      );
    }

    if (this.state.joined === TEAM_JOINED_FALSE) {
      return <TeamCreateForm />;
    }

    if (this.state.joined === TEAM_JOINED_ERR) {
      return <h3 className="white text-center">Что-то пошло не так(((</h3>;
    }

    return '';
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
