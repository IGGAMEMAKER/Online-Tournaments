import { h, Component } from 'preact';

type Gift = {

}

type PropsType = {
  onSubmit: Function,
  onChange: Function,
  onRemove: Function,

  gift: Gift,
  action: string,
  removable: boolean
}

type StateType = {
  gift: Gift,
}

export default class GiftForm extends Component {
  state = {
    gift: {
      description: '',
      name: '',
      properties: {},
      photoURL: '',
      price: 0
    }
  };

  updateGift = () => {
    const { gift } = this.props;
    // console.log();/
    this.setState({ gift });
  };

  componentWillMount() {
    this.updateGift();
  }

  componentWillReceiveProps() {
    this.updateGift();
  }

  onFormEdit = (name, value) => {
    let { gift } = this.props;
    gift[name] = value;

    this.props.onChange(gift);
  };

  onDescriptionChange = (e: KeyboardEvent) => {
    this.onFormEdit('description', e.target.value);
  };

  onPropertiesChange = (e: KeyboardEvent) => {
    this.onFormEdit('properties', JSON.parse(e.target.value));
  };

  onPriceChange = (e: KeyboardEvent) => {
    this.onFormEdit('price', parseInt(e.target.value));
  };

  onNameChange = (e: KeyboardEvent) => {
    this.onFormEdit('name', e.target.value);
  };

  onPhotoURLChange = (e: KeyboardEvent) => {
    this.onFormEdit('photoURL', e.target.value);
  };

  render(props: PropsType, state: StateType) {
    const {
      description,
      properties,
      photoURL,
      price,
      name,
    } = props.gift;

    // console.warn('gift form', state.gift);

    return (
      <div>
        <label className="white">photoURL</label>
        <br />
        <input type="text" name="photoURL" onInput={this.onPhotoURLChange} value={photoURL} />
        <br />
        <label className="white">name</label>
        <br />
        <input type="text" name="name" onInput={this.onNameChange} value={name} />
        <br />
        <label className="white">description</label>
        <br />
        <input type="text" name="description" onInput={this.onDescriptionChange} value={description} />
        <br />
        <label className="white">price</label>
        <br />
        <input type="number" name="price" onInput={this.onPriceChange} value={price} />
        <br />
        <label className="white">properties</label>
        <br />
        <input type="text" name="properties" onInput={this.onPropertiesChange} value={JSON.stringify(properties)} />
        <br />
        <button className="black" onClick={() => { props.onSubmit(props.gift) }}>{props.action}</button>
        {
          props.removable ?
            <button className="black" onClick={props.onRemove}>remove gift</button>
            :
            ''
        }
      </div>
    );
  }
}
