import { h, Component } from 'preact';

type PropsType = {
  onChange: Function,
  settings: Object,
}

export default class TournamentSettingGenerator extends Component {
  render(props: PropsType) {
    return (
      <div>
        <div>
          <label>Tag</label>
          <input type="text" value={props.settings.tag || ''} name="tag" />
        </div>
        
        <br />
        <label>Overall settings</label>
        <br />
        <br />
        <input type="text" value={JSON.stringify(props.settings)} name=""/>
      </div>
    );
  }
}
