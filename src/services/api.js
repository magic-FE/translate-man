import { googleChina, googleNet } from './hosts'
import { $fetch } from '../utils'

export const fetchGoogleChina = () => $fetch({ url: googleChina, type: 'text' })

export const fetchGoogleNet = () => $fetch({ url: googleNet, type: 'text' })

export const fetchGoogleSearch = option => {
  const url = `https://clients1.google.com/complete/search?q=${option.keyword}&client=translate-web&ds=translate&hl=en`
  return $fetch({ url, type: 'text' })
}

export const fetchGoogleTranslate = option => {
  let url = `${option.host}/translate_a/single?client=t&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&source=btn&rom=1&srcrom=1&ssel=0&tsel=0&kc=0`
  url += `&sl=${option.fromLanguage}&tl=${option.toLanguage}&hl=${option.webLanguage}&tk=${option.tk}&q=${option.keyword}`

  return $fetch({ url, type: 'text' })
}

export const fetchGoogleSound = option => {
  let url = `${option.host}/translate_tts?ie=UTF-8&total=1&idx=0&client=t&prev=input`
  url += `&textlen=${option.keyword.length}&tl=${option.toLanguage}&tk=${option.tk}&q=${option.keyword}&ttsspeed=${option.speed}`

  return $fetch({ url, type: 'arrayBuffer' })
}
