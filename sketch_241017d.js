let bgImages = []; // Array to hold background images
let icons = []; // Array to hold icons
let numCols = 5; // Number of columns
let numRows = 5; // Number of rows
let cellSize = 200; // Size of each cell
let grid = []; // Array to hold current grid information
let newGrid = []; // Array to hold the new grid for transition
let transitionInProgress = false; // Flag to check if a transition is happening
let transitionStartTime = 0; // Timestamp to track transition time

const numBgToDisplay = 6; // Number of background images to display
const numIconsToDisplay = 3; // Number of icons to display
const numTextsToDisplay = 3; // Number of texts to display

let alpha = 0; // Starting alpha for fade-out effect
let fadeIn = true; // Start with fade-in
let fadeDuration = 5000; // Duration of each phase (5 seconds)
let newGridSet = false; // Flag to track if a new grid has been set


const texts = [
    "DON'T",
    "HASTY",
    "DEFINING",
    "BIG;",
    "CHANCES",
    "ERROR",
    "MAKE",
    "INVENTORY",
    "SEE",
    "LIST",
    "SURE",
    "CONCERN",
    "TOWN'S",
    "DIVISIONS",
    "LOOK",
    "HAPPENS",
    "STOPS",
    "FOOLPROOF",
    "METHOD",
    "TOWER",
    "SUBURBS",
    "REMAIN",
    "LONG",
    "NOTE",
    "CHANGING",
    "IDENTITY",
    "AUTEUIL",
    "COUNTRY",
    "MID-1800S",
    "PARENTS",
    "GOOD",
    "AIR",
    "AUTEUIL",
    "ARC",
    "TRIOMPHE",
    "BUILT",
    "OUTSIDE",
    "TOWN",
    "SAINT-DENIS,",
    "BAGNOLET",
    "BIGGER",
    "TOWNS",
    "FAUBOURG",
    "USED",
    "OUTSIDE",
    "TOWN",
    "SAINT-GERMAIN-DES-PRÉS",
    "FIELDS",
    "ONCE",
    "BOULEVARD",
    "TREE-LINED",
    "WALK",
    "WIND",
    "DRIVES",
    "SMELLS",
    "EAST",
    "SMART",
    "DISTRICTS",
    "LIE",
    "WEST",
    "MEGALOPOLISES,",
    "URBAN",
    "SPRAWL,",
    "TRAFFIC",
    "ARTERIES",
    "ABSTRACTION",
    "DESIGN",
    "ABSURDITY",
    "MELBOURNE",
    "ARCHITECTURE",
    "DYNAMISM",
    "COLLAGE",
    "SYMBOLISM",
    "CONCEPTUALIZE",
    "ECOLOGY",
    "INTERSECTION",
    "FLUX",
    "NARRATIVE",
    "ANARCHY",
    "TRANSCENDENCE",
    "DISRUPTION",
    "VISUALIZE",
    "FUSION",
    "URBANISM",
    "AESTHETIC",
    "REVERIE",
    "INTERPRETATION",
    "MULTIFACETED",
    "EXPERIMENTATION",
    "SPECTRUM"
];

let fontSize = 40;
let lineHeight = fontSize * 1.2; // Set line height for text

function preload() {
    // Load background images and icons into arrays
    for (let i = 1; i <= 64; i++) {
        bgImages[i - 1] = loadImage(`assets/bg4_${i}.png`);
    }

    for (let i = 1; i <= 35; i++) {
        icons[i - 1] = loadImage(`assets/overlay${i}.png`);
    }

    Lilac = loadFont('assets/LilacPixel.otf'); // Load font
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    const button = select('#randomButton');
    button.mousePressed(startTransition); // Call startTransition on button press
    initializeGrid();
    setupCellProperties();
}

