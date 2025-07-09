let currentEggType = '';
let totalSeconds = 0;
let remainingSeconds = 0;
let timerInterval = null;
let isRunning = false;
let isMuted = false;

let clickSound = null;
let backgroundMusic = null;
let completeSound = null;

const eggEmojis = {
  soft: '🥚',
  hard: '🥚',
  fried: '🍳',
  scrambled: '🍳'
};

window.addEventListener('load', function() {
  initializeAudio();
});

function minimizeWindow() {
  if (typeof require !== 'undefined') {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('minimize-window');
  }
  playClickSound();
}

function closeWindow() {
  if (typeof require !== 'undefined') {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('close-window');
  } else {
    window.close();
  }
  playClickSound();
}

function initializeAudio() {
  clickSound = document.getElementById('click-sound');
  backgroundMusic = document.getElementById('background-music');
  completeSound = document.getElementById('complete-sound');
  
  if (clickSound) clickSound.volume = 0.1;
  if (backgroundMusic) backgroundMusic.volume = 0.2;
  if (completeSound) completeSound.volume = 0.4;
  

  playBackgroundMusic();
}

function playClickSound() {
  if (!isMuted && clickSound) {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log('Click sound failed to play:', e));
  }
}

function playBackgroundMusic() {
  if (!isMuted && backgroundMusic) {
    backgroundMusic.play().catch(e => console.log('Background music failed to play:', e));
  }
}

function stopBackgroundMusic() {
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
}

function playCompleteSound() {
  if (!isMuted && completeSound) {
    completeSound.currentTime = 0;
    completeSound.play().catch(e => console.log('Complete sound failed to play:', e));
  }
}

function stopCompleteSound() {
  if (completeSound) {
    completeSound.pause();
    completeSound.currentTime = 0;
  }
}

function toggleMute() {
  isMuted = !isMuted;
  const muteBtn = document.getElementById('mute-btn');
  
  if (isMuted) {
    muteBtn.textContent = '🔇';
    muteBtn.classList.add('muted');
    stopBackgroundMusic();
    stopCompleteSound();
  } else {
    muteBtn.textContent = '🔊';
    muteBtn.classList.remove('muted');
    playBackgroundMusic();
  }
  
  playClickSound();
}

function showComplete() {
  hideAllScreens();
  document.getElementById('complete-screen').classList.add('active');
  document.getElementById('complete-egg').textContent = eggEmojis[currentEggType];
  playCompleteSound();
}

function showStart() {
  hideAllScreens();
  document.getElementById('start-screen').classList.add('active');
  stopCompleteSound();
  playClickSound();
}

function showSelection() {
  hideAllScreens();
  document.getElementById('selection-screen').classList.add('active');
  stopCompleteSound();
  resetTimer();
  playClickSound();
}

function showTimer() {
  hideAllScreens();
  document.getElementById('timer-screen').classList.add('active');
  stopCompleteSound();
  playClickSound();
}

function hideAllScreens() {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
}

function selectEgg(type, seconds) {
  currentEggType = type;
  totalSeconds = seconds;
  remainingSeconds = seconds;
  
  const titles = {
    soft: 'Soft Boiled Egg',
    hard: 'Hard Boiled Egg',
    fried: 'Fried Egg',
    scrambled: 'Scrambled Egg'
  };
  
  document.getElementById('egg-type-title').textContent = titles[type];
  updateTimerDisplay();
  showTimer();
}

function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  document.getElementById('timer').textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (!isRunning && remainingSeconds > 0) {
    isRunning = true;
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('pause-btn').style.display = 'inline-block';
    
    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay();
      
      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        showComplete();
      }
    }, 1000);
  }
  playClickSound();
}

function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timerInterval);
    document.getElementById('start-btn').style.display = 'inline-block';
    document.getElementById('pause-btn').style.display = 'none';
  }
  playClickSound();
}

function resetTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  remainingSeconds = totalSeconds;
  updateTimerDisplay();
  document.getElementById('start-btn').style.display = 'inline-block';
  document.getElementById('pause-btn').style.display = 'none';
  playClickSound();
}

document.addEventListener('DOMContentLoaded', function() {
  const eggOptions = document.querySelectorAll('.egg-option');
  eggOptions.forEach(option => {
    option.addEventListener('click', playClickSound);
  });
});