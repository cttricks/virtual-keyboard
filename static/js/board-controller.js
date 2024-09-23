let currentBoard = 'default-keyboard';
let newButtonForm;

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

    let count = 1;
    buttons.forEach(item => {
        let button = document.createElement('button');
        button.id = `btn${count}`;
        button.setAttribute('class', 'kbc-button kbc-button-lg');
        button.setAttribute('data-command', item.btnEvent);
        button.setAttribute('data-json', encodeURIComponent(JSON.stringify(item)));
        button.innerHTML = `<i class="material-symbols-outlined">${item.btnIcon}</i>`;
        if (item.btnValue.length > 0) button.setAttribute('data-command', `${item.btnEvent}>${item.btnValue}`);

        container.appendChild(button);
        count++;
    });
}

const switchKeysEditorMode = (elm) => {
    let icon = elm.querySelector('i');

    if (icon.innerText.includes('_open')) {
        icon.innerHTML = 'lock';
        icon.style.color = '#706ca1';

        document.querySelectorAll(`section#${currentBoard} button`).forEach(button => {
            button.removeAttribute('draggable', 'true');
            button.removeAttribute('ondragstart', 'dragStart(event)');
            button.removeAttribute('ondragend', 'dragEnd(event)');
            button.removeAttribute('ontouchstart', 'touchStart(event)');
            button.removeAttribute('ontouchmove', 'touchMove(event)');
            button.removeAttribute('ontouchend', 'touchEnd(event)');
        });

        return;
    }

    icon.innerHTML = 'lock_open';
    icon.style.color = '#FF9800';

    document.querySelectorAll(`section#${currentBoard} button`).forEach(button => {
        button.setAttribute('draggable', 'true');
        button.setAttribute('ondragstart', 'dragStart(event)');
        button.setAttribute('ondragend', 'dragEnd(event)');
        button.setAttribute('ontouchstart', 'touchStart(event)');
        button.setAttribute('ontouchmove', 'touchMove(event)');
        button.setAttribute('ontouchend', 'touchEnd(event)');
    })
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
        document.querySelector("div[data-call-func=switchFullScreen] i").innerHTML = 'fullscreen';
    }
}

function toggleSection(target) {
    document.querySelectorAll('main section').forEach(item => {
        item.style.display = (item.id && item.id === target) ? (['add-new-button'].includes(target)) ? 'block' : 'flex' : 'none';
    });
}

function showInputError(message, target) {

    target = document.querySelector(`input[name=${target}], select[name=${target}]`);
    if (!message || !target) return;
    
    let label = document.createElement('label');
    label.innerText = message;

    newButtonForm.insertBefore(label, target);

    setTimeout(() => {
        label.remove();
    }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {

    // Adding Listeners on control button section
    document.body.addEventListener('click', (e) => {

        // #1 Handel function calls
        let value = e.target.getAttribute('data-call-func');
        if (value && value === 'switchFullScreen') return switchFullScreen(e.target);
        if (value && value === 'switchKeysEditorMode') return switchKeysEditorMode(e.target);

        // #2 Handel Section change
        value = e.target.getAttribute('data-toggle-section');
        if (value) return toggleSection(value);

        // #3 Handel sendKey
        value = e.target.getAttribute('data-command');
        if(value){
            if(value === 'keyboard') {
                document.getElementById('hiddenKeyBoard').focus();
                return;
            }
            
            console.log('send command', value)
        }

        console.log('Clicked');
    });

    //Adding Full Screen Event Listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Handel create new button form
    newButtonForm = document.querySelector('#createNewButton')
    newButtonForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const inputs = Object.fromEntries(formData);

        if (inputs.btnEvent.length < 1) return showInputError('Choose an event plz!', 'btnEvent');
        if (['openUrl', 'sendKey'].includes(inputs.btnEvent) && inputs.btnValue.length < 1) return showInputError('Oops! key code/name missing', 'btnValue');
        if (inputs.btnIcon.length < 1) return showInputError('Icon is required!', 'btnIcon');

        // Get current board & put this key
        let buttons = localStorage.getItem(currentBoard) ?? '[]';
        buttons = JSON.parse(buttons);
        buttons.push(inputs);
        localStorage.setItem(currentBoard, JSON.stringify(buttons));

        // Reset Form Content
        newButtonForm.reset();

        // Update keyboard
        updateKeyboardKeys();

        // Close add button popup
        toggleSection(currentBoard);
    });

    newButtonForm.querySelector('select').addEventListener('change', (e) => {
        let valueInput = newButtonForm.querySelector('input[name=btnValue]');
        if (['notepad', 'cmd', 'keyboard'].includes(e.target.value)) {
            valueInput.style.display = 'none';
            return;
        }
        if (e.target.value === 'sendKey') valueInput.setAttribute('placeholder', 'Enter value e.g: rwin+e');
        if (e.target.value === 'openUrl') valueInput.setAttribute('placeholder', 'Enter value e.g: https://google.com');
        valueInput.style.display = 'block';
    });

    // Load default keyboard
    updateKeyboardKeys();

});