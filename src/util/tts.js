export const synth = window.speechSynthesis;

let voice;
let voices = [];

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase();
    const bname = b.name.toUpperCase();
    if (aname < bname) {
      return -1;
    } else if (aname === bname) {
      return 0;
    } else {
      return +1;
    }
  });
  voice = voices.find(v => v.lang.startsWith('zh'));
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

export function getVoice() {
  return voice?.name;
}

export function setVoice(_) {
  voice = voices.find(v => v.name === _);
}

export function getVoices() {
  return voices;
}

export function onSpeak(text) {
  if (synth.speaking) {
    synth.cancel();
    return;
  }

  if (text !== "") {
    const utterThis = new SpeechSynthesisUtterance(text);

    utterThis.onend = function (event) {
      console.log("SpeechSynthesisUtterance.onend");
    };

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };

    if (!voice) {
      voice = voices.find(v => v.lang.startsWith('zh'));
    }
    utterThis.voice = voice;
    utterThis.pitch = 1;
    utterThis.rate = voice.lang.startsWith('zh') ? 1.4 : 1;

    synth.speak(utterThis);
  }
}
