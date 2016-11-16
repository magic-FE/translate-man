/**
 * Relect组件(语言选择器)
 * 属性
 * - autoResult        自动检测语言结果
 * - options           语言数据列表
 * - value             选择的值
 * - onChange          选择后回调函数
 */
import React, {Component, PropTypes} from 'react';
import './relect.css';
import classNames from 'classnames';
import back from './back.png';
import {getAbsoluteURL} from '../../helpers/tools';

class Relect extends Component {

    static defaultProps = {
        autoResult: '',
        options: [],
        onChange: () => {},
    };

    static propTypes = {
        autoResult: PropTypes.string,
        options: PropTypes.array,
        value: PropTypes.any,
        onChange: PropTypes.func,
    };

    componentWillMount() {
        this.state = {
            isSelect: false,
        }
    }

    onClick() {
        this.setState({
            isSelect: true,
        });
    }

    onBack() {
        this.setState({
            isSelect: false,
        });
    }

    onChange(e) {
        if(e.target.dataset.value) {
            this.props.onChange(e.target.dataset.value, e.target.dataset.text);
            this.setState({
                isSelect: false,
            });
        }
    }

    render() {
        let currentText,autoText;
        let {value: currentValue, autoResult} = this.props;

        this.props.options.forEach( (language) => {
            if(language.value === currentValue) {
                currentText = language.text;
            }
            if(language.value === autoResult) {
                autoText = language.text;
            }
        });

        const arr = this.props.options.map((value, key) => {
            return (
                <span key={key} data-text={value.text} data-value={value.value} className={value.value === currentValue ? 'on' : ''}>{value.text}</span>
            )
        });

        arr.splice(6, 0, <div key="line" className="__line"></div>);

        return (
            <span className="__Relect">
                <span className={classNames('__Relect_text', {special: this.state.isSelect})} onClick={this.onClick.bind(this)}>{currentValue === 'auto' ? (autoText ? currentText + '(' + autoText + ')' : currentText): currentText}</span>
                <div className={classNames('__Relect_wrap', {show: this.state.isSelect})}>
                    <div className="__Relect_current">{chrome.i18n.getMessage('current_choice')} {currentText} <img src={getAbsoluteURL(back)} alt="back" onClick={this.onBack.bind(this)}/></div>
                    <div className="__Relect_container" onClick={this.onChange.bind(this)}>
                        {arr}
                    </div>
                </div>
            </span>
        )
    }
}

export default Relect;
