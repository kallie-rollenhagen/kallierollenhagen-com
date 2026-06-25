// --- 1. Global Variables and Color Palettes ---
let wadaColorsData;
generateButton = document.getElementById("generateButton");
let downloadButton;
let singleQuiltButton; // Removed from previous version, now effectively "Generate Quilt Grids" button
let quiltBlockCanvas; // Reference to the p5.js canvas
let quiltSize;

function calculateQuiltSize() {
    const container = document.getElementById("wada-quilts-canvas");
    // console.log(`calculateQuiltSize: ${container.clientWidth}`);
    const canvasSize = container.getBoundingClientRect().width;
    padding = canvasSize * 0.03;
    individualQuiltBlockSize = (canvasSize - (3 * padding)) / 4;
    return {"canvasSize": canvasSize, "padding": padding, blockSize: individualQuiltBlockSize}
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

let currentCombinationId;
let currentCombination;
let currentShuffledColors;
let currentPattern;
let currentBlocksGrid = [];
let display_text = '';
let display_swatches = true;

const modeToggle = document.getElementById("modeToggle");
const gridOptionsWrapper = document.getElementById("grid-options-wrapper")
let currentMode = "single";

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
  { name: "Ohio Star", func: drawOhioStar },
  { name: "54-40 or Fight", func: drawFiftyFourForty },
  { name: "Apple Pie", func: drawApplePie },
  { name: "Dutchman's Puzzle", func: drawDutchmansPuzzle },
  { name: "Hovering Hawks", func: drawHoveringHawks },
  { name: "Grandmother's Puzzle", func: drawGrandmothersPuzzle },
  { name: "Clay's Choice", func: drawClaysChoice },
  { name: "Corn and Beans", func: drawCornAndBeans }
];

document
    .getElementById("grid-options")
    .addEventListener("change", event => {

        const size = Number(event.target.value);

        console.log("Grid size:", size);

        // redraw quilt grid
        // drawGrid(size);

    });

function setMode(mode) {
    currentMode = mode;

    modeToggle.classList.toggle("grid", mode === "grid");

    gridOptionsWrapper.classList.toggle("grid-mode", mode === "grid");

    modeToggle.querySelectorAll(".mode-option")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.mode === mode
            );
        });
    
        if (mode == "grid") {
            generateButton.textContent = "Generate Quilt Block Grid";
        } else {
            generateButton.textContent = "Generate Quilt Block";
        }

    console.log("Mode:", mode);

    // Your quilt generator logic here
    // drawSingleQuilt();
    // drawQuiltGrid();
}

// Clicking the labels
modeToggle.querySelectorAll(".mode-option")
    .forEach(button => {
        button.addEventListener("click", () => {
            setMode(button.dataset.mode);
        });
    });

