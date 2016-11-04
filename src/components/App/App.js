import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import * as actionCreators from '../../actionCreators';
import {POPENV, getAbsoluteURL, getUILanguage} from '../../helpers/tools';
import './App.css';
import Main from '../Main/Main';
import Relect from '../Relect/Relect';
import Setting from '../Setting/Setting';
import logoURL from './logo.png';
import settingURL from './setting.png';
import searchURL from './search.png';
import rightURL from './right.png';
import iconURL from './icon.png';

class App extends Component {

  static defaultProps = {};

  static propTypes = {
    type: PropTypes.string,
  };

  componentDidMount() {
    if(POPENV) {
      this.refs.searchInput.focus();
      const {searchWordDispatch} = this.props;
      document.addEventListener('keydown', (event) => {
        if(event.which === 13) { //enter key down
          searchWordDispatch();
        }
      }, false);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(!POPENV && this.props.position) {
      // change wrap layout
      const containerWrap = document.querySelector('#__fanyixia_content');
      /**
       * 很关键,如果元素是display:none的, getComputedStyle得到的值是auto
       * 需要先显示元素,才能得到正确的值
       */
      containerWrap.style.display = 'block';

      const containerWrapHeight = parseInt(window.getComputedStyle(containerWrap).height);
      const containerWrapWidth = parseInt(window.getComputedStyle(containerWrap).width);
      let {pageX, pageY} = this.props.position;

      if (pageX > (document.body.scrollWidth - containerWrapWidth - 50)) {
          containerWrap.style.left = (pageX - containerWrapWidth - 5) + 'px';
      } else {
          containerWrap.style.left = (pageX + 5) + 'px';
      }

      if (pageY > (document.body.scrollHeight - containerWrapHeight - 50)) {
          containerWrap.style.top = (pageY - containerWrapHeight - 15) + 'px';
      } else {
          containerWrap.style.top = (pageY + 15) + 'px';
      }
    }
  }

  render() {

    const {
      error,
      loading,
      word,
      showSetting,
      SLanguage,
      SLanguageAuto,
      TLanguage,
      HLanguage,
      translateResult,
      voicePlaying,
      relectData,
      setting,
      iconModelFlag,
      bindDataDispatch,
      clickSettingDispatch,
      searchWordDispatch,
      playVoiceDispatch,
      switchSettingDispatch
    } = this.props;
    
    if(!POPENV) {
      if(iconModelFlag) {
        return (
          <div className="__icon" onClick={() => {searchWordDispatch()}}><img src={getAbsoluteURL(iconURL)} alt="icon" /></div>
        );
      }
      return (
        <Main {...{data: translateResult, voicePlaying, playVoice: playVoiceDispatch}}></Main>
      );
    }

    return (
      <div className="__container">
          <div className="__header">
              <img src={getAbsoluteURL(logoURL)} alt="logo" className="__logo" onClick={this.onClickFetch}/>
              <img src={getAbsoluteURL(settingURL)} alt="setting" className="__setting_btn" onClick={clickSettingDispatch}/>
          </div>
          <div className="__language">
            <Relect {...relectData} value={SLanguage} autoResult={SLanguageAuto} onChange={(value) => {bindDataDispatch({SLanguage: value})}} />
            <img src={getAbsoluteURL(rightURL)} alt="right" /> 
            <Relect {...relectData} value={TLanguage} autoResult={getUILanguage()} onChange={(value) => {bindDataDispatch({TLanguage: value})}} />
          </div>
          <div className="__search __clearfix">
              <input type="text" ref="searchInput" placeholder={' ' + chrome.i18n.getMessage('search_placeholder')} value={word} onChange={(e) => {bindDataDispatch({word: e.target.value})}}/>
              <div className="__search_btn" onClick={() => {searchWordDispatch()}}><img src={getAbsoluteURL(searchURL)} alt="search" /></div>
          </div>
          <Main {...{data: translateResult, voicePlaying, playVoice: playVoiceDispatch, loading: loading, error: error}}></Main>
          <div className={classNames({"__setting_hidden": !showSetting})}>
            <div className="__main_language">
              {chrome.i18n.getMessage('my_main_language')}<Relect {...relectData} value={HLanguage} autoResult={getUILanguage()} onChange={(value) => {bindDataDispatch({HLanguage: value})}} />
            </div>
            <Setting {...setting} switchSetting={switchSettingDispatch} hl={HLanguage}></Setting>
          </div>
      </div>
    )
  }
}

App = connect((state) => {
  return {
    error: state.error,
    loading: state.loading,
    word: state.word,
    showSetting: state.showSetting,
    SLanguage: state.SLanguage,
    SLanguageAuto: state.SLanguageAuto,
    TLanguage: state.TLanguage,
    HLanguage: state.HLanguage,
    translateResult: state.translateResult,
    voicePlaying: state.voicePlaying,
    iconModelFlag: state.iconModelFlag,
    relectData: state.relectData,
    setting: state.setting,
    position: state.position,
  }
}, (dispatch) => {
  return {
    'clickSettingDispatch': actionCreators.clickSettingAC(dispatch),
    'bindDataDispatch': actionCreators.bindDataAC(dispatch),
    'searchWordDispatch': actionCreators.searchWordAC(dispatch),
    'playVoiceDispatch': actionCreators.playVoiceAC(dispatch),
    'switchSettingDispatch': actionCreators.switchSettingAC(dispatch),
  }
})(App);

export default App;
