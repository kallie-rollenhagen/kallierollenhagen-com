// --- 1. Global Variables and Color Palettes ---
let wadaColorsData;
let generateButton;
let downloadButton;
let singleQuiltButton; // Removed from previous version, now effectively "Generate Quilt Grids" button
let quiltBlockCanvas; // Reference to the p5.js canvas
let quiltSize;

function calculateQuiltSize() {
//   return min(windowWidth * 0.9, 672);
    const container = document.getElementById("wada-quilts-canvas");
    // console.log(`calulateQuiltSize = ${container.clientWidth}`)
    // return container.clientWidth;
    console.log(`calculateQuiltSize: ${container.clientWidth}`);

    return container.getBoundingClientRect().width;
}

let mainContentWrapper;
let leftPanel;
let centerPanel;
let bottomButtonsWrapper; // New wrapper for bottom buttons

let h1Element;
let introParagraphElement;
let quiltNameElement = document.getElementById("quilt-name");

let colorSwatches = Array.from(document.querySelectorAll('.color-swatch'));
let combinationInfoSpan = document.getElementById("combination-info");

let currentCombination;
let currentPattern;
let currentCombinationId;
let currentShuffledColors;

// Array of patterns with names and functions
const quiltPatterns = [
  { name: "Economy Block", func: drawEconomyBlock },
  { name: "Shoofly", func: drawShoofly },
  { name: "Nine Patch", func: drawNinePatch },
  { name: "Rail Fence", func: drawRailFence },
  { name: "Broken Dishes", func: drawBrokenDishes },
  { name: "Calico Puzzle", func: drawCalicoPuzzle },
  { name: "Battleground Quilt", func: drawBattlegroundQuilt },
  { name: "Double Nine Patch", func: drawDoubleNinePatch },
  { name: "Ohio Star", func: drawOhioStar }
];

// --- 2. Utility Functions (WCAG contrast and Color Manipulation) ---

// Helper to convert hex to RGB
function hexToRgb(hex) {
    if (!hex) return null;
    let r = 0, g = 0, b = 0;
    // Handle 3-digit hex
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return [r, g, b];
}

