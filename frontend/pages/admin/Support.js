import { h, Component } from 'preact';
import request from 'superagent';

type PropsType = {}

type StateType = {
  messages: Array,
  selected: string
}

type ResponseType = {}

export default class Support extends Component {
  state = {
    messages: [],
    selected: 0
  };

  async getMessages () {
    const response = await request.get('/messages/support');


    this.setState({ messages: response.body.msg });
  };

  componentWillMount() {
    this.getMessages();
  }

  render(props: PropsType, state: StateType) {
    const dialogs = {};

    const filterredList: Array = state.messages.filter(m => {
      const username = m.senderName;

      if (username === 'Техподдержка') {
        return false;
      }

      if (!dialogs[username]) {
        dialogs[username] = 1;
        return true;
      }
      return false;
    });

    const list = filterredList.map(m => {
      return (
        <tr className="">
          <td>{m.room}</td>
          <td>{m.senderName}</td>
          <td>{m.text}</td>
          <td><a href={`/admin/support-chat?senderName=${m.senderName}`}>Перейти к диалогу</a></td>
        </tr>
      )
    });
    // table table-striped
    return (
      <div>
        <button
          className="btn btn-primary"
          onClick={() => { this.getMessages() }}
        >Обновить</button>
        <table className="table table-bordered panel">
          <thead>
            <tr>
              <th>room</th>
              <th>user</th>
              <th>text</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {list}
          </tbody>
        </table>
      </div>
    );
  }
}
