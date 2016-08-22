import { h, Component } from 'preact';
import constants from '../../constants/constants';

type PropsType = {
  onChange: Function,
  settings: Object,
}

export default class TournamentSettingGenerator extends Component {
  setLeague = (i) => {
    return () => {
      const newField = this.getNewField(this.props.settings, 'tag', 'league');
      const settings = this.getNewField(newField, 'leagueId', i);

      this.props.onChange(settings);
    }
  };

  setSubFreeroll = () => {
    const newField = this.getNewField(this.props.settings, 'tag', 'subs');
    const settings = Object.assign(newField, { image: '/img/CR.jpg'});

    this.props.onChange(settings);
  };

  setRMATags = () => {
    const newField = this.getNewField(this.props.settings, 'tag', 'realmadrid');
    const settings = Object.assign(newField, { round: 5 }, { image: '/img/rounds/Benzema.jpg'});

    this.props.onChange(settings);
  };

  getNewField = (settings, name, value) => {
    const newer = Object.assign({}, settings);

    newer[name] = value;

    if (value === '' || value === null) {
      delete newer[name];
    }

    return newer;
  };

  onInputChange = (name, props) => {
    return (e: KeyboardEvent) => {
      const settings = this.getNewField(props.settings, name, e.target.value);

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
    const regularity = settings.regularity || constants.REGULARITY_NONE;
    const image = settings.image || '';

    const leagueImages = [];

    for (let i=0; i < 7; i++) {
      leagueImages.push(
        <div style={`display: inline-block; margin-right: 15px;`} onClick={this.setLeague(i)}>league{i}</div>
      );
    }


    return (
      <div>

        <div>
          <div>Presetted tournaments</div>
          <br />
          <button onClick={() => { props.onChange({}) }}>clear all</button>
          <br />
          <div style={`display: inline-block; margin-right: 15px;`} onClick={this.setSubFreeroll}>
            <b>Subs Freeroll</b>
          </div>
          <div style={`display: inline-block; margin-right: 15px;`} onClick={this.setRMATags}>
            <b>RMA Shirt Freeroll</b>
          </div>
          {leagueImages}
          <br />
        </div>

        <div>
          <label>Tag</label>
          <input
            type="text"
            value={tag}
            onInput={this.onInputChange('tag', props)}
          />
        </div>

        <div>
          <label>Image</label>
          <input
            type="text"
            value={image}
            onInput={this.onInputChange('image', props)}
          />
        </div>

        <div>
          <label>Regularity</label>
          <select
            name="regularity"
            value={regularity}
            onChange={this.onInputChange('regularity', props)}
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
