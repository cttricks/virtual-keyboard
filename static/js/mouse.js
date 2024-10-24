let dpi = parseInt((localStorage.getItem('mouse_dpi') ?? '8'));
document.querySelector('div.mouse-buttons h2').innerHTML = dpi;

const sendMouseClick = (type) => {
    fetch('/execute?command=mbClick>' + type, {
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

// Send cursor x-y values to the Go server
const sendCursorPosition =  async (x, y) => {
    try{
        // Here DPI is acting as Scaling factor to move mouse on a wider range then 320px 
        // 320px is the max size of mouse-pad
        // Multiplying X-Y with DPI value increase the cursor position value
        const url = `/move?x=${(lastX * dpi)}&y=${(lastY * dpi)}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        console.log('Is Sent?: ', response.ok);

    }catch(err) {
        console.error('Error Occurred While Sending Cursor Position:', err);
    }
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

document.addEventListener('DOMContentLoaded', () => {

    // Handel mouse-button clicks
    document.querySelector('div.mouse-buttons').addEventListener('click', (e) => {
        // Send mouse Click
        if (e.target.getAttribute('type')) return sendMouseClick(e.target.getAttribute('type'));

        // Set new DPI value
        dpi = dpi + 2;
        if (dpi > 10) dpi = 1;
        localStorage.setItem('mouse_dpi', dpi);
        e.target.querySelector('h2').innerHTML = dpi;
    });

    //Adding Full Screen Event Listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Handel full-screen option
    document.querySelector('header').addEventListener('click' , (e) => {

        // #1 Handel function calls
        let value = e.target.getAttribute('data-call-func');
        if (value && value === 'switchFullScreen') return switchFullScreen(e.target);

        // #2 Switch page
        value = e.target.getAttribute('data-toggle-page');
        if(value) {
            window.location.href = (window.location.port !== 3001)? '/static' : '/';
            return;
        }

    }); 

});

const cursor = document.getElementById('cursor');
const cursorContainer = document.getElementById('cursorContainer');

let isDragging = false;
let lastX = 0;
let lastY = 0;

// Function to handle dragging logic
const handleDrag = (clientX, clientY) => {
    const parentRect = cursorContainer.getBoundingClientRect();
    let x = clientX - parentRect.left - (cursor.offsetWidth / 2); // Center the child on the cursor
    let y = clientY - parentRect.top - (cursor.offsetHeight / 2);

    // Keep child within parent boundaries
    x = Math.max(0, Math.min(parentRect.width - cursor.offsetWidth, x));
    y = Math.max(0, Math.min(parentRect.height - cursor.offsetHeight, y));

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    lastX = parseInt(x);
    lastY = parseInt(y);
};

// Mouse events
cursor.addEventListener('mousedown', (event) => {
    isDragging = true;
    cursor.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        handleDrag(event.clientX, event.clientY);
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        cursor.style.cursor = 'grab';
        endOfMove();
    }
});

// Touch events
cursor.addEventListener('touchstart', (event) => {
    isDragging = true;
    cursor.style.cursor = 'grabbing';
    event.preventDefault();
});

document.addEventListener('touchmove', (event) => {
    if (isDragging) {
        const touch = event.touches[0];
        handleDrag(touch.clientX, touch.clientY);
    }
});

document.addEventListener('touchend', () => {
    if (isDragging) {
        isDragging = false;
        cursor.style.cursor = 'grab';
        endOfMove();

    }
});

function endOfMove() {
    lastX = 0;
    lastY = 0;
}

setInterval(() => {
    if (lastX < 1 && lastY < 1) return;
    sendCursorPosition(lastX, lastY);
}, 75);