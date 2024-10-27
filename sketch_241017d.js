let bgImages = []; // Array to hold background images
let icons = []; // Array to hold icons
let numCols = 4; // Number of columns
let numRows = 4; // Number of rows
let cellSize = 200; // Size of each cell
let grid = []; // Array to hold current grid information
let newGrid = []; // Array to hold the new grid for transition
let transitionInProgress = false; // Flag to check if a transition is happening
let transitionStartTime = 0; // Timestamp to track transition time

let alpha = 0; // Initial alpha value
let fadeIn = true; // Start with fade-in
let fadeDuration = 5000; // Duration of each phase (5 seconds)
let newGridSet = false; // Flag to track if a new grid has been set

let cellFadeDelays = []; // Array to store random fade-in delays for each cell


const numBgToDisplay = 6; // Number of background images to display
const numIconsToDisplay = 3; // Number of icons to display
const numTextsToDisplay = 3; // Number of texts to display

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
    button.mousePressed(); // Call startTransition on button press
    initializeGrid();
}

function draw() {
    background(255); // Light gray background

    let xOffset = (width - numCols * cellSize) / 2;
    let yOffset = (height - numRows * cellSize) / 2;
    let iconScaleFactor = 0.4;

    // Calculate current cycle time within fade-in and fade-out phase
    let cycleTime = millis() % (2 * fadeDuration); // Full cycle: fade-in + fade-out

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let x = xOffset + j * cellSize;
            let y = yOffset + i * cellSize;

            // Calculate individual cell's fade-in and fade-out phases
            let cellAlpha = 0;
            let cellElapsedTime = cycleTime - cellFadeDelays[i][j];

            if (cellElapsedTime >= 0 && cellElapsedTime <= fadeDuration) {
                // Fade-in phase
                cellAlpha = map(cellElapsedTime, 0, fadeDuration / 2, 0, 255);
            } else if (cellElapsedTime > fadeDuration && cellElapsedTime <= 2 * fadeDuration) {
                // Fade-out phase
                cellAlpha = map(cellElapsedTime - fadeDuration, 0, fadeDuration / 2, 255, 0);
            }

            // Draw grid cell with a transparent stroke
            stroke(255, cellAlpha * 0.5); // 50% transparency for the grid line
            noFill();
            rect(x, y, cellSize, cellSize); // Draw cell outline with transparency

            // Draw cell content based on type with calculated alpha
            if (grid[i][j] && typeof grid[i][j] === 'object') {
                if (icons.includes(grid[i][j])) {
                    let iconSize = cellSize * iconScaleFactor;
                    let iconX = x + (cellSize - iconSize) / 2;
                    let iconY = y + (cellSize - iconSize) / 2;
                    tint(255, cellAlpha); // Set alpha for fade effect
                    image(grid[i][j], iconX, iconY, iconSize, iconSize);
                } else {
                    tint(255, cellAlpha);
                    image(grid[i][j], x, y, cellSize, cellSize);
                }
            } else if (grid[i][j] && typeof grid[i][j] === 'string') {
                fill(0, cellAlpha); // Set text color with alpha
                textAlign(CENTER, CENTER);

                let textContent = grid[i][j];
                let targetWidth = cellSize * 0.8;
                let targetHeight = cellSize * 0.8;

                let optimalFontSize = calculateFontSize(textContent, targetWidth, targetHeight);
                textSize(optimalFontSize);
                text(textContent, x + cellSize / 2, y + cellSize / 2);
            } else {
                fill(255, cellAlpha);
                rect(x, y, cellSize, cellSize);
            }
        }
    }

    noTint(); // Reset tint after drawing
}

// Function to start the transition by initializing the new grid and resetting transition variables
function startTransition() {
    if (!transitionInProgress) {
        newGrid = initializeGrid(true); // Create a new grid for transition
        transitionInProgress = true;
        transitionStartTime = millis(); // Set start time
        loop(); // Enable looping to animate the transition
    }
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

function initializeGrid(forTransition = false) {
     textFont(Lilac);

    grid = Array.from({ length: numRows }, () => Array(numCols).fill(null)); // Reset grid
    cellFadeDelays = Array.from({ length: numRows }, () => Array(numCols).fill(0)); // Reset cell fade delays

    // Randomly set a delay for each cell fade-in effect
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            cellFadeDelays[i][j] = random(0, fadeDuration / 2); // Random delay up to half the fade duration
        }
    }
    
    
    let gridToInitialize = Array.from({ length: numRows }, () => Array(numCols).fill(null));

    let selectedBgIndices = [];
    let selectedIconIndices = [];
    let selectedTextIndices = [];

    while (selectedBgIndices.length < numBgToDisplay) {
        let randomIndex = floor(random(bgImages.length));
        if (!selectedBgIndices.includes(randomIndex)) {
            selectedBgIndices.push(randomIndex);
        }
    }

    while (selectedIconIndices.length < numIconsToDisplay) {
        let randomIndex = floor(random(icons.length));
        if (!selectedIconIndices.includes(randomIndex)) {
            selectedIconIndices.push(randomIndex);
        }
    }

    while (selectedTextIndices.length < numTextsToDisplay) {
        let randomIndex = floor(random(texts.length));
        if (!selectedTextIndices.includes(randomIndex)) {
            selectedTextIndices.push(randomIndex);
        }
    }

    let positions = [];
    while (positions.length < numBgToDisplay + numIconsToDisplay) {
        let randomPos = floor(random(numRows * numCols));
        if (!positions.includes(randomPos)) {
            positions.push(randomPos);
        }
    }

    for (let i = 0; i < numBgToDisplay; i++) {
        let row = floor(positions[i] / numCols);
        let col = positions[i] % numCols;
        gridToInitialize[row][col] = bgImages[selectedBgIndices[i]];
    }

    for (let i = numBgToDisplay; i < numBgToDisplay + numIconsToDisplay; i++) {
        let row = floor(positions[i] / numCols);
        let col = positions[i] % numCols;
        gridToInitialize[row][col] = icons[selectedIconIndices[i - numBgToDisplay]];
    }

    for (let i = 0; i < numTextsToDisplay; i++) {
        let row, col;
        do {
            row = floor(random(numRows));
            col = floor(random(numCols));
        } while (gridToInitialize[row][col] !== null);
        gridToInitialize[row][col] = texts[selectedTextIndices[i]];
    }

    return forTransition ? gridToInitialize : (grid = gridToInitialize);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    redraw();
}
