// --- 1. Global Variables and Color Palettes ---
let generateButton;
let downloadButton;
let singleQuiltButton; // Removed from previous version, now effectively "Generate Quilt Grids" button
let quiltBlockCanvas; // Reference to the p5.js canvas
let quiltSize;

function calculateQuiltSize() {
  return min(windowWidth * 0.9, 672);
}

let mainContentWrapper;
let leftPanel;
let centerPanel;
let bottomButtonsWrapper; // New wrapper for bottom buttons

let h1Element;
let introParagraphElement;
let quiltNameElement; // Will display the name of the generated quilt block

let colorSwatches = []; // Re-added: For displaying color palette swatches
let combinationInfoSpan; // Re-added: For displaying combo number

// Sanzo Wada 3-color combinations (a subset for demonstration)
const colorPalettes = [
  { comboNumber: 221, colors: [
      { name: "Black", hex: "#000000" },
      { name: "Carmine Red", hex: "#a10b2b" },
      { name: "Neutral Gray", hex: "#b5d1cc" }
  ] },
  { comboNumber: 222, colors: [
      { name: "Yellow Orange", hex: "#ff8c00" },
      { name: "Yellow Ochre", hex: "#E0b81f" },
      { name: "Orange Rufous", hex: "#C05200" }
  ] },
  { comboNumber: 223, colors: [
      { name: "Light Brown Drab", hex: "#b08699" },
      { name: "Ochraceaous Salmon", hex: "#d99e73" },
      { name: "Turquoise Green", hex: "#b5ffc2" }
  ] },
  { comboNumber: 224, colors: [
      { name: "Dark Medici Blue", hex: "#417777" },
      { name: "Spinel Red", hex: "#ff4dc9" },
      { name: "Taupe Brown", hex: "#6b2e63" }
  ] },
  { comboNumber: 225, colors: [
      { name: "Dark Slate Purple", hex: "#53225c" },
      { name: "Dusky Green", "hex": "#00592e" },
      { name: "Carmine", hex: "#d60036" }
  ] },
  { comboNumber: 229, colors: [
      { name: "Neutral Gray", hex: "#b5d1cc" },
      { name: "Deep Slate Olive", hex: "#172713" },
      { name: "Golden Yellow", hex: "#fa9442" }
  ] },
  { comboNumber: 230, colors: [
      { name: "Grenadine Pink", hex: "#ff616b" },
      { name: "Turquoise Green", hex: "#b5ffc2" },
      { name: "Cobalt Green", hex: "#94ff94" }] },
  { comboNumber: 231, colors: [
      { name: "Hay's Russet", hex: "#681916" },
      { name: "Cameo Pink", hex: "#e6adcf" },
      { name: "Olympic Blue", hex: "#005266" }] },
  { comboNumber: 232, colors: [
      { name: "Deep Indigo", hex: "#000831" },
      { name: "Carmine", hex: "#d60036" },
      { name: "Pinkish Cinnamon", hex: "#f2ad78" }]
  },
  { comboNumber: 233, colors: [
      { name: "Violet Blue", hex: "#202d85" },
      { name: "Carmine Red", hex: "#a10b2b" },
      { name: "Buffy Citrine", hex: "#888d2a" }
  ] },
  { comboNumber: 234, colors: [
    { name: "Pale King's Blue", hex: "#abf5ed" },
    { name: "Pale Raw Umber", hex: "#5e4017" },
    { name: "Cinnamon Buff", hex: "#ffbf6e" }
  ] },
  { comboNumber: 153, colors: [
    { name: "Eosine Pink", hex: "#f37f94" },
    { name: "Orange Yellow", hex: "#fcb315" },
    { name: "Citron Yellow", hex: "#b2b73e" }
  ] },
  { comboNumber: 156, colors: [
    { name: "Violet", hex: "#4f4086" },
    { name: "Olive Ocher", hex: "#d6b43e" },
    { name: "Cobalt Green", hex: "#96d1aa" }
  ] },
  { comboNumber: 159, colors: [
    { name: "Khaki", hex: "#bc892b" },
    { name: "Calamine Blue", hex: "#78cdd0" },
    { name: "Grayish Lavender", hex: "#b5b1d8" }
  ] },
  { comboNumber: 163, colors: [
    { name: "Turquoise Green", hex: "#b5decc" },
    { name: "Antwarp Blue", hex: "#007190" },
    { name: "Apricot Yellow", hex: "#ffdd00" }
  ] },
  { comboNumber: 191, colors: [
    { name: "Light Brown Drab", hex: "#B08699" },
    { name: "Yellow Ocher", hex: "#e0b81f" },
    { name: "Blue", hex: "#0d75ff" }
  ] },
  { comboNumber: 203, colors: [
    { name: "Pale Lemon Yellow", hex: "#fff59e" },
    { name: "Vinaceous Cinnamon", hex: "#f59994" },
    { name: "Lincoln Green", hex: "#405416" }
  ] },
  { comboNumber: 239, colors: [
    { name: "Pyrite Yellow", hex: "#C4bf33" },
    { name: "Light Brown Drab", hex: "#B08699" },
    { name: "Glaucous Green", hex: "#b3e8c2" }
  ] },
  { comboNumber: 167, colors: [
    { name: "Ecru", hex: "#c0b490" },
    { name: "Pale King's Blue", hex: "#abf5ed" },
    { name: "Vandar Poel's Blue", hex: "#003e83" }
  ] },
  { comboNumber: 168, colors: [
    { name: "Veronia Purple", hex: "#7e3075" },
    { name: "Lemon Yellow", hex: "#f2ff26" },
    { name: "Vandar Poel's Blue", hex: "#003e83" }
  ] },
  { comboNumber: 175, colors: [
    { name: "Blue Violet", hex: "#4733ff" },
    { name: "Pinkish Cinnamon", hex: "#f2ad78" },
    { name: "Olive Buff", hex: "#bcd382" }
  ] },
  { comboNumber: 177, colors: [
    { name: "Buffy Citrine", hex: "#888d2a" },
    { name: "Grayish Lavendar -A", hex: "#b8b8ff" },
    { name: "Pale Burnt Lake", hex: "#730f1f" }
  ] },
    { comboNumber: 189, colors: [
    { name: "Lemon Yellow", hex: "#f2ff26" },
    { name: "Deep Slate Olive", hex: "#172713" },
    { name: "Venice Green", hex: "#6bffb3" }
  ] },
  { comboNumber: 196, colors: [
    { name: "Blue Violet", hex: "#4733ff" },
    { name: "Citron Yellow", hex: "#a6d40d" },
    { name: "Pale King's Blue", hex: "#abf5ed" }
  ] },
  { comboNumber: 199, colors: [
    { name: "Ocher Red", hex: "#a7374b" },
    { name: "Light Brownish Olive", hex: "#172713" },
    { name: "Deep Lyons Blue", hex: "#0024cc" }
  ] },
  { comboNumber: 213, colors: [
    { name: "Vinaceous Cinnamon", hex: "#f59994" },
    { name: "Apricot Yellow", hex: "#ffe600" },
    { name: "Pale King's Blue", hex: "#abf5ed" }
  ] }
];

