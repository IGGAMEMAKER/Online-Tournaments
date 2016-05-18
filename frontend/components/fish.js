import { h, Component } from 'preact';

type PropsType = {
  text: String
};

export default function (props: PropsType): Component {
  return (
    <div>
      I am fish component
      {props.text}
    </div>
  );
}