// Function to calculate relative luminance (WCAG method)
function getRelativeLuminance(hexcolor) {
    const rgb = hexToRgb(hexcolor);
    if (!rgb) {
        console.warn('Invalid hex color for luminance calculation:', hexcolor);
        return 0;
    }

    const sRGB = rgb.map(c => c / 255);
    const R = sRGB[0] <= 0.03928 ? sRGB[0] / 12.92 : Math.pow((sRGB[0] + 0.055) / 1.055, 2.4);
    const G = sRGB[1] <= 0.03928 ? sRGB[1] / 12.92 : Math.pow((sRGB[1] + 0.055) / 1.055, 2.4);
    const B = sRGB[2] <= 0.03928 ? sRGB[2] / 12.92 : Math.pow((sRGB[2] + 0.055) / 1.055, 2.4);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// Function to calculate contrast ratio (WCAG method)
function getContrastRatio(color1Hex, color2Hex) {
    const L1 = getRelativeLuminance(color1Hex);
    const L2 = getRelativeLuminance(color2Hex);

    const lighterL = Math.max(L1, L2);
    const darkerL = Math.min(L1, L2);

    return (lighterL + 0.05) / (darkerL + 0.05);
}

// Function to choose the best text color (black or white) for WCAG AA compliance
function getAccessibleTextColor(backgroundColorHex, targetContrastRatio = 4.5) {
    const white = '#FFFFFF';
    const black = '#000000';

    const contrastWithWhite = getContrastRatio(backgroundColorHex, white);
    const contrastWithBlack = getContrastRatio(backgroundColorHex, black);

    if (contrastWithWhite >= targetContrastRatio) {
        return white;
    }
    if (contrastWithBlack >= targetContrastRatio) {
        return black;
    }

    // If neither meets the target, return the one with higher contrast
    return contrastWithWhite > contrastWithBlack ? white : black;
}

// Function to darken a p5.Color object by a given amount (0-255)
function darkenColor(p5Color, amount) {
    amount = constrain(amount, 0, 255);
    return color(
        constrain(red(p5Color) - amount, 0, 255),
        constrain(green(p5Color) - amount, 0, 255),
        constrain(blue(p5Color) - amount, 0, 255)
    );
}

// Updates the small color swatches below the canvas with names and hex codes
function updateColorDisplay(combinationId, currentCombination) {
    if (!combinationInfoSpan) {
        console.error("combinationInfoSpan not found for combination number update.");
        return;
    }
    combinationInfoSpan.innerHTML = `${currentPattern.name}<br>(Combination: ${currentCombinationId})`;

    for (let i = 0; i < currentCombination.length; i++) {
        const swatch = colorSwatches[i];
        const colorData = wadaColorsData.colors[currentCombination[i]];

        if (!swatch) {
            console.error(`Color swatch element at index ${i} is null or undefined.`);
            continue;
        }

        swatch.style.backgroundColor = colorData.hex;

        const textColorForSwatch = getAccessibleTextColor(colorData.hex, 4.5);
        swatch.textContent = ''; // Clear previous content

        const nameSpan = createElement('span', colorData.name);
        nameSpan.class('color-text');
        nameSpan.style('color', textColorForSwatch);
        nameSpan.parent(swatch);

        const hexSpan = createElement('span', colorData.hex.toUpperCase());
        hexSpan.class('color-text');
        hexSpan.style('color', textColorForSwatch);
        hexSpan.parent(swatch);
    }
}

// Function to update button colors, including hover states
function updateDynamicStyling(currentCombination) {
    console.log(currentCombination)
    const c1_hex = wadaColorsData.colors[currentCombination[0]].hex;
    const c2_hex = wadaColorsData.colors[currentCombination[1]].hex; // Used for download button
    const c3_hex = wadaColorsData.colors[currentCombination[2]].hex; // Used for right panel background and info text

    // Apply background color to the main content wrapper
    const mainContentWrapper = select('#main-content-wrapper');
    if (mainContentWrapper) mainContentWrapper.style('background-color', 'transparent'); // Kept transparent as body is white

    // Left panel text (static colors)
    if (h1Element) h1Element.style('color', '#333');
    if (introParagraphElement) introParagraphElement.style('color', '#555');
    if (quiltNameElement) quiltNameElement.style.color = '#333';

    // Right panel: Combination Info (removed background color from right panel)
    const rightPanel = select('#right-panel');
    if (rightPanel) {
        rightPanel.style('background-color', 'transparent'); // Make background transparent
        rightPanel.style('box-shadow', 'none'); // Remove shadow
    }

    const combinationInfoElement = select('#combination-info');
    if (combinationInfoElement) {
        const infoTextColor = '#333'; // Static color for readability on white background
        combinationInfoElement.style('color', infoTextColor);
        combinationInfoElement.style('text-shadow', 'none'); // Ensure no text shadow
    }

    // Generate Button styling (orange)
    if (generateButton) {
        const generateBtnColor = c1_hex; // Dynamic color
        generateButton.style.backgroundColor = generateBtnColor;
        const generateButtonTextColor = getAccessibleTextColor(generateBtnColor, 4.5);
        generateButton.style.color = generateButtonTextColor;
        document.documentElement.style.setProperty('--generate-button-hover-bg', darkenColor(color(generateBtnColor), 30).toString());
        document.documentElement.style.setProperty('--generate-button-hover-color', getAccessibleTextColor(darkenColor(color(generateBtnColor), 30).toString(), 4.5));
    }

    // Generate Quilt Grids Button styling (newly added button)
    const generateGridButton = select('#generateGridButton'); // Need to select it by ID
    if (generateGridButton) {
        const generateGridBtnColor = c2_hex; // Dynamic color
        generateGridButton.style('background-color', generateGridBtnColor);
        const generateGridButtonTextColor = getAccessibleTextColor(generateGridBtnColor, 4.5);
        generateGridButton.style('color', generateGridButtonTextColor);
        document.documentElement.style.setProperty('--generate-grid-button-hover-bg', darkenColor(color(generateGridBtnColor), 30).toString());
        document.documentElement.style.setProperty('--generate-grid-button-hover-color', getAccessibleTextColor(darkenColor(color(generateGridBtnColor), 30).toString(), 4.5));
    }
    
    // Download Button styling (blue-grey)
    const downloadButton = select('#downloadButton'); // Need to select it by ID
    if (downloadButton) {
        const downloadBtnColor = c3_hex; // Dynamic color
        downloadButton.style('background-color', downloadBtnColor);
        const downloadButtonTextColor = getAccessibleTextColor(downloadBtnColor, 4.5);
        downloadButton.style('color', downloadButtonTextColor);
        document.documentElement.style.setProperty('--download-button-hover-bg', darkenColor(color(downloadBtnColor), 30).toString());
        document.documentElement.style.setProperty('--download-button-hover-color', getAccessibleTextColor(darkenColor(color(downloadBtnColor), 30).toString(), 4.5));
    }
}

// Function to download the canvas as a PNG image
function downloadQuilt() {
  const comboNum = currentCombination
    ? currentCombination.comboNumber
    : 'unknown';

  saveCanvas(
    `barn_quilt_combo_${comboNum}`,
    'png'
  );
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = floor(random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // ES6 swap
    }
    return array;
}

// --- 3. Barn Quilt Pattern Functions ---

// Barn Quilt Pattern: Economy Block
function drawEconomyBlock(colors) {
    let [c1, c2, c3] = colors;
    let s = quiltSize;
    let quarter = s / 4;
    let half = s / 2;

    noStroke();

    fill(c1);
    rect(0, 0, s, s);

    fill(c2);
    beginShape();
    vertex(half, 0);
    vertex(s, half);
    vertex(half, s);
    vertex(0, half);
    endShape(CLOSE);

    fill(c3);
    rect(quarter, quarter, half, half);
}

// Barn Quilt Pattern: Shoofly
function drawShoofly(colors) {
    let [c1, c2, c3] = colors;
    let s = quiltSize;
    let third = s / 3;

    noStroke();
    fill(c1);
    rect(0, 0, s, s);

    fill(c3);
    rect(third, third, third, third);

    fill(c2);
    triangle(0, 0, third, 0, 0, third);
    triangle(s - third, 0, s, 0, s, third);
    triangle(s - third, s, s, s, s, s - third);
    triangle(0, s - third, 0, s, third, s);

    fill(c2);
    rect(third, 0, third, third);
    rect(s - third, third, third, third);
    rect(third, s - third, third, third);
    rect(0, third, third, third);
}

// Barn Quilt Pattern: Nine Patch
function drawNinePatch(colors) {
    let [c1, c2, c3] = colors;
    let s = quiltSize;
    let third = s / 3;

    noStroke();

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let x = j * third;
            let y = i * third;
            if (i === 1 && j === 1) {
                fill(c3);
            } else if ((i === 0 || i === 2) && (j === 0 || j === 2)) {
                fill(c1);
            } else {
                fill(c2);
            }
            rect(x, y, third, third);
        }
    }
}

