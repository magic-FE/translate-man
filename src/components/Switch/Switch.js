/**
 * Switch 开关组件
 * 属性:
 * - id               组件的id
 * - checked          组件是否打开
 * - onChange         组件回调事件
 */
import React, {Component, PropTypes} from 'react';
import './Switch.css';

class Switch extends Component {
	
	static defaultProps = {
		checked: false,
		onChange: function () {},
	};

	static propTypes = {
		id: PropTypes.string,
		checked: PropTypes.bool,
		onChange: PropTypes.func,
	};

	componentWillMount() {
		this.state = {
			id: `r_${(Math.random() + '').slice(2)}`,
			checked: this.props.checked,
		}
	}

	onChange(event) {
		this.props.onChange(this.state.checked);
	}

	render() {
		return(<div className="__ios-checkbox">
					<div className="__checkbox">
	                    <input type="checkbox" id={this.props.id || this.state.id} className="__raw-checkbox" checked={this.props.checked} onChange={this.onChange.bind(this)}/>
	                    <label htmlFor={this.props.id || this.state.id} className="__emulate-ios-button"></label>
	                </div>
                </div>)
	}
}

export default Switch;