// Clicking the switch itself
modeToggle.querySelector(".toggle-track")
    .addEventListener("click", () => {
        setMode(
            currentMode === "single"
                ? "grid"
                : "single"
        );
    });

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
function updateColorDisplay() {
    if (!combinationInfoSpan) {
        console.error("combinationInfoSpan not found for combination number update.");
        return;
    }
    combinationInfoSpan.innerHTML = display_text;
    const color_display = document.getElementById('color-display');

    color_display.classList.toggle("active", display_swatches == true);

    if (display_swatches == true) {
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

    } else {

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
function drawEconomyBlock(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
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
function drawShoofly(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
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
function drawNinePatch(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
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
function drawRailFence(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
    let blockDim = s / 3;
    let stripDim = blockDim / 3;

    const cell = s / 9;
    fill(c2);
    rect(0, 0, s, s);
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
function drawCalicoPuzzle(colors, size) {
    let [c1, c2, c3] = colors; // c1 = corner background, c2 = cross, c3 = center
    let s = size;
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
function drawBrokenDishes(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
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
function drawBattlegroundQuilt(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
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
function drawDoubleNinePatch(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
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
function drawOhioStar(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
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

function drawApplePie(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
    let cell = s / 6;

    noStroke();
    
    fill(c1);
    rect(0, 0, s, s);

    fill(c2);
    rect(2*cell, cell, 2*cell, cell);
    rect(2*cell, 4*cell, 2*cell, cell);
    rect(cell, 2*cell, cell, 2*cell);
    rect(4*cell, 2*cell, cell, 2*cell);
    
    fill(c3);
    triangle(0, 0, cell, cell, 0, 2*cell);
    triangle(cell, 0, 2*cell, cell, cell, 2*cell);
    triangle(4*cell, 0, 6*cell, 0, 5*cell, cell);
    triangle(4*cell, cell, 6*cell, cell, 5*cell, 2*cell);
    triangle(cell, 4*cell, 2*cell, 5*cell, 0, 5*cell);
    triangle(cell, 5*cell, 2*cell, 6*cell, 0, 6*cell);
    triangle(5*cell, 4*cell, 5*cell, 6*cell, 4*cell, 5*cell);
    triangle(6*cell, 4*cell, 6*cell, 6*cell, 5*cell, 5*cell);
    rect(2*cell, 2*cell, 2*cell, 2*cell);
}

function drawFiftyFourForty(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
    let cell = s / 6;

    noStroke();
    
    fill(c1);
    rect(0, 0, s, s);

    fill(c2);
    rect(cell, 0, cell, cell);
    rect(4* cell, 0, cell, cell);
    rect(0, cell, cell, cell);
    rect(5*cell, cell, cell, cell);
    rect(3*cell, 2*cell, cell, cell);
    rect(2*cell, 3*cell, cell, cell);
    rect(0, 4*cell, cell, cell);
    rect(5*cell, 4*cell, cell, cell);
    rect(cell, 5*cell, cell, cell);
    rect(4*cell, 5*cell, cell, cell);
    
    fill(c3);
    triangle(2*cell, 0, 3*cell, 2*cell, 2*cell, 2*cell);
    triangle(4*cell, 0, 4*cell, 2*cell, 3*cell, 2*cell);
    triangle(0, 2*cell, 2*cell, 2*cell, 2*cell, 3*cell);
    triangle(4*cell, 2*cell, 6*cell, 2*cell, 4*cell, 3*cell);
    triangle(2*cell, 3*cell, 2*cell, 4*cell, 0, 4*cell);
    triangle(4*cell, 3*cell, 6*cell, 4*cell, 4*cell, 4*cell);
    triangle(2*cell, 4*cell, 3*cell, 4*cell, 2*cell, 6*cell);
    triangle(3*cell, 4*cell, 4*cell, 4*cell, 4*cell, 6*cell);
}

function drawDutchmansPuzzle(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
    let cell = s / 4;

    noStroke();
    
    fill(c1);
    rect(0, 0, s, s);

    fill(c2);
    triangle(cell, 0, 2*cell, cell, 0, cell);
    triangle(3*cell, 0, 4*cell, cell, 3*cell, 2*cell);
    triangle(cell, 2*cell, cell, 4*cell, 0, 3*cell);
    triangle(2*cell, 3*cell, 4*cell, 3*cell, 3*cell, 4*cell);
    
    fill(c3);
    triangle(2*cell, 0, 3*cell, cell, 2*cell, 2*cell);
    triangle(cell, cell, 2*cell, 2*cell, 0, 2*cell);
    triangle(2*cell, 2*cell, 4*cell, 2*cell, 3*cell, 3*cell);
    triangle(2*cell, 2*cell, 2*cell, 4*cell, cell, 3*cell);
}

function drawHoveringHawks(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
    let cell = s / 4;

    noStroke();
    
    fill(c1);
    rect(0, 0, s, s);

    fill(c2);
    triangle(cell, 0, 2*cell, cell, cell, cell);
    triangle(2*cell, cell, 3*cell, 2*cell, 2*cell, 2*cell);
    triangle(3*cell, 2*cell, 4*cell, 3*cell, 3*cell, 3*cell);
    triangle(0, cell, cell, cell, cell, 2*cell);
    triangle(cell, 2*cell, 2*cell, 2*cell, 2*cell, 3*cell);
    triangle(2*cell, 3*cell, 3*cell, 3*cell, 3*cell, 4*cell);
    
    fill(c3);
    triangle(2*cell, 0, 3*cell, cell, 2*cell, cell);
    triangle(3*cell, cell, 4*cell, 2*cell, 3*cell, 2*cell);
    triangle(0, 2*cell, cell, 2*cell, cell, 3*cell);
    triangle(cell, 3*cell, 2*cell, 3*cell, 2*cell, 4*cell);
}

function drawGrandmothersPuzzle(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
    let cell = s / 5;

    noStroke();
    
    fill(c2);
    rect(0, 0, s, s);

    fill(c1);
    rect(0, 0, cell, cell);
    rect(4*cell, 0, cell, cell);
    rect(2*cell, 2*cell, cell, cell);
    rect(0, 4*cell, cell, cell);
    rect(4*cell, 4*cell, cell, cell);

    fill(c3);
    triangle(2*cell, 0, 2*cell, 2*cell, 0, 2*cell);
    triangle(2*cell, cell, 4*cell, cell, 4*cell, 3*cell);
    triangle(cell, 2*cell, 3*cell, 4*cell, cell, 4*cell);
    triangle(3*cell, 3*cell, 5*cell, 3*cell, 3*cell, 5*cell);
}

function drawClaysChoice(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
    let cell = s / 4;

    noStroke();
    
    fill(c3);
    rect(0, 0, s, s);

    fill(c1);
    rect(0, 0, cell, cell);
    rect(3*cell, 0, cell, cell);
    rect(0, 3*cell, cell, cell);
    rect(3*cell, 3*cell, cell, cell);
    triangle(cell, cell, 2*cell, 2*cell, cell, 2*cell);
    triangle(2*cell, cell, 3*cell, cell, 2*cell, 2*cell);
    triangle(2*cell, 2*cell, 2*cell, 3*cell, cell, 3*cell);
    triangle(2*cell, 2*cell, 3*cell, 2*cell, 3*cell, 3*cell);

    fill(c2);
    beginShape();
    vertex(cell, 0);
    vertex(2*cell, cell);
    vertex(2*cell, 2*cell);
    vertex(cell, cell);
    endShape(CLOSE);
    
    beginShape();
    vertex(3*cell, cell);
    vertex(4*cell, cell);
    vertex(3*cell, 2*cell);
    vertex(2*cell, 2*cell);
    endShape(CLOSE);
    
    beginShape();
    vertex(cell, 2*cell);
    vertex(2*cell, 2*cell);
    vertex(cell, 3*cell);
    vertex(0, 3*cell);
    endShape(CLOSE);
    
    beginShape();
    vertex(2*cell, 2*cell);
    vertex(3*cell, 3*cell);
    vertex(3*cell, 4*cell);
    vertex(2*cell, 3*cell);
    endShape(CLOSE);
}

function drawCornAndBeans(colors, size) {
    let [c1, c2, c3] = colors;
    let s = size;
    let cell = s / 6;

    noStroke();
    
    fill(c1);
    rect(0, 0, s, s);

    fill(c2);
    triangle(2*cell, 0, 2*cell, cell, cell, cell);
    triangle(4*cell, 0, 5*cell, cell, 4*cell, cell);
    triangle(cell, cell, cell, 2*cell, 0, 2*cell);
    triangle(5*cell, cell, 6*cell, 2*cell, 5*cell, 2*cell);
    triangle(3*cell, cell, 5*cell, 3*cell, 3*cell, 3*cell);
    triangle(cell, 3*cell, 3*cell, 3*cell, 3*cell, 5*cell);
    triangle(0, 4*cell, cell, 4*cell, cell, 5*cell);
    triangle(5*cell, 4*cell, 6*cell, 4*cell, 5*cell, 5*cell);
    triangle(cell, 5*cell, 2*cell, 5*cell, 2*cell, 6*cell);
    triangle(4*cell, 5*cell, 5*cell, 5*cell, 4*cell, 6*cell);

    fill(c3);
    triangle(3*cell, 0, 4*cell, cell, 2*cell, cell);
    triangle(2*cell, cell, 2*cell, 2*cell, cell, 2*cell);
    triangle(4*cell, cell, 5*cell, 2*cell, 4*cell, 2*cell);
    triangle(cell, 2*cell, cell, 4*cell, 0, 3*cell);
    triangle(5*cell, 2*cell, 6*cell, 3*cell, 5*cell, 4*cell);
    triangle(cell, 4*cell, 2*cell, 4*cell, 2*cell, 5*cell);
    triangle(4*cell, 4*cell, 5*cell, 4*cell, 4*cell, 5*cell);
    triangle(2*cell, 5*cell, 4*cell, 5*cell, 3*cell, 6*cell);
}
// --- 4. Core Logic Functions (generateQuilt updated for pattern names) ---

function generateQuilt() {

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
    quiltSize = calculateQuiltSize().canvasSize;
    resizeCanvas(quiltSize, quiltSize);

    background(255);

    const currentShuffledColorsHex = currentShuffledColors.map(
        id => wadaColorsData.colors[id].hex
    );

    if (quiltNameElement) {
        // quiltNameElement.textContent = `${currentPattern.name} (Combo: ${currentCombinationId})`;
    }

    currentPattern.func(currentShuffledColorsHex, quiltSize);

    display_text = `${currentPattern.name}<br>(Combination: ${currentCombinationId})`;
    display_swatches = true;

    updateColorDisplay();
}

function generateQuiltGridData() {
    const currentGridOption = document.getElementById("grid-options").value;
    let displayText = '';
    currentBlocksGrid.length = 0;
    
    if (currentGridOption == 1) {
        // Select random color
        currentCombinationId = random(Object.keys(wadaColorsData.combinations));
        currentCombination = wadaColorsData.combinations[currentCombinationId];
        currentShuffledColors = shuffleArray([...currentCombination]);
        const shuffledColorsHex = currentShuffledColors.map(id => wadaColorsData.colors[id].hex)
        const shuffledPatterns = shuffleArray(quiltPatterns);
        
        for (let i = 0; i < 16; i++) {
            const patternIndex = i % quiltPatterns.length;
            currentBlocksGrid.push({
                drawFunc: shuffledPatterns[patternIndex].func,
                colors: shuffledColorsHex
            });
        }
        display_text = `Color Combination: ${currentCombinationId}`;
        display_swatches = true;

    } else if (currentGridOption == 2) {
        const pattern = random(quiltPatterns);
        const shuffledCombinations = shuffleArray(Object.keys(wadaColorsData.combinations));
        console.log(shuffledCombinations)
        for (let i = 0; i < 16; i++) {
            const comboIndex = i;
            const combo = shuffledCombinations[comboIndex];
            const comboHex = wadaColorsData.combinations[combo].map(id => wadaColorsData.colors[id].hex)
            currentBlocksGrid.push({
                drawFunc: pattern.func,
                colors: comboHex
            });
        }

        display_text = `Pattern: ${currentPattern.name}`;
        display_swatches = false;

    } else {
        const shuffledPatterns = shuffleArray(quiltPatterns);
        const shuffledCombinations = shuffleArray(Object.keys(wadaColorsData.combinations));
        for (let i = 0; i < 16; i++) {
            const patternIndex = i % quiltPatterns.length;
            const comboIndex = i;
            const combo = shuffledCombinations[comboIndex];
            const comboHex = wadaColorsData.combinations[combo].map(id => wadaColorsData.colors[id].hex)
            currentBlocksGrid.push({
                drawFunc: shuffledPatterns[patternIndex].func,
                colors: comboHex
            });
        }
        display_text = `Mixed colors and patterns`;
        display_swatches = false
    }
}

function drawQuiltGrid() {

    sizeData = calculateQuiltSize();
    quiltSize = sizeData.canvasSize;
    const padding = sizeData.padding;
    const blockSize = sizeData.blockSize;
    resizeCanvas(quiltSize, quiltSize);

    console.log(`sizeData: ${quiltSize}, ${blockSize}, ${padding}`);
    
    let blockIndex = 0;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let x = + col * (blockSize + padding);
            let y = + row * (blockSize + padding);

            push();
            translate(x, y);
            
            let blockData = currentBlocksGrid[blockIndex];
            blockData.drawFunc(blockData.colors, blockSize);
            
            pop();
            blockIndex++;
        }
    }

    updateColorDisplay();
}

// --- 5. p5.js setup() and draw() (updated for new element) ---

function preload() {
    wadaColorsData = loadJSON("/assets/data/wada-colors.json");
}

function setup() {

    generateButton.addEventListener("click", () => {
        if (currentMode === "single") {
            generateQuilt();
        } else {
            generateQuiltGridData();
            drawQuiltGrid();
        }
    });

    // quiltSize = calculateQuiltSize().canvasSize;
    quiltBlockCanvas = createCanvas();
    const canvas_container = document.getElementById("wada-quilts-canvas");
    
    quiltBlockCanvas.parent(canvas_container);
    
    document.getElementById("downloadButton").addEventListener("click", downloadQuilt);
    
    noLoop(); // Ensure draw() is called only when needed
    
    generateQuilt();

    new ResizeObserver(entries => {
        const w = entries[0].contentRect.width;
        console.log("observer", w);
        if (currentMode === "single") {
            drawCurrentQuilt();
        } else {
            drawQuiltGrid();
        }
    }).observe(canvas_container);
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