let currentCombination; // To store the currently selected combination object

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
function updateColorDisplay(combination) {
    if (!combinationInfoSpan) {
        console.error("combinationInfoSpan not found for combination number update.");
        return;
    }
    combinationInfoSpan.html(combination.comboNumber);

    for (let i = 0; i < combination.colors.length; i++) {
        const swatch = colorSwatches[i];
        const colorData = combination.colors[i];

        if (!swatch) {
            console.error(`Color swatch element at index ${i} is null or undefined.`);
            continue;
        }

        swatch.style('background-color', colorData.hex);

        const textColorForSwatch = getAccessibleTextColor(colorData.hex, 4.5);
        swatch.html(''); // Clear previous content

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
function updateDynamicStyling(colorObjects) {
    const c1_hex = colorObjects[0].hex;
    const c2_hex = colorObjects[1].hex; // Used for download button
    const c3_hex = colorObjects[2].hex; // Used for right panel background and info text

    // Apply background color to the main content wrapper
    const mainContentWrapper = select('#main-content-wrapper');
    if (mainContentWrapper) mainContentWrapper.style('background-color', 'transparent'); // Kept transparent as body is white

    // Left panel text (static colors)
    if (h1Element) h1Element.style('color', '#333');
    if (introParagraphElement) introParagraphElement.style('color', '#555');
    if (quiltNameElement) quiltNameElement.style('color', '#333');

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
        generateButton.style('background-color', generateBtnColor);
        const generateButtonTextColor = getAccessibleTextColor(generateBtnColor, 4.5);
        generateButton.style('color', generateButtonTextColor);
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

    fill(c1);
    noStroke();
    rect(0, 0, s, s);

    fill(c3);
    rect(quarter, quarter, half, half);

    fill(c2);
    triangle(0, 0, half, 0, quarter, quarter);
    triangle(0, 0, 0, half, quarter, quarter);
    triangle(half, 0, s, 0, s - quarter, quarter);
    triangle(s, 0, s, half, s - quarter, quarter);
    triangle(half, s, s, s, s - quarter, s - quarter);
    triangle(s, s, s, half, s - quarter, s - quarter);
    triangle(0, half, 0, s, quarter, s - quarter);
    triangle(0, s, half, s, quarter, s - quarter);
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

    noStroke();
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let xOffset = col * blockDim;
            let yOffset = row * blockDim;

            if ((row + col) % 2 === 0) { // Vertical strips within the block
                for (let i = 0; i < 3; i++) {
                    fill(colors[i % 3]);
                    rect(xOffset + (i * stripDim), yOffset, stripDim, blockDim);
                }
            } else { // Horizontal strips within the block
                for (let i = 0; i < 3; i++) {
                    fill(colors[i % 3]);
                    rect(xOffset, yOffset + (i * stripDim), blockDim, stripDim);
                }
            }
        }
    }
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
    let smallCell = s / 4;

    noStroke();

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let cx = j * smallCell;
            let cy = i * smallCell;

            if ((i + j) % 2 === 0) {
                fill(c1);
                triangle(cx, cy, cx + smallCell, cy, cx, cy + smallCell);
                fill(c2);
                triangle(cx + smallCell, cy, cx + smallCell, cy + smallCell, cx, cy + smallCell);
            } else {
                fill(c2);
                triangle(cx, cy + smallCell, cx, cy, cx + smallCell, cy + smallCell);
                fill(c3);
                triangle(cx + smallCell, cy + smallCell, cx + smallCell, cy, cx, cy);
            }
        }
    }
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

    currentCombination = random(colorPalettes);
    const colorsForDrawing = currentCombination.colors.map(c => color(c.hex));
    // Shuffle the colors before passing them to the pattern function
    const shuffledColors = shuffleArray([...colorsForDrawing]);

    const selectedPattern = random(quiltPatterns);

    background(255); // White background for the single block
    selectedPattern.func(shuffledColors); // Draw the block with shuffled colors

    if (quiltNameElement) {
        quiltNameElement.html(`${selectedPattern.name} (Combo: ${currentCombination.comboNumber})`);
    }

    updateColorDisplay(currentCombination); // Re-added: Update the color swatches
    updateDynamicStyling(currentCombination.colors);
}

