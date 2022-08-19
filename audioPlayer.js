import lottieWeb from 'https://cdn.skypack.dev/lottie-web'
document
  .querySelector('#originalsLink')
  .addEventListener('click', displayAudio, { once: true })
export function displayAudio() {
  /** Implementation of the presentation of the audio player */
  const playIconContainer = document.getElementsByClassName('play-icon')
  const seekSlider = document.getElementsByClassName('seek-slider')
  const volumeSlider = document.getElementsByClassName('volume-slider')
  const muteIconContainer = document.getElementsByClassName('mute-icon')
  let playState = Array(playIconContainer.length).fill('play')
  let muteState = Array(playIconContainer.length).fill('unmute')
  const addPlayIcon = () => {
    ;[...playIconContainer].forEach((el) => {
      let elNumber = el.closest('fieldset').querySelector('audio').dataset.songnumber
      var playAnimation = lottieWeb.loadAnimation({
        container: el,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        name: 'Play Animation',
      })
      playAnimation.goToAndStop(14, true)
      let elPlayState = playState[elNumber]
      el.addEventListener('click', () => {
        if (elPlayState === 'play') {
          playAnimation.playSegments([14, 27], true)
          elPlayState = 'pause'
          el.closest('fieldset').querySelector('audio').play()
          updateTime(elPlayState, elNumber)
        } else {
          playAnimation.playSegments([0, 14], true)
          elPlayState = 'play'
          el.closest('fieldset').querySelector('audio').pause()
        }
      })
    })
  }
  addPlayIcon()
  const addMuteIcon = () => {
    ;[...muteIconContainer].forEach((el) => {
      var muteAnimation = lottieWeb.loadAnimation({
        container: el,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/mute/mute.json',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        name: 'Mute Animation',
      })
      let elNumber = el.closest('fieldset').querySelector('audio').dataset.songnumber
      let elMuteState = muteState[elNumber]
      el.addEventListener('click', () => {
        if (elMuteState === 'unmute') {
          muteAnimation.playSegments([0, 15], true)
          el.closest('fieldset').querySelector('audio').muted = true
          elMuteState = 'mute'
        } else {
          muteAnimation.playSegments([15, 25], true)
          el.closest('fieldset').querySelector('audio').muted = false
          elMuteState = 'unmute'
        }
      })
    })
  }
  addMuteIcon()

  var updateTime = (element, id) => {
    var previousTime
    var intervalFunction = setInterval(function () {
      var sliderElement = seekSlider[id]
      var audioElement = sliderElement.closest('fieldset').querySelector('audio')
      displayBufferedAmount(audioElement)
      var currentTime = audioElement.currentTime
      var playIconContainer = audioElement.closest('fieldset').querySelector('.play-icon')
      var timeElement = sliderElement
        .closest('fieldset')
        .querySelector('.current-time')
      sliderElement.value = (currentTime / audioElement.duration) * 100
      if (currentTime != previousTime) {
        timeElement.innerHTML = calculateTime(currentTime)
        previousTime = currentTime
      } else {
        if (currentTime == audioElement.duration) {
          playIconContainer.click()
        }
        clearInterval(intervalFunction)
      }
    }, 500)
  }
  const showRangeProgress = (rangeInput, element) => {
    var seekSliderEl = element.closest('fieldset').querySelector('.seek-slider')
    if (rangeInput === seekSliderEl)
      element.style.setProperty(
        '--seek-before-width',
        (rangeInput.value / rangeInput.max) * 100 + '%'
      )
    else
      element.style.setProperty(
        '--volume-before-width',
        (rangeInput.value / rangeInput.max) * 100 + '%'
      )
  }

  const seekSliderEvent = () => {
    ;[...seekSlider].forEach((el) => {
      el.addEventListener('input', (e) => {
        var audioSrc = el.closest('fieldset').querySelector('audio')
        el.closest('fieldset').querySelector('.current-time').innerHTML =
          calculateTime((audioSrc.duration * e.target.value) / 100)
        audioSrc.currentTime = (audioSrc.duration * e.target.value) / 100
        showRangeProgress(e.target, el)
      })
    })
  }
  seekSliderEvent()
  const volumeSliderEvent = () => {
    ;[...volumeSlider].forEach((el) => {
      el.addEventListener('input', (e) => {
        el.closest('fieldset').querySelector('.volume-output').innerHTML =
          Math.round((e.target.value / e.target.max) * 100) + '%'
        el.closest('fieldset').querySelector('audio').volume =
          e.target.value / 100
        showRangeProgress(e.target, el)
      })
    })
  }
  volumeSliderEvent()
  /** Implementation of the functionality of the audio player */

  const audio = document.getElementsByClassName('audioPlayerItem')

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60)
    const seconds = Math.floor(secs % 60)
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    return `${minutes}:${returnedSeconds}`
  }

  const displayDuration = (element) => {
    var durationCont = element.closest('fieldset').querySelector('.duration')
    durationCont.textContent = calculateTime(element.duration)
  }

  const setSliderMax = (element) => {
    console.log(element)
    seekSlider.max = Math.floor(element.duration)
  }

  const displayBufferedAmount = (element) => {
    const bufferedAmount = Math.floor(
      element.buffered.end(element.buffered.length - 1)
    )
    var parent = element.closest('.audio-player-container')
    var seekSliderEl = parent.querySelector('.seek-slider')
    parent.style.setProperty(
      '--buffered-width',
      `${(bufferedAmount / seekSliderEl.max) * 100}%`
    )
  }

  ;[...audio].forEach((el) => {
    if (el.readyState > 0) {
      displayDuration(el)
      setSliderMax(el)
      displayBufferedAmount(el)
    } else {
      el.addEventListener('loadedmetadata', () => {
        displayDuration(el)
        setSliderMax(el)
        displayBufferedAmount(el)
      })
    }
    el.addEventListener('progress', displayBufferedAmount(el))
  })
}
