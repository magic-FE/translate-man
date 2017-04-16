/**
 * Setting组件
 * 属性
 * - hl                 host语言
 * - data               列表设置数据
 * - switchSetting      设置回调函数
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from '../Switch/Switch';
import './Setting.css';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import {getUILanguage} from '../../helpers/tools';

class Setting extends Component {

  static defaultProps = {
    hl: '',
    ctrlKey: 'Control',
    data: [],
    setCtrlKey: () => {},
    switchSetting: () => {},
  };

  static propTypes = {
    hl: PropTypes.string,
    ctrlKey: PropTypes.string,
    data: PropTypes.array,
    setCtrlKey: PropTypes.func,
    switchSetting: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      changeCtrlKey: '',
    }
  }

  setCtrlKey(e) {
    this.setState({
      changeCtrlKey: e.key,
    });
    this.props.setCtrlKey(e.key);
  }

  render() {
    return (
        <div className="__Setting">
          {
            this.props.data.map((value, key) => {
              let shouldHide = false;
              if (value.name === 'icibaFanyi' && (this.props.hl !== 'zh-CN' && getUILanguage() !== 'zh-CN')) {
                shouldHide = true;
              }
              if (value.name === 'ctrlTranslate') {
                return (
                  <div key={key}
                      className={classNames('__list', {'hide': shouldHide})}>
                      <span data-tip={value.tip}
                            data-delay-show="100">{value.text}</span><Switch onChange={() => {this.props.switchSetting(key)}} checked={value.checked}/><input className="__ctrl-key" onKeyDown={this.setCtrlKey.bind(this)} value={this.state.changeCtrlKey || this.props.ctrlKey} /></div>
                )
              } else {
                return (
                  <div key={key}
                      data-tip={value.tip}
                      data-delay-show="100"
                      className={classNames('__list', {'hide': shouldHide})}>{value.text} <Switch onChange={() => {this.props.switchSetting(key)}} checked={value.checked}/></div>
                )
              }
            })
          }
          <ReactTooltip html={true} />
        </div>
    )
  }
}

export default Setting;
