import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import * as actionCreators from '../../actionCreators';
import {POPENV, getAbsoluteURL, getUILanguage} from '../../helpers/tools';
import './App.css';
import Main from '../Main/Main';
import Relect from '../Relect/Relect';
import Setting from '../Setting/Setting';
import logoURL from './logo.svg';
import settingURL from './setting.svg';
import searchURL from './search.svg';
import exchnageRUL from './exchange.svg';
import iconURL from './icon.svg';
import githubURL from './github.svg';

class App extends Component {

  static defaultProps = {};

  static propTypes = {
    type: PropTypes.string,
  };

  componentDidMount() {
    if(POPENV) {
      this.refs.searchInput.focus();
      const {searchWordDispatch} = this.props;
      let locked = false;
      document.addEventListener('keydown', (event) => {
        if(event.which === 13) { //enter key down
          if(~location.href.indexOf('moz')) {
            // 火狐插件如果快速连续搜索同一个词语,会让程序锁死
            // issue https://github.com/facebook/react/issues/6324
            // 解决方案,锁定时间
            if(!locked) {
              searchWordDispatch(this.refs.searchInput.value);
              setTimeout(() => {
                locked = false;
              }, 1000);
              locked = true;
            }
          } else {
              searchWordDispatch(this.refs.searchInput.value);
          }
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

  handleGithub() {
    browser.tabs.create({url: 'https://github.com/magic-FE/translate-man'});
  }

  render() {

    const {
      error,
      loading,
      word,
      firstIciba,
      mainLanguage,
      autoVoice,
      showSetting,
      SLanguage,
      SLanguageAuto,
      TLanguage,
      HLanguage,
      translateResult,
      voicePlaying,
      relectData,
      ctrlKey,
      setting,
      iconModelFlag,
      bindDataDispatch,
      clickSettingDispatch,
      searchWordDispatch,
      playVoiceDispatch,
      switchSettingDispatch,
      setCtrlKeyDispatch,
      exchangeLanguageDispatch,
    } = this.props;
    if(!POPENV) {
      if (iconModelFlag) {
        return (
          <div className="__icon" onClick={() => {searchWordDispatch(word, undefined, firstIciba, mainLanguage, autoVoice)}} title={browser.i18n.getMessage('icon_hover_tips')}><img src={getAbsoluteURL(iconURL)} alt="icon" width="16" height="16"/></div>
        );
      }

      // issue https://github.com/magic-FE/translate-man/issues/6
      if (SLanguageAuto === HLanguage) {
        return <div />;
      }

      return (
        <Main {...{data: translateResult, voicePlaying, playVoice: playVoiceDispatch}}></Main>
      );
    }

    return (
      <Scrollbars autoHide autoHeight autoHeightMax={600}>
        <div className="__container">
            <div className="__header">
                <img src={getAbsoluteURL(logoURL)} alt="logo" className="__logo" width="50" height="50" onClick={this.onClickFetch}/>
                <img src={getAbsoluteURL(settingURL)} alt="setting" width="20" height="20" className="__setting_btn" onClick={clickSettingDispatch}/>
            </div>
            <div className="__language">
              <Relect {...relectData} value={SLanguage} autoResult={SLanguageAuto} onChange={(value) => { bindDataDispatch({ SLanguage: value }); searchWordDispatch(this.refs.searchInput.value) }} />
              <img style={{ margin: '0 10px', cursor: 'pointer' }} src={getAbsoluteURL(exchnageRUL)} onClick={() => { exchangeLanguageDispatch(); searchWordDispatch(this.refs.searchInput.value) }} alt="exchange" width="16" height="16"/>
              <Relect {...relectData} value={TLanguage} autoResult={getUILanguage()} onChange={(value) => { bindDataDispatch({ TLanguage: value }); searchWordDispatch(this.refs.searchInput.value) }} />
            </div>
            <div className="__search __clearfix">
                <input type="text" ref="searchInput" placeholder={' ' + browser.i18n.getMessage('search_placeholder')} />
                <div className="__search_btn" onClick={() => {searchWordDispatch(this.refs.searchInput.value)}}><img src={getAbsoluteURL(searchURL)} alt="search" width="24" height="24"/></div>
            </div>
            <Main {...{data: translateResult, voicePlaying, playVoice: playVoiceDispatch, loading: loading, error: error}}></Main>
            <div className={classNames({"__setting_hidden": !showSetting})}>
              <div className="__main_language">
                {browser.i18n.getMessage('my_main_language')}<Relect {...relectData} value={HLanguage} autoResult={getUILanguage()} onChange={(value) => {bindDataDispatch({HLanguage: value})}} />
              </div>
              <Setting {...setting} switchSetting={switchSettingDispatch} hl={HLanguage} ctrlKey={ctrlKey} setCtrlKey={setCtrlKeyDispatch}></Setting>
              <div className="__footer">
                <a className="__github" title="star me on github" onClick={this.handleGithub}><img src={getAbsoluteURL(githubURL)} alt="github" width="16" height="16" /></a>
              </div>
            </div>
        </div>
      </Scrollbars>
    )
  }
}

App = connect((state) => {
  return {
    error: state.error,
    loading: state.loading,
    word: state.word,
    firstIciba: state.firstIciba,
    mainLanguage: state.mainLanguage,
    autoVoice: state.autoVoice,
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
    ctrlKey: state.ctrlKey,
  }
}, (dispatch) => {
  return {
    'clickSettingDispatch': actionCreators.clickSettingAC(dispatch),
    'bindDataDispatch': actionCreators.bindDataAC(dispatch),
    'searchWordDispatch': actionCreators.searchWordAC(dispatch),
    'playVoiceDispatch': actionCreators.playVoiceAC(dispatch),
    'switchSettingDispatch': actionCreators.switchSettingAC(dispatch),
    'setCtrlKeyDispatch': actionCreators.setCtrlKeyAC(dispatch),
    'exchangeLanguageDispatch': actionCreators.exchangeLanguageAC(dispatch),
  }
})(App);

export default App;
