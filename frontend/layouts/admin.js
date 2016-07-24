import { h, Component } from 'preact';

type PropsType = {
  content: ?any,
  chat: Boolean,
  active: string,
}

export default class adminLayout extends Component {
  componentWillMount() {}

  render(props: PropsType) {

    return (
      <div>
        <center>
          <div className="center" style="overflow: hidden; height: auto">
          </div>
          <div className="center" style="overflow: hidden; height: auto">
            {props.content}
          </div>
          <div className="center offset" style="overflow: hidden; height: auto">
          </div>
        </center>
      </div>
    );
  }
}
