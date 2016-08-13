import { h, Component } from 'preact';

type PropsType = {}

type StateType = {}

type ResponseType = {}

export default class VKWidget extends Component {
  state = {};

  componentWillMount() {
    // setInterval(() => {
    setTimeout(() => {
      // while (!this.state.vkWidget) {
      //   if (VK) {
      //     const options = {};
      //     options.mode = 2;
      //     options.width = "auto";
      //     options.height = "360";
      //     options.color1 = 'FFFFFF';
      //     options.color2 = '2B587A';
      //     options.color3 = '5B7FA6';
      //
      //     VK.Widgets.Group("vk_groups", options, 111187123);

          // this.setState({
          //   vkWidget: true
          // })
        // }
        // {VK? VK.Widgets.Group("vk_groups", options, 111187123): ''}
      // }
    }, 4000);
  }

  shouldComponentUpdate() {
    return false;
  }

  render(props: PropsType, state: StateType) {
    console.log('RERERERERENDER VKWIDGET');
    // <div id="vk_groups"></div>

    return (
      <div>
      </div>
    );
  }
}
