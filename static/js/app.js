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

function sendKeyboardEvent(e) {

    if(e.inputType == "insertText"){
        if(e.data == ' ') return sendCommand('sendKey>0x20');
        if(e.data == '.') return sendCommand('sendKey>0xBE');
        if(e.data == '@') return sendCommand('sendKey>shift-2');
        if(e.data == '$') return sendCommand('sendKey>shift-4');
        if(e.data == '&') return sendCommand('sendKey>shift-7');
        sendCommand(`sendKey>${e.data}`);
    }

    if( e.inputType == "deleteContentBackward"){
        sendCommand(`sendKey>backspace`);
    }
}

document.addEventListener('click', (e) => {

    if (e.target.tagName !== 'BUTTON') return;

    let command = e.target.getAttribute('data-command');
    if (!command) return;

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


