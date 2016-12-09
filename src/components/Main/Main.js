import React, { Component, PropTypes } from 'react';
import './Main.css';
import {getAbsoluteURL} from '../../helpers/tools';
import voiceImageURL from './voice.png';
import voiceHoverImageURL from './voiceHover.png';
import voicePlayingImageURL from './playingVoice.gif';

class Main extends Component {

  static defaultProps = {
    loading: false,
    loadingText: chrome.i18n.getMessage('translating_text'),
    errorText: chrome.i18n.getMessage('error_text'),
    voicePlaying: false,
    autoVoice: false,
    playVoice: () => {},
    autoVoiceClick: () => {},
  };

  static propTypes = {
    loading: PropTypes.bool,
    loadingText: PropTypes.string,
    data: PropTypes.array,
    voicePlaying: PropTypes.bool,
    autoVoice: PropTypes.bool,
    playVoice: PropTypes.func,
    autoVoiceClick: PropTypes.func,
  };

  onMouseOver(e) {
    e.target.src = getAbsoluteURL(voiceHoverImageURL);
    this.setState({});
  }

  onMouseLeave(e) {
    if(this.props.voicePlaying) return;
    e.target.src = getAbsoluteURL(voiceImageURL);
    this.setState({});
  }

  render() {

    if(this.props.loading) {
      return (<div className="__main">{this.props.loadingText}</div>);
    }

    if(this.props.error) {
      return (<div className="__main" dangerouslySetInnerHTML={{__html: this.props.errorText + this.props.error}}></div>);
    }

    if(!this.props.data) {
      return (<div></div>);
    }

    let phoneticDom,keyword = '',simple = '';

    if(this.props.data[0]) {
      for(let i = 0, len =  this.props.data[0].length; i < len; i++) {
        if(i === len - 1 && i > 0) {
          if(this.props.data[0][i] && this.props.data[0][i][3])
          phoneticDom = (<span className="__phonetic">{'[' + this.props.data[0][i][3] + ']'}</span>);
        } else {
          if(this.props.data[0][i] && this.props.data[0][i][0]) {
            simple += this.props.data[0][i][0];
          }
          if(this.props.data[0][i] && this.props.data[0][i][1]) {
            keyword += this.props.data[0][i][1];
          }
        }
      }
    }

    return (
        <div className="__main">
          <div className="__top">
            <span className="__keyword">{keyword}</span>
          </div>
          <div className="__mid">
            {phoneticDom}
            <img src={this.props.voicePlaying ? getAbsoluteURL(voicePlayingImageURL) : getAbsoluteURL(voiceImageURL)}
                 onMouseOver={this.onMouseOver.bind(this)}
                 onMouseLeave={this.onMouseLeave.bind(this)}
                 alt="voice" 
                 onClick={this.props.playVoice}/>
            <span className="__autoVoice" onClick={this.props.autoVoiceClick}>{this.props.autoVoice ? chrome.i18n.getMessage('auto_voice_on') : chrome.i18n.getMessage('auto_voice') }</span>
          </div>
          <div className="__bot">
            <div className="__simple">{simple}</div>
            {
              this.props.data[1] ? this.props.data[1].map(function(value, key) {
                return (
                  <div className="__li" key={key}>
                    <div className="__prop">{value[0]}</div>
                    <div className="__translation">{value[1].join('; ')}</div>
                  </div>
                )
              }) : []
            }
          </div>
        </div>
    )
  }
}

export default Main;
