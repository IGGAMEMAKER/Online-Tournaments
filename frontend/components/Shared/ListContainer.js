import { h, Component } from 'preact';

type PropsType = {
  list: Array<Component>
}

export default class ListContainer extends Component {
  render(props: PropsType) {
    const { list } = props;
    return (
      <div>
        {list.map(component =>
          (<div>{component}</div>)
        )}
      </div>
    );
  }
}
