import { h, Component } from 'preact';
import actions from '../../actions/ProfileActions';

type Pack = {

}

type PropsType = {
  onSubmit: Function,
  onChange: Function,
  onRemove: Function,

  pack: Pack,
  action: string,
  removable: boolean
}

type StateType = {
  pack: Pack,
}

export default class PackEditingForm extends Component {
  state = {
    gift: {
      description: '',
      name: '',
      properties: {},
      photoURL: '',
      price: 0
    }
  };

  updatePack = () => {
    const { pack } = this.props;
    this.setState({ pack });
  };

  componentWillMount() {
    this.updatePack();
  }

  componentWillReceiveProps() {
    this.updatePack();
  }

  onFormEdit = (name, value) => {
    let { pack } = this.props;
    pack[name] = value;
    console.log('onFormEdit PackEditingForm. Go to onChange', name, value, pack);
    this.props.onChange(Object.assign({}, pack));
  };

  onImageChange = (e: KeyboardEvent) => {
    this.onFormEdit('image', e.target.value);
  };

  onPriceChange = (e: KeyboardEvent) => {
    this.onFormEdit('price', parseInt(e.target.value));
  };

  onDescriptionChange = (e: KeyboardEvent) => {
    this.onFormEdit('description', e.target.value);
  };

  onPropertiesChange = (e: KeyboardEvent) => {
    this.onFormEdit('properties', JSON.parse(e.target.value));
  };

  onNameChange = (e: KeyboardEvent) => {
    this.onFormEdit('name', e.target.value);
  };


  render(props: PropsType, state: StateType) {
    // console.warn('pack form', state.pack, props.pack);
    // const {
    //   colours,
    //   items,
    //   probabilities,
    //   image,
    //   available,
    //   visible,
    //   price,
    //
    //   packID
    // } = props.pack;

    const item = props.pack;
    const p = props.pack;

    return (
      <div>
        <h2>pack {p.packID}</h2>
        <label>price</label>
        <input
          type="number"
          value={item.price}
          class="black"
          onInput={this.onPriceChange}
        />
        <br />
        <label> image </label>
        <input
          type="text"
          value={item.image}
          class="black"
          onInput={this.onImageChange}
        />
        <br />
        <label> colours </label>
        <input
          type="text"
          value={JSON.stringify(item.colours)}
          class="black"
        />
        <br />
        <label> items </label>
        <input
          type="text"
          value={JSON.stringify(item.items)}
          class="black"
        />
        <br />
        <label> probabilities </label>
        <input
          type="text"
          value={JSON.stringify(item.probabilities)}
          class="black"
        />
        <br />
        <label> available </label>
        <input
          type="text"
          value={JSON.stringify(item.available)}
          class="black"
        />
        <br />
        <label> visible </label>
        <input
          type="text"
          value={JSON.stringify(item.visible)}
          class="black"
        />
        <br />
        <button
          className="black"
          onClick={() => { props.onSubmit(props.pack) }}
        >{props.action}</button>
        {
          props.removable ?
            <button className="black" onClick={props.onRemove}>remove pack</button> : ''
        }
      </div>
    );
  }
}
