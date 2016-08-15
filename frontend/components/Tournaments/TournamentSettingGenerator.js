import { h, Component } from 'preact';
import constants from '../../constants/constants';

type PropsType = {
  onChange: Function,
  settings: Object,
}

export default class TournamentSettingGenerator extends Component {
  onRegularityChange = (e: KeyboardEvent) => {

  };

  setLeague = (i) => {
    return () => {
      const newField = this.getNewField(this.props.settings, 'tag', 'league');
      const settings = this.getNewField(newField, 'leagueId', i);

      this.props.onChange(settings);
    }
  };

  getNewField = (settings, name, value) => {
    const newer = Object.assign({}, settings);

    newer[name] = value;

    if (value === '' || value === null) {
      delete newer[name];
    }

    return newer;
  };

  onInputChange = (name) => {
    return (e: KeyboardEvent) => {
      const settings = this.getNewField(this.props.settings, name, e.target.value);

      // const props: PropsType = this.props;

      // const { settings } = props;
      // settings[name] = e.target.value;

      // if (e.target.value === '') {
      //   delete settings[name];
      // }

      props.onChange(settings);
    }
  };

  render(props: PropsType) {
    const { settings } = props;

    const tag = settings.tag || '';

    const leagueImages = [];

    for (let i=0; i < 7; i++) {
      leagueImages.push(<div onClick={this.setLeague(i)}>league{i}</div>)
    }

    return (
      <div>
        {leagueImages}
        <div>
          <label>Tag</label>
          <input
            type="text"
            value={tag}
            onInput={this.onInputChange('tag')}
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
        <input type="text" style={`width: 400px`} value={JSON.stringify(props.settings)} name=""/>
      </div>
    );
  }
}
