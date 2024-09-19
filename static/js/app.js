function sendCommand(command) {
    fetch('/execute?command=' + command, {
        method: 'GET'
    })
        .then(response => response.text())
        .then(data => {
            console.log('Command executed:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function handleFullscreenChange() {
    document.querySelector('footer').style.display = (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) ? 'none' : 'block';
}

function requestFullScreen() {
    const element = document.documentElement;

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

const specialKeys = {
    " ": "spc",
    "=": "plus",
    "+": "shift+plus",
    ".": "period",
    ">": "shift+period",
    "-": "minus",
    "_": "shift+minus",
    ",": "comma",
    "<": "shift+comma",
    "/": "divide",
    "÷": "divide",
    "×": "multiply",
    ";": "0xBA",
    ":": "shift+0xBA",
    "?": "shift+0xBF",
    "`": "0xC0",
    "~": "shift+0xC0",
    "[": "0xDB",
    "{": "shift+0xDB",
    "]": "0xDD",
    "}": "shift+0xDD",
    "'": "0xDE",
    "\\": "0xDC",
    "|": "shift+0xDC",
    "\"": "shift+0xDE",
    ")": "shift+0",
    "!": "shift+1",
    "@": "shift+2",
    "#": "shift+3",
    "$": "shift+4",
    "%": "shift+5",
    "^": "shift+6",
    "&": "shift+7",
    "*": "shift+8",
    "(": "shift+9"
}

function sendKeyboardEvent(e) {

    let value;

    if (e.inputType == "insertText") {
        value = e.data;
        if (value && value === value.toUpperCase() && /[A-Z]/.test(value)) value = `shift+${value}`;
        if ((specialKeys[value] ?? '').length > 0) value = specialKeys[value];
    }

    if (e.inputType == "deleteContentBackward") value = `backspace`;
    if (e.inputType === 'insertLineBreak') value = `enter`;

    // Send command if value is defined
    if(value) sendCommand(`sendKey>${value}`);
}

function goBackToMainMenu(){
    document.querySelectorAll('section').forEach(item => item.style.display = 'none');
    document.querySelector('main').style.display = 'flex';
}

function switchView(name){
    document.querySelector('main').style.display = 'none';
    document.getElementById(name).style.display = 'flex';
}

function toggleButton(btn, value) {
    let [a, b] = btn.querySelectorAll('svg');
    a.style.display = (a.style.display === 'none') ? 'block' : 'none';
    b.style.display = (b.style.display === 'none') ? 'block' : 'none';

    sendCommand(value);
}

document.addEventListener('click', (e) => {

    if (e.target.classList.value.includes('back-btn')) return goBackToMainMenu();

    if (e.target.tagName !== 'BUTTON') return;

    if (e.target.getAttribute('data-switch-view')) return switchView(e.target.getAttribute('data-switch-view'));
    
    let command = e.target.getAttribute('data-command');
    if (!command) return;

    if (e.target.getAttribute('data-toggle-button')) return toggleButton(e.target, command);

    if (command === 'fullscreen') {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        return requestFullScreen();
    }

    if (command === 'close-footer') {
        document.querySelector('footer').style.display = 'none';
        return;
    }

    if (command === 'open-keyboard') {
        document.getElementById('hiddenKeyBoard').focus();
        return;
    }

    sendCommand(command);
});

/*
* Smart key | tab 
* Now I can send both keys, tab & shift+tab
* It is done to add feature to go back to the previous spot using shift+tab key
*/
let tabKeyPressStart;
function tabKeyStartPress(e) {
    e.preventDefault();
    tabKeyPressStart = new Date().getTime()
}

function tabKeyCancelPress() {
    
    const tabKey = document.getElementById('tabKey');

    if((new Date().getTime() - tabKeyPressStart) < 350) {
        let value = (tabKey.getAttribute('data-direction') === 'forward') ? 'tab' : 'shift+tab';
        return sendCommand(`sendKey>${value}`);
    }

    // Change Tab action to reverse of current direction
    if(tabKey.getAttribute('data-direction') === 'forward'){
        tabKey.setAttribute('data-direction', 'backward');
        tabKey.querySelector('svg').style.transform = 'rotate(180deg)';
        return;
    }

    tabKey.setAttribute('data-direction', 'forward');
    tabKey.querySelector('svg').style.transform = 'rotate(0deg)';
    
}

document.addEventListener('DOMContentLoaded', () => {
    const tabKey = document.getElementById('tabKey');
    if(tabKey){
        tabKey.addEventListener('mousedown', tabKeyStartPress);
        tabKey.addEventListener('mouseup', tabKeyCancelPress);
        tabKey.addEventListener('touchstart', tabKeyStartPress);
        tabKey.addEventListener('touchend', tabKeyCancelPress);
    }
});