import { h, Component } from 'preact';
import constants from '../../constants/constants';

type PropsType = {
  onChange: Function,
  settings: Object,
}

export default class TournamentSettingGenerator extends Component {
  onRegularityChange = (e: KeyboardEvent) => {

  };

  onInputChange = (name) => {
    return (e: KeyboardEvent) => {
      const props: PropsType = this.props;

      const { settings } = props;
      settings[name] = e.target.value;

      props.onChange(settings);
    }
  };

  render(props: PropsType) {
    const { settings } = props;

    const tag = settings.tag || '';
    return (
      <div>
        <div>
          <label>Tag</label>
          <input
            type="text"
            value={tag}
            onChange={this.onInputChange('tag')}
          />
        </div>

        <div>
          <label>Regularity</label>
          <select
            name="regularity"
            value={settings.regularity || constants.REGULARITY_NONE}
            onChange={this.onRegularityChange}
          >
            <option value="0">none</option>
            <option value="1">regular</option>
            <option value="2">stream</option>
          </select>
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
