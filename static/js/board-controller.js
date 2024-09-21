let currentBoard = 'default-keyboard';

const defaultButtons = [
    { btnIcon: "content_copy", btnEvent: "sendKey", btnValue: "ctrl+c" },
    { btnIcon: "content_paste", btnEvent: "sendKey", btnValue: "ctrl+v" },
    { btnIcon: "article", btnEvent: "notepad", btnValue: "" }
];

const updateKeyboardKeys = () => {

    currentBoard = localStorage.getItem('current-board') ?? 'default-keyboard';
    localStorage.setItem('current-board', currentBoard);

    let buttons = localStorage.getItem(currentBoard) ?? '[]';
    buttons = JSON.parse(buttons);

    if (buttons.length < 1 && (localStorage.getItem('launch-count') ?? 0) < 1) {
        buttons = defaultButtons;
        localStorage.setItem(currentBoard, JSON.stringify(buttons));
    }

    localStorage.setItem('launch-count', 1);
    console.log('composing', currentBoard, buttons);

    let container = document.getElementById('default-keyboard');
    container.innerHTML = '';

    buttons.forEach(item => {
        let button = document.createElement('button');
        button.setAttribute('class', 'kbc-button kbc-button-lg');
        button.setAttribute('data-command', item.btnEvent);
        if (item.btnValue.length > 0) button.setAttribute('data-command', `${item.btnEvent}>${item.btnValue}`);
        button.innerHTML = `<i class="material-symbols-outlined">${item.btnIcon}</i>`;

        container.appendChild(button);
    });
}

const switchFullScreen = (elm) => {

    let icon = elm.querySelector('i');
    const element = document.documentElement;

    if (icon.innerText.includes('_exit')) {
        //Chnage Icon
        icon.innerHTML = 'fullscreen';

        // Exit Screen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        return;
    }

    // Change Icon
    icon.innerHTML = 'fullscreen_exit';

    // Request Full Screen
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

function handleFullscreenChange() {
    if (!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
        //Change Icon
        document.querySelector("div[data-call-func=switchFullScreen] i").innerHTML = 'fullscreen';
    }
}

function toggleSection(target) {
    document.querySelectorAll('main section').forEach(item => {
        item.style.display = (item.id && item.id === target) ? (['add-new-button'].includes(target)) ? 'block' : 'flex' : 'none';
    });
}

function showToast(message) {

    if (!message) return;

    Toastify({
        text: message,
        duration: 3000,
        style: {
            background: "linear-gradient(112.00599690501281deg, rgba(248, 188, 79,1) 4.927083333333334%,rgba(211, 21, 87,1) 97.84374999999999%)",
            borderRadius: '4px'
        },
    }).showToast();
}

document.addEventListener('DOMContentLoaded', () => {

    // Adding Listeners on control button section
    document.body.addEventListener('click', (e) => {

        // #1 Handel function calls
        let value = e.target.getAttribute('data-call-func');
        if (value && value === 'switchFullScreen') return switchFullScreen(e.target);

        value = e.target.getAttribute('data-toggle-section');
        if (value) return toggleSection(value);

        console.log('Clicked');
    });

    //Adding Full Screen Event Listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Handel create new button form
    document.querySelector('#createNewButton').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const inputs = Object.fromEntries(formData);

        if (inputs.btnIcon.length < 1) return showToast('Icon is required!');
        if (inputs.btnEvent.length < 1) return showToast('Choose an event plz!');
        if (['openUrl', 'sendKey'].includes(inputs.btnEvent) && inputs.btnValue.length < 1) return showToast('Oops! key code/name missing');

        // Get current board & put this key
        let buttons = localStorage.getItem(currentBoard) ?? '[]';
        buttons = JSON.parse(buttons);
        buttons.push(inputs);
        localStorage.setItem(currentBoard, JSON.stringify(buttons));

        // Update keyboard
        updateKeyboardKeys();

        // Close add button popup
        toggleSection(currentBoard);
    });

    // Load default keyboard
    updateKeyboardKeys();

});