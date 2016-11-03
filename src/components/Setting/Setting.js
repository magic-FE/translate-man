import React, { Component, PropTypes } from 'react';
import Switch from '../Switch/Switch';
import './Setting.css';
import Relect from '../Relect/Relect';
import ReactTooltip from 'react-tooltip';

class Setting extends Component {

  static defaultProps = {
    data: [],
    switchSetting: () => {},
  };

  static propTypes = {
    data: PropTypes.array,
    switchSetting: PropTypes.func,
  };

  render() {
    return (
        <div className="__Setting">
          {
            this.props.data.map((value, key) => {
              return (
                <div key={key} 
                     data-tip={value.tip}
                     data-delay-show="100"
                     className="__list">{value.text} <Switch onChange={() => {this.props.switchSetting(key)}} checked={value.checked}/></div>
              )
            })
          }
          <ReactTooltip html={true} />
        </div>
    )
  }
}

export default Setting;
