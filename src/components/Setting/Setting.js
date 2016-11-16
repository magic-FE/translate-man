/**
 * Setting组件
 * 属性
 * - hl                 host语言
 * - data               列表设置数据
 * - switchSetting      设置回调函数
 */
import React, { Component, PropTypes } from 'react';
import Switch from '../Switch/Switch';
import './Setting.css';
import Relect from '../Relect/Relect';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import {getUILanguage} from '../../helpers/tools';

class Setting extends Component {

  static defaultProps = {
    hl: '',
    data: [],
    switchSetting: () => {},
  };

  static propTypes = {
    hl: PropTypes.string,
    data: PropTypes.array,
    switchSetting: PropTypes.func,
  };

  render() {
    return (
        <div className="__Setting">
          {
            this.props.data.map((value, key) => {
              let shouldHide = false;
              if(value.name === 'icibaFanyi' && (this.props.hl !== 'zh-CN' && getUILanguage() !== 'zh-CN')) {
                shouldHide = true;
              }
              return (
                <div key={key} 
                     data-tip={value.tip}
                     data-delay-show="100"
                     className={classNames('__list', {'hide': shouldHide})}>{value.text} <Switch onChange={() => {this.props.switchSetting(key)}} checked={value.checked}/></div>
              )
            })
          }
          <ReactTooltip html={true} />
        </div>
    )
  }
}

export default Setting;
