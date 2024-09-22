let draggedButton = null;
let touchStartX = 0;
let touchStartY = 0;
let deleteAreaTimer;
let keyOrderTimer;

function toggleDeleteArea(show = true) {

    if(deleteAreaTimer) clearTimeout(deleteAreaTimer);
    if(!show) {
        document.getElementById('dropForDelete').style.display = 'none';
        if(keyOrderTimer) clearTimeout(keyOrderTimer);
        keyOrderTimer = setTimeout(() => {
            let board = currentBoard = localStorage.getItem('current-board') ?? 'default-keyboard';
            let keys = [];
            document.querySelectorAll(`section#${board} button`).forEach(button => {
                keys.push(JSON.parse(decodeURIComponent(button.getAttribute('data-json'))));
            });
            
            localStorage.setItem(currentBoard, JSON.stringify(keys));

        }, 100);

        return;
    }

    deleteAreaTimer = setTimeout(() => {
        document.getElementById('dropForDelete').style.display = 'flex';
    }, 350);
}

function dragStart(event) {
    draggedButton = event.target;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.style.opacity = '0.5';
    toggleDeleteArea();
}

function allowDrop(event) {
    event.preventDefault();
}

function dragEnd(event) {
    event.target.style.opacity = "";
    toggleDeleteArea(false);
}

function drop(event) {
    event.preventDefault();

    let targetButton = event.target;
    if(targetButton.id && targetButton.id === 'dropForDelete'){
        console.log('delete this button', draggedButton);
        draggedButton.remove();
        toggleDeleteArea(false);
        return;
    }

    targetButton = targetButton.closest('button');

    if (draggedButton !== targetButton && targetButton) {
        const container = document.getElementById('default-keyboard');
        const draggedIndex = Array.from(container.children).indexOf(draggedButton);
        const targetIndex = Array.from(container.children).indexOf(targetButton);

        if (draggedIndex < targetIndex) {
            container.insertBefore(draggedButton, targetButton.nextSibling);
        } else {
            container.insertBefore(draggedButton, targetButton);
        }
    }
    draggedButton.style.opacity = '';
    toggleDeleteArea(false);
}

function touchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    draggedButton = event.target.closest('button');
    draggedButton.style.opacity = '0.5';
    toggleDeleteArea();
}

function touchMove(event) {
    event.preventDefault();
    const touchMoveX = event.touches[0].clientX;
    const touchMoveY = event.touches[0].clientY;

    draggedButton.style.position = 'absolute';
    draggedButton.style.left = `${touchMoveX - touchStartX + draggedButton.offsetLeft}px`;
    draggedButton.style.top = `${touchMoveY - touchStartY + draggedButton.offsetTop}px`;

}

function touchEnd(event) {
    draggedButton.style.opacity = '';
    draggedButton.style.position = '';
    draggedButton.style.left = '';
    draggedButton.style.top = '';

    let targetButton = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    if(targetButton.id && targetButton.id === 'dropForDelete'){
        console.log('delete this button', draggedButton);
        draggedButton.remove();
        toggleDeleteArea(false);
        return;
    }

    targetButton = targetButton.closest('button');

    if (draggedButton !== targetButton && targetButton) {
        const container = document.getElementById('default-keyboard');
        const draggedIndex = Array.from(container.children).indexOf(draggedButton);
        const targetIndex = Array.from(container.children).indexOf(targetButton);

        if (draggedIndex < targetIndex) {
            container.insertBefore(draggedButton, targetButton.nextSibling);
        } else {
            container.insertBefore(draggedButton, targetButton);
        }
    }

    toggleDeleteArea(false);
}