// Barn Quilt Pattern: Rail Fence
function drawRailFence(colors) {
    let [c1, c2, c3] = colors;
    let s = quiltSize;
    let blockDim = s / 3;
    let stripDim = blockDim / 3;

    const cell = quiltSize / 9;
    background(c2);
    noStroke();
    fill(c1);
    beginShape();
    vertex(0*cell, 0);
    vertex(1*cell, 0);
    vertex(1*cell, 3*cell);
    vertex(4*cell, 3*cell);
    vertex(4*cell, 6*cell);
    vertex(7*cell, 6*cell);
    vertex(7*cell, 9*cell);
    vertex(6*cell, 9*cell);
    vertex(6*cell, 7*cell);
    vertex(3*cell, 7*cell);
    vertex(3*cell, 4*cell);
    vertex(0, 4*cell);
    vertex(0, 0);
    endShape(CLOSE);
    
    beginShape();
    vertex(3*cell, 0);
    vertex(7*cell, 0);
    vertex(7*cell, 3*cell);
    vertex(9*cell, 3*cell);
    vertex(9*cell, 4*cell);
    vertex(6*cell, 4*cell);
    vertex(6*cell, 1*cell);
    vertex(3*cell, 1*cell);
    vertex(3*cell, 0);
    endShape(CLOSE);
    
    beginShape();
    vertex(0, 6*cell);
    vertex(1*cell, 6*cell);
    vertex(1*cell, 9*cell);
    vertex(0*cell, 9*cell);
    vertex(0*cell, 6*cell);
    endShape(CLOSE);

    fill(c3);
    beginShape();
    vertex(2*cell, 0);
    vertex(3*cell, 0);
    vertex(3*cell, 2*cell);
    vertex(6*cell, 2*cell);
    vertex(6*cell, 5*cell);
    vertex(9*cell, 5*cell);
    vertex(9*cell, 9*cell);
    vertex(8*cell, 9*cell);
    vertex(8*cell, 6*cell);
    vertex(5*cell, 6*cell);
    vertex(5*cell, 3*cell);
    vertex(2*cell, 3*cell);
    vertex(2*cell, 0*cell);
    endShape(CLOSE);
    
    beginShape();
    vertex(0, 5*cell);
    vertex(3*cell, 5*cell);
    vertex(3*cell, 8*cell);
    vertex(6*cell, 8*cell);
    vertex(6*cell, 9*cell);
    vertex(2*cell, 9*cell);
    vertex(2*cell, 6*cell);
    vertex(0*cell, 6*cell);
    vertex(0*cell, 5*cell);
    endShape(CLOSE);

    beginShape();
    vertex(8*cell, 0);
    vertex(9*cell, 0);
    vertex(9*cell, 3*cell);
    vertex(8*cell, 3*cell);
    vertex(8*cell, 0*cell);
    endShape(CLOSE);    
}