// --- 5. p5.js setup() and draw() (updated for new element) ---

function setup() {
    // Inject custom CSS for global styling
    const styleElement = document.createElement('style');
    styleElement.textContent = `
    body {
        display: flex;
        justify-content: center;
        align-items: flex-start; /* Align to the top */
        min-height: 100vh;
        margin: 0;
        background-color: #FFFFFF; /* Entire background is white */
        padding: 0; /* Removed body padding to allow main-content-wrapper to control it */
        box-sizing: border-box;
        font-family: 'DM Mono', monospace;
        overflow-x: hidden;
    }

    #main-content-wrapper {
        display: flex;
        gap: 20px;
        width: 100%;
        max-width: 1400px;
        background-color: transparent; /* No background color here */
        box-shadow: none; /* No shadow */
        align-items: flex-start; /* Ensure panels align at the top */
        padding: 20px; /* Overall padding for the content area */
    }

    #left-panel, #center-panel, #right-panel { /* Added right-panel back here */
        padding: 0px 20px; /* Adjust horizontal padding for alignment with header. Vertical padding is managed by element margins */
        background-color: transparent; /* Panels blend into the white background */
        border-radius: 8px;
        box-shadow: none; /* No shadow on panels */
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* Left align content */
        justify-content: flex-start; /* Align content to the top */
    }

    #left-panel {
        flex: 1;
        min-width: 250px;
        max-width: 300px; /* Constrain left panel width for better layout */
        /* min-height calculated to match center-panel's content height for bottom alignment */
        min-height: calc(${quiltSize}px + 15px + 24px); /* quiltSize + quiltNameElement margin-top + quiltNameElement height */
    }

    #center-panel {
        flex: 2;
        align-items: center; /* Center canvas horizontally */
        min-width: 300px;
        justify-content: flex-start; /* Align content to the top within center panel */
        padding-top: 0; /* Make canvas flush with left-panel's h1 */
    }

    #right-panel { /* Re-added right panel styles */
        flex: 0 0 250px; /* Fixed width for right panel */
        display: flex;
        flex-direction: column;
        align-items: center; /* Center content in right panel */
        justify-content: flex-start; /* Top align content */
        padding: 20px; /* Padding inside the right panel */
        box-shadow: none; /* Removed shadow */
        background-color: transparent; /* Changed to transparent background */
    }

    h1 {
        font-size: 2em;
        margin-top: 0;
        margin-bottom: 10px;
        text-align: left;
        width: 100%;
        color: #333; /* Static color for dark text on white background */
    }

    #intro-paragraph {
        font-size: 0.9em;
        line-height: 1.5;
        margin-bottom: 20px;
        text-align: left;
        width: 100%;
        color: #555; /* Static color */
    }

    #quilt-name {
        font-size: 1.5em;
        font-weight: bold;
        margin-top: 15px; /* Margin above text below canvas */
        margin-bottom: 0; /* No margin below if it's the last element after canvas */
        text-align: center;
        width: 100%;
        color: #333; /* Static color */
    }

canvas {
    max-width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    display: block;
}

    /* Styles for all buttons, maintaining consistency */
    button {
        padding: 12px 20px; /* Consistent padding for all buttons */
        font-size: 1.1em; /* Consistent font size for all buttons */
        margin: 5px 0; /* Vertical margin */
        cursor: pointer;
        border: none;
        border-radius: 5px;
        transition: background-color 0.3s ease, color 0.3s ease;
        font-family: 'DM Mono', monospace;
        white-space: normal; /* Allow text to wrap if needed */
        text-align: center; /* Center text within buttons */
        width: 100%;
        max-width: 260px; /* Consistent max-width for buttons */
        box-sizing: border-box;
        line-height: 1.2; /* Adjust line height for wrapped text */
    }

    /* Specific overrides for button text fitting */
    #generateButton {
        font-size: 1.1em;
    }
    #generateGridButton, #downloadButton { /* Apply same text size to these two */
        font-size: 1.0em;
    }


    /* Custom styles for generate button */
    #generateButton {
        margin-top: 10px; /* Space from intro text */
        background-color: var(--generate-button-bg); /* Now dynamic */
        color: var(--generate-button-color); /* Now dynamic */
    }
    #generateButton:hover {
        background-color: var(--generate-button-hover-bg);
        color: var(--generate-button-hover-color);
    }

    /* New wrapper for bottom buttons */
    #bottom-buttons-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        margin-top: auto; /* Pushes this wrapper to the bottom of left-panel */
    }

    /* Custom styles for generate grid button */
    #generateGridButton {
        background-color: var(--generate-grid-button-bg); /* Now dynamic */
        color: var(--generate-grid-button-color); /* Now dynamic */
        margin-top: 15px; /* Space from generate button (if not in wrapper) or other content */
    }
    #generateGridButton:hover {
        background-color: var(--generate-grid-button-hover-bg);
        color: var(--generate-grid-button-hover-color);
    }

    /* Custom styles for download button - now in left-panel */
    #downloadButton {
        background-color: var(--download-button-bg); /* Now dynamic */
        color: var(--download-button-color); /* Now dynamic */
        margin-top: 5px; /* Small space between single quilt button and download button */
    }
    #downloadButton:hover {
        background-color: var(--download-button-hover-bg);
        color: var(--download-button-hover-color);
    }

    /* Styles for color swatch display */
    #combination-info {
        font-size: 1.1em;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
        width: 100%;
        transition: color 0.5s ease;
        color: #333; /* Static color for readability on transparent background */
    }

    #color-display {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        margin-top: 20px;
        width: 100%;
    }

    .color-swatch {
        width: 120px; /* Smaller swatch size for better fit */
        height: 120px;
        border: 1px solid #aaa;
        border-radius: 4px;
        box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 0.8em;
        text-align: center;
        line-height: 1.3;
        padding: 10px; /* Adjusted padding */
        box-sizing: border-box;
        white-space: normal; /* Allow text to wrap */
        word-break: break-word; /* Break long words */
    }
    .color-text {
        margin: 2px 0; /* Space between name and hex */
    }

    /* Media Queries for Responsiveness */
    @media (max-width: 1000px) {
        #main-content-wrapper {
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        #left-panel, #center-panel, #right-panel { /* Include right-panel for mobile stacking */
            width: 100%;
            max-width: 600px;
            padding: 15px; /* Re-introduce some padding for mobile panels */
            box-shadow: none;
            align-items: center; /* Center content within panels on mobile */
            min-height: auto; /* Remove fixed min-height for mobile */
        }
        
        h1, #intro-paragraph, #generateButton, #generateGridButton, #downloadButton, #combination-info { /* Include combination-info */
            text-align: center;
            align-self: center;
            max-width: 90%;
        }
        #generateButton, #generateGridButton, #downloadButton {
            margin-top: 15px; /* Add margin when stacked on mobile */
        }
        #bottom-buttons-wrapper {
            margin-top: 20px; /* Add some space when stacked on mobile */
            align-items: center; /* Center buttons within wrapper on mobile */
        }
        #color-display {
            flex-direction: row; /* Display swatches in a row on mobile */
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px; /* Smaller gap for mobile */
            width: auto; /* Allow content to dictate width */
        }
        .color-swatch {
            width: 90px; /* Smaller swatches for mobile */
            height: 90px;
            font-size: 0.7em;
            padding: 5px;
        }
    }

    @media (max-width: 600px) {
        body {
            padding: 10px;
        }
        h1 {
            font-size: 1.8em;
        }
        #intro-paragraph {
            font-size: 0.8em;
        }
        button {
            font-size: 14px;
            padding: 8px 15px;
            max-width: 95%;
        }
        #generateButton {
            font-size: 1em;
            padding: 10px 20px;
        }
        #quilt-name {
            font-size: 1.2em;
        }
    }
    `;
    document.head.appendChild(styleElement);

    // Load Google Fonts
    const linkElement = document.createElement('link');
    linkElement.href = 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap';
    linkElement.rel = 'stylesheet';
    document.head.appendChild(linkElement);

    // Create the main content wrapper
    mainContentWrapper = createDiv('');
    mainContentWrapper.id('main-content-wrapper');

    // Create left panel
    leftPanel = createDiv('');
    leftPanel.id('left-panel');
    leftPanel.parent(mainContentWrapper);

    h1Element = createElement('h1', 'Wada Quilt Block Generator'); // Updated header text
    h1Element.parent(leftPanel);

    introParagraphElement = createElement('p', 'This design tool pulls on classic quilt patterns and overlays color patterns from Sanzo Wada\'s Dictionary of Color Combinations, Volume 2. It was created by Kallie Rollenhagen, with generous assistance by Google Gemini.'); // Updated intro text
    introParagraphElement.id('intro-paragraph');
    introParagraphElement.parent(leftPanel);

    // Create the "Generate New Quilt" button (moved to left panel, under intro text)
    generateButton = createButton('Generate New Quilt Block');
    generateButton.id('generateButton');
    generateButton.parent(leftPanel);
    generateButton.mousePressed(generateQuilt); // Call the single quilt generation function

    // Create center panel
    centerPanel = createDiv('');
    centerPanel.id('center-panel');
    centerPanel.parent(mainContentWrapper);

    // Create the quilt block canvas
    quiltSize = calculateQuiltSize();
    quiltBlockCanvas = createCanvas(quiltSize, quiltSize);
    quiltBlockCanvas.parent(centerPanel);

    // Create the quilt name element (moved below canvas)
    quiltNameElement = createElement('p', 'Quilt Block Name'); // Initial text
    quiltNameElement.id('quilt-name');
    quiltNameElement.parent(centerPanel); // Parented to centerPanel, now after canvas

    // Create right panel for color swatches
    let rightPanel = createDiv('');
    rightPanel.id('right-panel');
    rightPanel.parent(mainContentWrapper);

    // Create "Combination Info" heading and span
    let combinationInfoElement = createElement('p', 'Combination: ');
    combinationInfoElement.id('combination-info');
    combinationInfoElement.parent(rightPanel);
    combinationInfoSpan = createSpan('N/A'); // Re-added global variable
    combinationInfoSpan.parent(combinationInfoElement);

    // Create color swatch containers
    let colorDisplayDiv = createDiv();
    colorDisplayDiv.id('color-display');
    colorDisplayDiv.parent(rightPanel);
    
    for (let i = 0; i < 3; i++) {
        let swatch = createDiv();
        swatch.class('color-swatch');
        swatch.parent(colorDisplayDiv);
        colorSwatches.push(swatch); // Re-added to global array
    }

    // Create a wrapper for the bottom buttons
    bottomButtonsWrapper = createDiv('');
    bottomButtonsWrapper.id('bottom-buttons-wrapper');
    bottomButtonsWrapper.parent(leftPanel);

    // Create the "Generate Quilt Grids" button (links to the other page)
    singleQuiltButton = createButton('Generate Quilt Grids'); // Renamed to accurately reflect its purpose
    singleQuiltButton.id('generateGridButton'); // New ID
    singleQuiltButton.parent(bottomButtonsWrapper); // Parented to new wrapper
    singleQuiltButton.mousePressed(() => window.open('https://editor.p5js.org/kallierollenhagen/full/rCfqz4SPD', '_blank')); // Link to grid page

    // Create the "Download Quilt" button
    downloadButton = createButton('Download Quilt Block'); // Updated text
    downloadButton.id('downloadButton');
    downloadButton.parent(bottomButtonsWrapper); // Parented to new wrapper
    downloadButton.mousePressed(downloadQuilt);

    noLoop(); // Ensure draw() is called only when needed

    // Generate initial quilt block
    generateQuilt();
}

// draw() function is now empty as generateQuilt() handles drawing and is called on demand.
function draw() {
    // No drawing here, all drawing is handled by generateQuilt() on demand.
}

function windowResized() {
  quiltSize = calculateQuiltSize();
  resizeCanvas(quiltSize, quiltSize);

  if (currentCombination) {
    generateQuilt();
  }
}