function draw() {
    background(255); // Light gray background
    let xOffset = (width - numCols * cellSize) / 2;
    let yOffset = (height - numRows * cellSize) / 2;

    // Update alpha values for each cell
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let fadeDuration = fadeDurations[i][j];
            if (fadeInTimers[i][j]) {
                let elapsedTime = millis() - fadeInTimers[i][j];
                cellAlphas[i][j] = map(elapsedTime, 0, fadeDuration, 0, 255);
                if (elapsedTime > fadeDuration) {
                    fadeInTimers[i][j] = null; // Stop the timer
                    cellAlphas[i][j] = 255; // Ensure full opacity after fade-in
                }
            } else if (fadeOutTimers[i][j]) {
                let elapsedTime = millis() - fadeOutTimers[i][j];
                cellAlphas[i][j] = map(elapsedTime, 0, fadeDuration, 255, 0);
                if (elapsedTime > fadeDuration) {
                    fadeOutTimers[i][j] = null; // Stop the timer
                    cellAlphas[i][j] = 0; // Ensure full transparency after fade-out
                }
            }
        }
    }

    // Draw the current grid with the current alpha
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let x = xOffset + j * cellSize;
            let y = yOffset + i * cellSize;

            stroke(255, cellAlphas[i][j] * 0.5); // 50% transparency for the grid line
            noFill();
            rect(x, y, cellSize, cellSize); // Draw cell outline with transparency

            // Draw cell content based on type
            let alphaValue = cellAlphas[i][j];
            if (currentGrid[i][j]) {
                if (icons.includes(currentGrid[i][j])) {
                    let iconSize = cellSize * 0.4;
                    let iconX = x + (cellSize - iconSize) / 2;
                    let iconY = y + (cellSize - iconSize) / 2;
                    tint(255, alphaValue); // Set alpha for fade effect
                    image(currentGrid[i][j], iconX, iconY, iconSize, iconSize);
                } else if (typeof currentGrid[i][j] === 'string') {
                    fill(0, alphaValue); // Set text color with alpha
                    textAlign(CENTER, CENTER);
                let textContent = grid[i][j];
                let targetWidth = cellSize * 0.8;
                let targetHeight = cellSize * 0.8;

                let optimalFontSize = calculateFontSize(textContent, targetWidth, targetHeight);
                textSize(optimalFontSize);
                text(textContent, x + cellSize / 2, y + cellSize / 2);
                } else {
                    tint(255, alphaValue);
                    image(currentGrid[i][j], x, y, cellSize, cellSize);
                }
            }
        }
    }

    noTint(); // Reset tint after drawing
}


// Function to start the transition by initializing the new grid and resetting transition variables
function startTransition() {
    // Set up new grid and reset properties for fade-in
    initializeGrid();
    setupCellProperties();
}

function calculateFontSize(textContent, targetWidth, targetHeight) {
    let fontSize = 40;
    textSize(fontSize);
    let textWidthValue = textWidth(textContent);
    let textHeightValue = textAscent() + textDescent();

    let widthScale = targetWidth / textWidthValue;
    let heightScale = targetHeight / textHeightValue;
    return fontSize * Math.min(widthScale, heightScale);
}

function initializeGrid() {
  textFont(Lilac);
    currentGrid = Array.from({ length: numRows }, () => Array(numCols).fill(null));
    let selectedBgIndices = selectRandomIndices(bgImages.length, numBgToDisplay);
    let selectedIconIndices = selectRandomIndices(icons.length, numIconsToDisplay);
    let selectedTextIndices = selectRandomIndices(texts.length, numTextsToDisplay);
    
    let positions = selectRandomPositions(numBgToDisplay + numIconsToDisplay);

    for (let i = 0; i < numBgToDisplay; i++) {
        let row = floor(positions[i] / numCols);
        let col = positions[i] % numCols;
        currentGrid[row][col] = bgImages[selectedBgIndices[i]];
    }

    for (let i = numBgToDisplay; i < numBgToDisplay + numIconsToDisplay; i++) {
        let row = floor(positions[i] / numCols);
        let col = positions[i] % numCols;
        currentGrid[row][col] = icons[selectedIconIndices[i - numBgToDisplay]];
    }

    for (let i = 0; i < numTextsToDisplay; i++) {
        let row, col;
        do {
            row = floor(random(numRows));
            col = floor(random(numCols));
        } while (currentGrid[row][col] !== null);
        currentGrid[row][col] = texts[selectedTextIndices[i]];
    }
}

function selectRandomIndices(total, count) {
    let indices = [];
    while (indices.length < count) {
        let randomIndex = floor(random(total));
        if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
        }
    }
    return indices;
}

function selectRandomPositions(total) {
    let positions = [];
    while (positions.length < total) {
        let randomPos = floor(random(numRows * numCols));
        if (!positions.includes(randomPos)) {
            positions.push(randomPos);
        }
    }
    return positions;
}

function setupCellProperties() {
    cellAlphas = Array.from({ length: numRows }, () => Array(numCols).fill(0));
    fadeDurations = Array.from({ length: numRows }, () => Array(numCols).fill(random(2000, 5000))); // Random duration between 2s and 5s
    fadeInTimers = Array.from({ length: numRows }, () => Array(numCols).fill(null));
    fadeOutTimers = Array.from({ length: numRows }, () => Array(numCols).fill(null));

    // Set fade-in for all cells
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            fadeInTimers[i][j] = millis(); // Start fade-in now
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    redraw();
}
