import { addZero } from "./helperFunction.js";

const body = document.querySelector('body');
const container = document.querySelector('.container');
const timerTemplate = document.querySelector('#timer-template').content;
const themeBtn = document.querySelector('.main__theme-button');

const INITIAL_MINUTES = 25;
const INITIAL_SECONDS = 0;

let timers;
let removeTimerButtons = [];
let dataTimerId;
let counter = 0;

themeBtn.addEventListener('click', () => {
  const timersTime = document.querySelectorAll('.timer__time');
  themeBtn.classList.toggle('main__theme-button--dark-theme');
  body.classList.toggle('body--dark-theme');
  timersTime.forEach(elem => {
    elem.classList.toggle('timer__time--dark-theme');
  });
  removeTimerButtons.forEach(elem => {
    elem.classList.toggle('timer__remove-timer-button--dark-theme');
  });
});

function addTimer() {
  const newTimer = timerTemplate.cloneNode(true);
  const timer = newTimer.querySelector('.timer');
  const time = newTimer.querySelector('.timer__time');

  let currentTimer;
  let minutes = INITIAL_MINUTES;
  let seconds = INITIAL_SECONDS;
  time.textContent = `${addZero(minutes)}:${addZero(seconds)}`;

  const playBtn = newTimer.querySelector('.timer__play-button');
  const addTimerBtn = newTimer.querySelector('.timer__add-timer-button');
  const speakerBtn = newTimer.querySelector('.timer__speaker-button');
  const speaker = new Audio('../assets/sounds/timer-signal.ogg');
  const removeTimerBtn = timer.querySelector('.timer__remove-timer-button');

  const themeBtnDarkTheme = themeBtn.classList.contains('main__theme-button--dark-theme');
  
  if (
    themeBtnDarkTheme &&
    !time.classList.contains('timer__time--dark-theme')
  ) {
    time.classList.add('timer__time--dark-theme');
  }
  
  if (
    themeBtnDarkTheme &&
    !removeTimerBtn.classList.contains('timer__remove-timer-button--dark-theme')
  ) {
    removeTimerBtn.classList.add('timer__remove-timer-button--dark-theme');
  }

  function startTimer() {
    currentTimer = setInterval(() => {
      seconds--;
  
      if (seconds === 0 && minutes === 0) {
        clearInterval(currentTimer);
        speaker.play();
        playBtn.classList.remove('timer__play-button--pause');
        addTimerBtn.classList.add('timer__add-timer-button--stop');
      }
  
      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }
  
      time.textContent = `${addZero(minutes)}:${addZero(seconds)}`;
    }, 1000);
  
    window.removeEventListener('click', startTimer);
  }

  playBtn.addEventListener('click', () => {
    if (
      !playBtn.classList.contains('timer__play-button--pause') &&
      (seconds > 0 || minutes > 0)
    ) {
      startTimer();
      playBtn.classList.add('timer__play-button--pause');
      addTimerBtn.classList.remove('timer__add-timer-button--stop');
    } else {
      clearInterval(currentTimer);
      playBtn.classList.remove('timer__play-button--pause');
      if (seconds > 0 || minutes > 0) {
        addTimerBtn.classList.add('timer__add-timer-button--stop');
      }
    }
  });

  addTimerBtn.addEventListener('click', () => {
    if (addTimerBtn.classList.contains('timer__add-timer-button--stop')) {
      minutes = INITIAL_MINUTES;
      seconds = INITIAL_SECONDS;
      addTimerBtn.classList.remove('timer__add-timer-button--stop');
      time.textContent = `${addZero(minutes)}:${addZero(seconds)}`;
    } else {
      dataTimerId = timer.getAttribute('data-timer-id');
      addTimer();
  
      timers = document.querySelectorAll('.timer');
      removeTimerButtons = document.querySelectorAll('.timer__remove-timer-button');
    
      if (timers.length > 1) {
        removeTimerButtons.forEach(elem => {
          if (!elem.classList.contains('timer__remove-timer-button--visible')) {
            elem.classList.add('timer__remove-timer-button--visible');
          }
        });
      }
    }
  });

  speakerBtn.addEventListener('click', () => {
    if (speakerBtn.classList.contains('timer__speaker-button--muted')) {
      speaker.muted = false;
      speakerBtn.classList.remove('timer__speaker-button--muted');
    } else {
      speaker.muted = true;
      speakerBtn.classList.add('timer__speaker-button--muted');
    }
  });

  removeTimerBtn.addEventListener('click', () => {
    removeTimerBtn.closest('.timer').remove();
    clearInterval(currentTimer);
    timers = document.querySelectorAll('.timer');
    removeTimerButtons = document.querySelectorAll('.timer__remove-timer-button');

    if (timers.length < 2) {
      removeTimerButtons.forEach(elem => {
        elem.classList.remove('timer__remove-timer-button--visible');
      });
    }
  });
  
  timer.setAttribute('data-timer-id', counter++);

  if (!container.contains(document.querySelector('.timer'))) {
    container.appendChild(timer);
  } else {
    document.querySelector('[data-timer-id="'+dataTimerId+'"]').insertAdjacentElement('afterend', timer);
  }

  removeTimerButtons = document.querySelectorAll('.timer__remove-timer-button');
}

addTimer();