// Barn Quilt Pattern: Calico Puzzle
function drawCalicoPuzzle(colors) {
    let [c1, c2, c3] = colors; // c1 = corner background, c2 = cross, c3 = center
    let s = quiltSize;
    let third = s / 3;

    noStroke();

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let x = col * third;
            let y = row * third;

            // Center square
            if (row === 1 && col === 1) {
                fill(c3); // center color
                rect(x, y, third, third);
            }
            // Side squares (middle of top, bottom, left, right)
            else if (row === 1 || col === 1) {
                fill(c2); // cross color
                rect(x, y, third, third);
            }
            // Corner squares: background + correctly rotated triangle
            else {
                fill(c1);
                rect(x, y, third, third);

                fill(c3);
                push();
                translate(x, y);

                if (row === 0 && col === 0) {
                    // top-left — rotate triangle 90° CCW
                    triangle(0, 0, third, 0, third, third);
                } else if (row === 0 && col === 2) {
                    // top-right — rotate triangle 90° CW
                    triangle(third, 0, third, third, 0, third);
                } else if (row === 2 && col === 2) {
                    // bottom-right — rotate triangle 270° CW (or 90° CCW from top-right)
                    triangle(third, third, 0, third, 0, 0);
                } else if (row === 2 && col === 0) {
                    // bottom-left — rotate triangle 270° CCW (or 90° CW from top-left)
                    triangle(0, third, 0, 0, third, 0);
                }

                pop();
            }
        }
    }
}

