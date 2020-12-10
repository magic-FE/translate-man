import { googleChina, googleNet } from './hosts'
import { $fetch } from '../utils'

export const fetchGoogleChina = () => $fetch({ url: googleChina, type: 'text' })

export const fetchGoogleNet = () => $fetch({ url: googleNet, type: 'text' })

export const fetchGoogleSearch = option => {
  const url = `https://clients1.google.com/complete/search?q=${option.keyword}&client=translate-web&ds=translate&hl=en`
  return $fetch({ url, type: 'text' })
}

const getGoogleTranslateUrl = (option, at) => {
  let url = `${option.host}/translate_a/single?client=${at ? 'at' : 't'}&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&source=btn&rom=1&srcrom=1&ssel=0&tsel=0&kc=0`
  url += `&sl=${option.fromLanguage}&tl=${option.toLanguage}&hl=${option.webLanguage}&tk=${option.tk}&q=${encodeURIComponent(option.keyword)}`
  return url
}

export const fetchGoogleTranslate = option => Promise.race([
  $fetch({ url: getGoogleTranslateUrl(option, true), type: 'text' }),
  $fetch({ url: getGoogleTranslateUrl(option), type: 'text' })
])

const getGoogleSoundUrl = (option, at) => {
  let url = `${option.host}/translate_tts?ie=UTF-8&total=1&idx=0&client=${at ? 'at' : 't'}&prev=input`
  url += `&textlen=${option.keyword.length}&tl=${option.toLanguage}&tk=${option.tk}&q=${encodeURIComponent(option.keyword)}&ttsspeed=${option.speed}`
  return url
}

export const fetchGoogleSound = option => Promise.race([
  $fetch({ url: getGoogleSoundUrl(option, true), type: 'arrayBuffer' }),
  $fetch({ url: getGoogleSoundUrl(option), type: 'arrayBuffer' })
])
