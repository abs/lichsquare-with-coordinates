// content.js
console.log('Lichess Extension is adding coordinates to the board.');

function addCoordinates() {
    // Select the cg-container element
    const container = document.querySelector('cg-container');
    if (!container) {
        console.error('Container element not found.');
        return;
    }

    console.log('Container element found:', container);

    // Find the parent div with orientation class
    const orientationElement = document.querySelector('.orientation-white, .orientation-black');
    if (!orientationElement) {
        console.error('Orientation element not found.');
        return;
    }

    console.log('Orientation element found:', orientationElement);

    const isBlackOrientation = orientationElement.classList.contains('orientation-black');
    console.log(`Board orientation: ${isBlackOrientation ? 'black' : 'white'}`);

    // Remove any existing overlays to avoid duplication
    const existingOverlay = container.querySelector('.coordinate-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
        console.log('Existing overlay removed.');
    }

    // Create a container for the coordinates overlay
    const overlay = document.createElement('div');
    overlay.className = 'coordinate-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '10'; // Ensure it is above the board but below pieces

    // Define the ranks (rows) and files (columns)
    const ranks = isBlackOrientation ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['8', '7', '6', '5', '4', '3', '2', '1'];
    const files = isBlackOrientation ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    const boardSize = 8;
    const squareSize = container.clientWidth / boardSize;

    // Add coordinates to all 64 squares
    for (let rankIndex = 0; rankIndex < boardSize; rankIndex++) {
        for (let fileIndex = 0; fileIndex < boardSize; fileIndex++) {
            const rank = ranks[rankIndex];
            const file = files[fileIndex];

            const coordinateDiv = document.createElement('div');
            coordinateDiv.textContent = `${file}${rank}`;
            coordinateDiv.style.position = 'absolute';
            coordinateDiv.style.width = `${squareSize}px`;
            coordinateDiv.style.height = `${squareSize}px`;
            coordinateDiv.style.top = `${rankIndex * squareSize}px`;
            coordinateDiv.style.left = `${fileIndex * squareSize}px`;
            coordinateDiv.style.display = 'flex';
            coordinateDiv.style.alignItems = 'flex-start';
            coordinateDiv.style.justifyContent = 'flex-end';
            coordinateDiv.style.fontSize = '11px';
            coordinateDiv.style.padding = '2px'; // Adjust padding as needed
            coordinateDiv.style.pointerEvents = 'none';

            // Determine the background color of the square
            const isWhiteSquare = (rankIndex + fileIndex) % 2 === 0;
            coordinateDiv.style.color = isWhiteSquare ? 'black' : 'white';

            overlay.appendChild(coordinateDiv);
        }
    }

    // Ensure the container is not being obscured
    container.style.position = 'relative';
    container.appendChild(overlay);
    console.log('HTML/CSS overlay appended to the container.');
}

function observeOrientationChanges() {
    const orientationElement = document.querySelector('.orientation-white, .orientation-black');
    if (!orientationElement) {
        console.error('Orientation element not found for observing.');
        setTimeout(observeOrientationChanges, 100); // Retry after a short delay if not found
        return;
    }

    console.log('Observing orientation element:', orientationElement);

    const mutationObserver = new MutationObserver(() => {
        console.log('Orientation change detected.');
        addCoordinates();
    });

    mutationObserver.observe(orientationElement, {
        attributes: true,
        attributeFilter: ['class']
    });
}

function observeContainerResize() {
    const container = document.querySelector('cg-container');
    if (!container) {
        console.error('Container element not found for resize observing.');
        return;
    }

    const resizeObserver = new ResizeObserver(() => {
        console.log('Resize detected.');
        addCoordinates();
    });

    resizeObserver.observe(container);
}

// Initial observer to detect when cg-container is loaded
const initialObserver = new MutationObserver((mutations, obs) => {
    const orientationElement = document.querySelector('.orientation-white, .orientation-black');
    if (orientationElement) {
        addCoordinates();
        observeOrientationChanges();
        observeContainerResize();
        obs.disconnect();
    }
});

initialObserver.observe(document, {
    childList: true,
    subtree: true
});

// Re-add coordinates when the window is resized
window.addEventListener('resize', () => {
    addCoordinates();
});