// Barn Quilt Pattern: Broken Dishes
function drawBrokenDishes(colors) {
    let [c1, c2, c3] = colors;
    let s = quiltSize;
    let cell = s / 4;

    noStroke();
    
    fill(c2);
    rect(0, 0, s, s);

    fill(c1);
    triangle(0, 0, cell, 0, 0, cell);
    triangle(2*cell, 0, 3*cell, 0, 2*cell, cell);
    triangle(cell, cell, 2*cell, cell, cell, 2*cell);
    triangle(3*cell, cell, 4*cell, cell, 3*cell, 2*cell);
    triangle(0, 2*cell, cell, 2*cell, 0, 3*cell);
    triangle(2*cell, 2*cell, 3*cell, 2*cell, 2*cell, 3*cell);
    triangle(cell, 3*cell, 2*cell, 3*cell, cell, 4*cell);
    triangle(3*cell, 3*cell, 4*cell, 3*cell, 3*cell, 4*cell);
    
    fill(c3);
    triangle(3*cell, 0, 4*cell, 0, 4*cell, cell);
    triangle(1*cell, 0, 2*cell, 0, 2*cell, cell);
    triangle(3*cell, 0, 4*cell, 0, 4*cell, cell);
    triangle(0, 1*cell, 1*cell, 1*cell, 1*cell, 2*cell);
    triangle(2*cell, 1*cell, 3*cell, 1*cell, 3*cell, 2*cell);
    triangle(1*cell, 2*cell, 2*cell, 2*cell, 2*cell, 3*cell);
    triangle(3*cell, 2*cell, 4*cell, 2*cell, 4*cell, 3*cell);
    triangle(0, 3*cell, 1*cell, 3*cell, 1*cell, 4*cell);
    triangle(2*cell, 3*cell, 3*cell, 3*cell, 3*cell, 4*cell);
}

// Barn Quilt Pattern: Battleground Quilt
function drawBattlegroundQuilt(colors) {
    let [c1, c2, c3] = colors;
    let s = quiltSize;
    let cellSize = s / 6;

    noStroke();

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            let x = col * cellSize;
            let y = row * cellSize;

            fill(c1);
            triangle(x, y, x + cellSize, y, x, y + cellSize);

            if ((row + col) % 2 === 0) {
                fill(c2);
            } else {
                fill(c3);
            }
            triangle(x + cellSize, y, x + cellSize, y + cellSize, x, y + cellSize);
        }
    }
}

// Helper function to draw a 3x3 Nine Patch with two alternating colors
function drawTwoColorNinePatch(xOffset, yOffset, size, cA, cB) {
    let subThird = size / 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let sx = xOffset + (j * subThird);
            let sy = yOffset + (i * subThird);

            if ((i + j) % 2 === 0) {
                fill(cA);
            } else {
                fill(cB);
            }
            rect(sx, sy, subThird, subThird);
        }
    }
}

// Barn Quilt Pattern: Double Nine Patch
function drawDoubleNinePatch(colors) {
    let [c1, c2, c3] = colors;
    let s = quiltSize;
    let third = s / 3;

    noStroke();

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let x = col * third;
            let y = row * third;

            if ((row === 0 && col === 0) ||
                (row === 0 && col === 2) ||
                (row === 2 && col === 0) ||
                (row === 2 && col === 2) ||
                (row === 1 && col === 1)) {
                drawTwoColorNinePatch(x, y, third, c2, c3);
            } else {
                fill(c1);
                rect(x, y, third, third);
            }
        }
    }
}

// Barn Quilt Pattern: Ohio Star
function drawOhioStar(colors) {
    let [c1, c2, c3] = colors;
    let s = quiltSize;
    let third = s / 3;
    let halfThird = third / 2;

    noStroke();

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let x = col * third;
            let y = row * third;

            if (row === 1 && col === 1) {
                fill(c1);
                rect(x, y, third, third);
            }
            else if ((row === 0 && col === 0) ||
                     (row === 0 && col === 2) ||
                     (row === 2 && col === 0) ||
                     (row === 2 && col === 2)) {
                fill(c3);
                rect(x, y, third, third);
            }
            else {
                let cellCx = x + halfThird;
                let cellCy = y + halfThird;

                fill(c3);
                rect(x, y, third, third);

                if (row === 0 || row === 2) {
                    fill(c2);
                    triangle(x, y, x, y + third, cellCx, cellCy);
                    triangle(x + third, y, x + third, y + third, cellCx, cellCy);
                } else {
                    fill(c2);
                    triangle(x, y, x + third, y, cellCx, cellCy);
                    triangle(x, y + third, x + third, y + third, cellCx, cellCy);
                }
            }
        }
    }
}

