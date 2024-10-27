let bgImages = []; // Array to hold background images
let icons = []; // Array to hold icons
let numCols = 5; // Number of columns
let numRows = 3; // Number of rows
let cellSize = 150; // Size of each cell
let grid = []; // Array to hold current grid information
let newGrid = []; // Array to hold the new grid for transition
let transitionInProgress = false; // Flag to check if a transition is happening
let transitionStartTime = 0; // Timestamp to track transition time

const numBgToDisplay = 4; // Number of background images to display
const numIconsToDisplay = 3; // Number of icons to display
const numTextsToDisplay = 3; // Number of texts to display

let alpha = 0; // Starting alpha for fade-out effect
let fadeIn = true; // Start with fade-in
let fadeInDuration = 4 * 1000; // Duration of each phase (5 seconds)
let fadeOutDuration = 10 * 1000; // Duration of each phase (5 seconds)

let newGridSet = false; // Flag to track if a new grid has been set


const texts = [
    "MOON",
    "WHISPERS",
    "JOURNEY",
    "COLOR",
    "ECHO",
    "DREAM",
    "RIVER",
    "HORIZON",
    "LIGHT",
    "FOREST",
    "BRIDGE",
    "SHADOW",
    "OCEAN",
    "DANCE",
    "MEMORY",
    "CANVAS",
    "TIME",
    "SONG",
    "WHIRLWIND",
    "STARLIGHT",
    "GARDEN",
    "WIND",
    "SECRET",
    "PATH",
    "FIRE",
    "STONE",
    "CRYSTAL",
    "SPARK",
    "HARMONY",
    "CLOUD",
    "LANEWAY",
    "COFFEE",
    "STREET ART",
    "CULTURE",
    "TRAM",
    "BEACH",
    "GATHERING",
    "SUNSET",
    "FESTIVAL",
    "MARKET",
    "CUISINE",
    "SPORTS",
    "MELBOURNE",
    "RIVERBANK",
    "COMMUNITY",
    "ARCHITECTURE",
    "HERITAGE",
    "BUSHLAND",
    "CREATIVITY",
    "SPACE",
    "DESIGN",
    "FORM",
    "TEXTURE",
    "PATTERN",
    "DIMENSION",
    "INNOVATION",
    "FUNCTIONALITY",
    "AESTHETIC",
    "BALANCE",
    "SYMMETRY",
    "PROPORTION",
    "CONCEPT",
    "SKYLINE",
    "SCULPTURE",
    "LIGHTING",
    "PERSPECTIVE",
    "FUSION",
    "VIBRANCE",
    "ELEGANCE",
    "COLLABORATION",
    "EXPRESSION",
    "MOVEMENT",
    "SPATIAL",
    "MATERIAL",
    "CINEMATIC",
    "RESEARCH",
    "PROJECTION",
    "EXPERIENCE",
    "DYNAMISM",
    "INTERACTION",
    "ENLIGHTENMENT",
    "METAPHOR",
    "EVOLUTION",
    "SUSTAINABILITY",
    "VISION",
    "COSMOS",
    "GALAXY",
    "ASTROLOGY",
    "PLANET",
    "UNIVERSE",
    "TIMELESS"
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
}

function draw() {
    background(0); // Light gray background

    // Calculate center position for grid
    let xOffset = (width - numCols * cellSize) / 2;
    let yOffset = (height - numRows * cellSize) / 2;
    let iconScaleFactor = 0.4;

    // Determine the elapsed time within the current fade cycle
    let cycleTime = millis() % (fadeInDuration + fadeOutDuration); // Total cycle is fade-in + fade-out

    if (cycleTime < fadeInDuration) {
        // Fade-in phase
        if (!fadeIn) {
            fadeIn = true;
            newGridSet = false; // Reset flag to allow a new grid update at the start of fade-in
        }
        alpha = map(cycleTime, 0, fadeInDuration, 0, 255); // Increase alpha over time

        // Set a new grid at the start of each fade-in
        if (!newGridSet) {
            initializeGrid(); // Randomize the grid
            newGridSet = true; // Prevent reinitializing until the next fade-in
        }
    } else {
        // Fade-out phase
        if (fadeIn) {
            fadeIn = false;
        }
        alpha = map(cycleTime - fadeInDuration, 0, fadeOutDuration, 255, 0); // Decrease alpha over time
    }

    // Draw the current grid with the current alpha
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let x = xOffset + j * cellSize;
            let y = yOffset + i * cellSize;

            // Draw the grid cell with a transparent stroke
            stroke(255, alpha * 0); // 50% transparency for the grid line
            fill(0);
            rect(x, y, cellSize, cellSize); // Draw cell outline with transparency

            // Draw cell content based on type
            if (grid[i][j] && typeof grid[i][j] === 'object') {
                if (icons.includes(grid[i][j])) {
                    let iconSize = cellSize * iconScaleFactor;
                    let iconX = x + (cellSize - iconSize) / 2;
                    let iconY = y + (cellSize - iconSize) / 2;
                    tint(255, alpha); // Set alpha for fade effect
                    image(grid[i][j], iconX, iconY, iconSize, iconSize);
                } else {
                    tint(255, alpha);
                    image(grid[i][j], x, y, cellSize, cellSize);
                }
            } else if (grid[i][j] && typeof grid[i][j] === 'string') {
                fill(255, alpha); // Set text color with alpha
                textAlign(CENTER, CENTER);

                let textContent = grid[i][j];
                let targetWidth = cellSize * 0.8;
                let targetHeight = cellSize * 0.8;

                let optimalFontSize = calculateFontSize(textContent, targetWidth, targetHeight);
                textSize(optimalFontSize);
                text(textContent, x + cellSize / 2, y + cellSize / 2);
            } else // empty cell
            {
                fill(0, alpha);
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
    stroke(0,0);
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
