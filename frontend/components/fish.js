// import { h, Component } from 'preact';

// export default class fish extends Component {
//   render() {
//     return (
//       <div> I am fish component</div>
//     );
//   }
// }
import { h, Component } from 'preact';

type PropsType = {
  text: String
};

// export default (props: PropsType): Component => (
//   <button className={`btn-rounded ${props.className}`}>
//     {props.text}
//   </button>
// );
export default function Fish(props: PropsType): Component {
  return (
    <div>
      I am fish component
      {props.text}
    </div>
  );
}
