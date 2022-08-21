
const showMore = (id) => {
  var moreText = document.getElementsByClassName('more')[id]
  var btnText = document.getElementsByClassName('moreButton')[id]
  if (moreText.style.display != 'inline') {
    moreText.style.display = 'inline'
    btnText.innerHTML = ' - '
    btnText.style.color = 'red'
  } else {
    moreText.style.display = 'none'
    btnText.innerHTML = ' ... '
    btnText.style.color = 'green'
  }
}
var navMargin = document.getElementById('navEl').offsetHeight
var sections = document.getElementsByClassName('section')
var musicSections = document.getElementsByClassName('musicSection')
var home = document.getElementById('pages')
home.style.marginTop = navMargin + 'px'
home.style.height = home.offsetHeight - navMargin + 'px'
document.body.style.height = document.body.offsetHeight - navMargin + 'px'
const pageShow = (id) => {
  ;[...sections].forEach((el) => {
    el.style.display = 'none'
  })
  document.getElementById(id).style.display = 'block'
}
const active = (link) => {
  var links = document.getElementsByClassName('navLink')
  ;[...links].forEach((e) => {
    e.className = 'navLink'
  })
  console.log(links)
  link.className = 'navLink active'
}
const musicPageShow = (id) => {
  [...musicSections].forEach((el) => {
    el.style.display = 'none'
  })
  if (id == 'originals') document.getElementById(id).style.display = 'flex'
  else document.getElementById(id).style.display= 'block'
}
const showSlideshow = (id) => {
  document.getElementById(id).style.display = 'block'
}
const closeSlideshow = (id) => {
  document.getElementById(id).style.display = 'none'
}

/* Carousel script from here. Credits to @w3schools */
let slideIndex = [1, 1, 1]
let slideId = ['mySlides1', 'mySlides2', 'mySlides3']

async function foo() {
  var obj
  const res = await fetch('./data.json')
  obj = await res.json()
  let photoshop = document.getElementById('photoshopSlideshow')
  let illustrator = document.getElementById('illustratorSlideshow')
  let blender = document.getElementById('blenderSlideshow')
  let covers = document.getElementById('covers')
  let originals = document.getElementById('originals')
  let i = 0;
  obj.data.forEach((el) => {
    var div = document.createElement('div')
    if (
      el.extension === 'jpg' ||
      el.extension === 'png' ||
      el.extension === 'svg'
    ) {
      var image = document.createElement('img')
      image.src = 'src/' + el.source + '/' + el.fileName + '.' + el.extension
      if (image.style.height > image.style.width) {
        image.style.height = '100%'
      } else {
        image.style.width = '100%'
      }
      div.appendChild(image)
    }
    if (el.extension === 'mp4') {
      div.innerHTML =
        '<h2>' +
        el.title +
        "</h2><video width='100%' controls><source src='src/" +
        el.source +
        '/' +
        el.fileName +
        '.' +
        el.extension +
        "'</video>"
    }
    if (el.extension === 'mp3') {
      var artwork = el.hasOwnProperty('artwork')
        ? "<img src = 'src/" + el.source + '/'  +el.artwork + "'/>"
        : ''
      div = document.createElement('fieldset')
      div.className = 'audio-player-container'
      div.innerHTML =
        '<legend class = pAudioPlayer>' +
        el.title +
        "</legend><audio style='display:none' data-songnumber='" +
        i +
        "' controls preload='metadata' class='audioPlayerItem' src='src/" +
        el.source +
        '/' +
        el.fileName +
        '.' +
        el.extension +
        "'></audio>" +
        "<button class='play-icon'></button>" +
        "<span class = 'current-time time'> 0:00</span>" +
        "<input type='range' class='seek-slider' max='100' value='0'>" +
        "<span class='duration time'>0:00</span>" +
        "<output class='volume-output'>100%</output>" +
        "<input type='range' class='volume-slider' max='100' value='100'>" +
      "<button class='mute-icon'></button>" +
        artwork
      i++;
    }
    if (el.source == 'photoshopSlides') {
      div.className = 'mySlides1'
      photoshop.appendChild(div)
    }
    if (el.source == 'illustratorSlides') {
      div.className = 'mySlides2'
      illustrator.appendChild(div)
    }
    if (el.source == 'blenderSlides') {
      div.className = 'mySlides3'
      blender.appendChild(div)
    }
    if (el.source == 'musicVideos') {
      covers.appendChild(div)
    }
    if (el.source == 'originalAudio') {
      originals.appendChild(div)
    }
  })
  showSlides(1, 0)
  showSlides(1, 1)
  showSlides(1, 2)
}
function showSlides(n, no) {
  let i
  let x = document.getElementsByClassName(slideId[no])
  if (n > x.length) {
    slideIndex[no] = 1
  }
  if (n < 1) {
    slideIndex[no] = x.length
  }
  for (i = 0; i < x.length; i++) {
    x[i].style.display = 'none'
  }
  x[slideIndex[no] - 1].style.display = 'block'
}
function plusSlides(n, no) {
  showSlides((slideIndex[no] += n), no)
}
foo()