// --- 4. Core Logic Functions (generateQuilt updated for pattern names) ---

// Function to choose a random pattern and draw it
function generateQuilt() {
    quiltSize = calculateQuiltSize();
    resizeCanvas(quiltSize, quiltSize);

    combinationId = random(Object.keys(wadaColorsData.combinations));
    // console.log(`combinationId: ${combinationId}`)
    currentCombination = wadaColorsData.combinations[combinationId];
    // console.log(`currentCombination: ${currentCombination}`)
    // const colorsForDrawing = currentCombination.colors.map(c => color(c.hex));
    // Shuffle the colors before passing them to the pattern function
    const shuffledColors = shuffleArray([...currentCombination]);
    // console.log(`shuffledColors: ${shuffledColors}`)

    const selectedPattern = random(quiltPatterns);

    const shuffledColorsHex = shuffledColors.map(id => wadaColorsData.colors[id].hex);
    background(255); // White background for the single block
    selectedPattern.func(shuffledColorsHex); // Draw the block with shuffled colors

    if (quiltNameElement) {
        quiltNameElement.textContent = `${selectedPattern.name} (Combo: ${combinationId})`;
    }

    updateColorDisplay(combinationId, shuffledColors);
    updateDynamicStyling(shuffledColors);
}

function generateNewQuilt() {

    currentCombinationId = random(Object.keys(wadaColorsData.combinations));
    currentCombination = wadaColorsData.combinations[currentCombinationId];
    currentShuffledColors = shuffleArray([...currentCombination]);
    currentPattern = random(quiltPatterns);
    
    console.log(`currentCombinationId: ${currentCombinationId}`)
    console.log(`currentCombination: ${currentCombination}`)
    console.log(`shuffledColors: ${currentShuffledColors}`)

    drawCurrentQuilt();
}

function drawCurrentQuilt() {
    quiltSize = calculateQuiltSize();
    resizeCanvas(quiltSize, quiltSize);

    background(255);

    const currentShuffledColorsHex = currentShuffledColors.map(
        id => wadaColorsData.colors[id].hex
    );

    if (quiltNameElement) {
        // quiltNameElement.textContent = `${currentPattern.name} (Combo: ${currentCombinationId})`;
    }

    currentPattern.func(currentShuffledColorsHex);

    updateColorDisplay(currentCombinationId, currentShuffledColors);
    updateDynamicStyling(currentShuffledColors);
}

// function resizeQuilt() {
//     quiltSize = calculateQuiltSize();
//     resizeCanvas(quiltSize, quiltSize);
//     drawCurrentQuilt();
// }

// --- 5. p5.js setup() and draw() (updated for new element) ---

function preload() {
    wadaColorsData = loadJSON("/assets/data/wada-colors.json");
}

function setup() {

    generateButton = document.getElementById("generateButton")
    generateButton.addEventListener("click", generateNewQuilt);

    quiltSize = calculateQuiltSize();
    quiltBlockCanvas = createCanvas();
    const canvas_container = document.getElementById("wada-quilts-canvas");
    
    quiltBlockCanvas.parent(canvas_container);
    
    document.getElementById("downloadButton").addEventListener("click", downloadQuilt);
    
    noLoop(); // Ensure draw() is called only when needed
    
    generateNewQuilt();

    new ResizeObserver(entries => {
        const w = entries[0].contentRect.width;
        console.log("observer", w);

        // resizeCanvas(w, w);
        // generateQuilt();
        drawCurrentQuilt();
        // resizeQuilt();
    }).observe(canvas_container);
    // generateNewQuilt();
}

// draw() function is now empty as generateQuilt() handles drawing and is called on demand.
function draw() {
    // No drawing here, all drawing is handled by generateQuilt() on demand.
}

function windowResized() {
    // quiltSize = calculateQuiltSize();
    // resizeCanvas(quiltSize, quiltSize);
    // generateQuilt();
    // resizeQuilt();
}
