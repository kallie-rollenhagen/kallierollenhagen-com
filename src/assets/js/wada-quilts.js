// --- 1. Global Variables and Color Palettes ---
let wadaColorsData;
generateButton = document.getElementById("generateButton");
let downloadButton;
let singleQuiltButton; // Removed from previous version, now effectively "Generate Quilt Grids" button
let quiltBlockCanvas; // Reference to the p5.js canvas
let quiltSize;
let firstTime = true;
const SAMPLE_COUNT = 16;
let isAnimating = false;
let backgroundColor = "#FAFAFA";

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

const geometryCache = new Map();
let nextColorComboID;
let nextColorCombo;
let nextShuffledColors;
let nextShuffledColorsHex;
let currentShuffledColorsHex = [backgroundColor, backgroundColor, backgroundColor];

let nextPattern;
let currentBlocksGrid = [];
let display_text = '';
let display_swatches = true;
let fileName = '';
let scaleSize = 5;
let animationProgress;
let transitionalShapesMapping;

const modeToggle = document.getElementById("modeToggle");
const gridOptionsWrapper = document.getElementById("grid-options-wrapper")
let currentMode = "single";

let example;

const quiltPatternsList = [
    {
        name: "Air Castle",
        divisions: 6,
        shapes: [
            {
                type: "triangle",
                points: [[0, 0], [2, 0], [0, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [4, 0], [3, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 0], [6, 0], [6, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 2], [1, 3], [0, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 2], [3, 2], [2, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 2], [4, 2], [4, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6, 2], [6, 4], [5, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 3], [3, 4], [2, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 3], [4, 4], [3, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 4], [2, 6], [0, 6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 5], [4, 6], [2, 6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6, 4], [6, 6], [4, 6]],
                color: 0
            },
            {
                type: "polygon",
                points: [[2, 0], [3, 1], [2, 2], [0, 2]],
                color: 1
            },
            {
                type: "polygon",
                points: [[4, 0], [6, 2], [5, 3], [4, 2]],
                color: 1
            },
            {
                type: "polygon",
                points: [[1, 3], [2, 4], [2, 6], [0, 4]],
                color: 1
            },
            {
                type: "polygon",
                points: [[4, 4], [6, 4], [4, 6], [3, 5]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4, 0], [4, 2], [2, 2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[0, 2], [2, 2], [2, 4]],
                color: 2
            },
            {
                type: "rect",
                points: [[3, 2], [4, 3], [3, 4], [2, 3]],
                color: 2
            },
            {
                type: "triangle",
                points: [[4, 2], [6, 4], [4, 4]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2, 4], [4, 4], [2, 6]],
                color: 2
            }
        ]
    },
    {
        name: "Grandmother's Puzzle",
        divisions: 5,
        shapes: [
            {
                type: "rect",
                points: [[0, 0], [1, 0], [1, 1], [0, 1]],
                color: 0
            },
            {
                type: "rect",
                points: [[4, 0], [5, 0], [5, 1], [4, 1]],
                color: 0
            },
            {
                type: "rect",
                points: [[2, 2], [3, 2], [3, 3], [2, 3]],
                color: 0
            },
            {
                type: "rect",
                points: [[0, 4], [1, 4], [1, 5], [0, 5]],
                color: 0
            },
            {
                type: "rect",
                points: [[4, 4], [5, 4], [5, 5], [4, 5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 0], [2, 0], [1, 1]],
                color: 1
            },
            {
                type: "rect",
                points: [[2, 0], [4, 0], [4, 1], [2, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[0, 1], [1, 1], [0, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 1], [3, 2], [2, 2]],
                color: 1
            },
            {
                type: "rect",
                points: [[4, 1], [5, 1], [5, 3], [4, 3]],
                color: 1
            },
            {
                type: "rect",
                points: [[0, 2], [1, 2], [1, 4], [0, 4]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1, 2], [2, 2], [2, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[3, 2], [4, 3], [3, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 3], [3, 3], [3, 4]],
                color: 1
            },
            {
                type: "triangle",
                points: [[5, 3], [5, 4], [4, 4]],
                color: 1
            },
            {
                type: "rect",
                points: [[1, 4], [3, 4], [3, 5], [1, 5]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4, 4], [4, 5], [3, 5]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 0], [2, 2], [0, 2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2, 1], [4, 1], [4, 3]],
                color: 2
            },
            {
                type: "triangle",
                points: [[1, 2], [3, 4], [1, 4]],
                color: 2
            },
            {
                type: "triangle",
                points: [[3, 3], [5, 3], [3, 5]],
                color: 2
            },
        ]
    },
    {
        name: "Corn and Beans",
        divisions: 6,
        shapes: [
            {
                type: "triangle",
                points: [[0, 0], [2, 0], [0, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [3, 0], [2, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 0], [4, 0], [4, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 0], [6, 0], [6, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 1], [2, 1], [1, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 1], [4, 1], [4, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 1], [5, 1], [5, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 2], [1, 2], [0, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 2], [5, 2], [5, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[5, 2], [6, 2], [6, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 3], [1, 4], [0, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 3], [2, 4], [1, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6, 3], [6, 4], [5, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 4], [2, 6], [0, 6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 4], [2, 5], [1, 5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 4], [3, 5], [2, 5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[5, 4], [5, 5], [4, 5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 5], [3, 6], [2, 6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 5], [4, 6], [3, 6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6, 4], [6, 6], [4, 6]],
                color: 0
            },
            {
                type: "polygon",
                points: [[2, 1], [3, 1], [3, 3], [1, 3], [1, 2], [2, 2], [2, 1]],
                color: 0
            },
            {
                type: "polygon",
                points: [[3, 3], [5, 3], [5, 4], [4, 4], [4, 5], [3, 5], [3, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [2, 1], [1, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4, 0], [5, 1], [4, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1, 1], [1, 2], [0, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[3, 1], [5, 3], [3, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[5, 1], [6, 2], [5, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1, 3], [3, 3], [3, 5]],
                color: 1
            },
            {
                type: "triangle",
                points: [[0, 4], [1, 4], [1, 5]],
                color: 1
            },
            {
                type: "triangle",
                points: [[5, 4], [6, 4], [5, 5]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1, 5], [2, 5], [2, 6]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4, 5], [5, 5], [4, 6]],
                color: 1
            },
            {
                type: "triangle",
                points: [[3, 0], [4, 1], [2, 1]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2, 1], [2, 2], [1, 2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[4, 1], [5, 2], [4, 2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[1, 2], [1, 4], [0, 3]],
                color: 2
            },
            {
                type: "triangle",
                points: [[5, 2], [6, 3], [5, 4]],
                color: 2
            },
            {
                type: "triangle",
                points: [[1, 4], [2, 4], [2, 5]],
                color: 2
            },
            {
                type: "triangle",
                points: [[4, 4], [5, 4], [4, 5]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2, 5], [4, 5], [3, 6]],
                color: 2
            }
        ]
    },
    {
        name: "Hovering Hawks",
        divisions: 4,
        shapes: [
            {
                type: "rect",
                points: [[0, 0], [1, 0], [1, 1], [0, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 0], [2, 0], [2, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [4, 0], [4, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 1], [1, 2], [0, 2]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[1, 1], [2, 1], [2, 2], [1, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 1], [3, 1], [3, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 2], [2, 4], [0, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 2], [2, 3], [1, 3]],
                color: 0
            },
            {
                type: "rect",
                points: [[2, 2], [3, 2], [3, 3], [2, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 2], [4, 2], [4, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 3], [3, 4], [2, 4]],
                color: 0
            },
            {
                type: "rect",
                points: [[3, 3], [4, 3], [4, 4], [3, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 0], [2, 1], [1, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[0, 1], [1, 1], [1, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 1], [3, 2], [2, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1, 2], [2, 2], [2, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[3, 2], [4, 3], [3, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 3], [3, 3], [3, 4]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 0], [3, 1], [2, 1]],
                color: 2
            },
            {
                type: "triangle",
                points: [[3, 1], [4, 2], [3, 2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[0, 2], [1, 2], [1, 3]],
                color: 2
            },
            {
                type: "triangle",
                points: [[1, 3], [2, 3], [2, 4]],
                color: 2
            }
        ]
    },
    {
        name: "Broken Dishes",
        divisions: 4,
        shapes: [
            {
                type: "triangle",
                points: [[0, 0], [1, 0], [0, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [3, 0], [2, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 1], [2, 1], [1, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 1], [4, 1], [3, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 2], [1, 2], [0, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 2], [3, 2], [2, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 3], [2, 3], [1, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 3], [4, 3], [3, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 0], [2, 1], [0, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[3, 0], [4, 1], [2, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[0, 1], [1, 2], [0, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 1], [3, 2], [1, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4, 1], [4, 2], [3, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1, 2], [2, 3], [0, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[3, 2], [4, 3], [2, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[0, 3], [1, 4], [0, 4]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 3], [3, 4], [1, 4]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4, 3], [4, 4], [3, 4]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1, 0], [2, 0], [2, 1]],
                color: 2
            },
            {
                type: "triangle",
                points: [[3, 0], [4, 0], [4, 1]],
                color: 2
            },
            {
                type: "triangle",
                points: [[0, 1], [1, 1], [1, 2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2, 1], [3, 1], [3, 2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[1, 2], [2, 2], [2, 3]],
                color: 2
            },
            {
                type: "triangle",
                points: [[3, 2], [4, 2], [4, 3]],
                color: 2
            },
            {
                type: "triangle",
                points: [[0, 3], [1, 3], [1, 4]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2, 3], [3, 3], [3, 4]],
                color: 2
            },
        ]
    },
    {
        name: "Rail Fence",
        divisions: 9,
        shapes: [
            {
                type: "polygon",
                points: [[0, 0], [1, 0], [1, 3], [4, 3], [4, 6], [7, 6], [7,9],
                        [6, 9], [6, 7], [3, 7], [3, 4], [0, 4]],
                color: 0
            },
            {
                type: "polygon",
                points: [[3, 0], [7, 0], [7, 3], [9, 3], [9, 4], [6, 4], [6,1],
                        [3, 1]],
                color: 0
            },
            {
                type: "rect",
                points: [[0, 6], [1, 6], [1, 9], [0, 9]],
                color: 0
            },
            {
                type: "rect",
                points: [[1, 0], [2, 0], [2, 3], [1, 3]],
                color: 1
            },
            {
                type: "rect",
                points: [[7, 0], [8, 0], [8, 3], [7, 3]],
                color: 1
            },
            {
                type: "rect",
                points: [[3, 1], [6, 1], [6, 2], [3, 2]],
                color: 1
            },
            {
                type: "rect",
                points: [[4, 3], [5, 3], [5, 6], [4, 6]],
                color: 1
            },
            {
                type: "rect",
                points: [[0, 4], [3, 4], [3, 5], [0, 5]],
                color: 1
            },
            {
                type: "rect",
                points: [[6, 4], [9, 4], [9, 5], [6, 5]],
                color: 1
            },
            {
                type: "rect",
                points: [[1, 6], [2, 6], [2, 9], [1, 9]],
                color: 1
            },
            {
                type: "rect",
                points: [[7, 6], [8, 6], [8, 9], [7, 9]],
                color: 1
            },
            {
                type: "rect",
                points: [[3, 7], [6, 7], [6, 8], [3, 8]],
                color: 1
            },
            {
                type: "polygon",
                points: [[2, 0], [3, 0], [3, 2], [6, 2], [6, 5], [9, 5],
                        [9, 9], [8, 9], [8, 6], [5, 6], [5, 3], [2, 3]],
                color: 2
            },
            {
                type: "rect",
                points: [[8, 0], [9, 0], [9, 3], [8, 3]],
                color: 2
            },
            {
                type: "polygon",
                points: [[0, 5], [3, 5], [3, 8], [6, 8], [6, 9], [2, 9],
                        [2, 6], [0, 6]],
                color: 2
            }
        ]
    },
    {
        name: "Economy Block",
        divisions: 4,
        shapes: [
            {
                type: "triangle",
                points: [[0, 0], [2, 0], [0, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [4, 0], [4, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 2], [4, 4], [2, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 2], [2, 4], [0, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [3, 1], [1, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[3, 1], [4, 2], [3, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1, 3], [3, 3], [2, 4]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1, 1], [1, 3], [0, 2]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[1, 1], [3, 1], [3, 3], [1, 3]],
                color: 2
            }
        ]
    },
    {
        name: "Apple Pie",
        divisions: 6,
        shapes: [
            {
                type: "triangle",
                points: [[0, 0], [1, 1], [0, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 0], [2, 1], [1, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 0], [6, 0], [5, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 1], [6, 1], [5, 2]],
                color: 0
            },
            {
                type: "rect",
                points: [[2, 2], [4, 2], [4, 4], [2, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 4], [2, 5], [0, 5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[5, 4], [5, 6], [4, 5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6, 4], [6, 6], [5, 5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 5], [2, 6], [0, 6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 0], [1, 0], [1, 1]],
                color: 1
            },
            {
                type: "polygon",
                points: [[1, 0], [4, 0], [5, 1], [2, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[6, 0], [6, 1], [5, 1]],
                color: 1
            },
            {
                type: "polygon",
                points: [[1, 1], [1, 4], [0, 5], [0, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 1], [2, 2], [1, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4, 1], [5, 2], [4, 2]],
                color: 1
            },
            {
                type: "polygon",
                points: [[6, 1], [6, 4], [5, 5], [5, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1, 4], [2, 4], [2, 5]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4, 4], [5, 4], [4, 5]],
                color: 1
            },
            {
                type: "triangle",
                points: [[0, 5], [1, 5], [0, 6]],
                color: 1
            },
            {
                type: "polygon",
                points: [[1, 5], [4, 5], [5, 6], [2, 6]],
                color: 1
            },
            {
                type: "triangle",
                points: [[5, 5], [6, 6], [5, 6]],
                color: 1
            },
            {
                type: "rect",
                points: [[2, 1], [4, 1], [4, 2], [2, 2]],
                color: 2
            },
            {
                type: "rect",
                points: [[1, 2], [2, 2], [2, 4], [1, 4]],
                color: 2
            },
            {
                type: "rect",
                points: [[4, 2], [5, 2], [5, 4], [4, 4]],
                color: 2
            },
            {
                type: "rect",
                points: [[2, 4], [4, 4], [4, 5], [2, 5]],
                color: 2
            }
        ]
    },
    {
        name: "Clay's Choice",
        divisions: 4,
        shapes: [
            {
                type: "rectangle",
                points: [[0, 0], [1, 0], [1, 1], [0, 1]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[3, 0], [4, 0], [4, 1], [3, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 1], [2, 2], [1, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 1], [3, 1], [2, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 2], [2, 3], [1, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 2], [3, 2], [3, 3]],
                color: 0
            },
            {
                type: "rect",
                points: [[0, 3], [1, 3], [1, 4], [0, 4]],
                color: 0
            },
            {
                type: "rect",
                points: [[3, 3], [4, 3], [4, 4], [3, 4]],
                color: 0
            },
            {
                type: "polygon",
                points: [[1, 0], [2, 1], [2, 2], [1, 1]],
                color: 1
            },
            {
                type: "polygon",
                points: [[3, 1], [4, 1], [3, 2], [2, 2]],
                color: 1
            },
            {
                type: "polygon",
                points: [[1, 2], [2, 2], [1, 3], [0, 3]],
                color: 1
            },
            {
                type: "polygon",
                points: [[2, 2], [3, 3], [3, 4], [2, 3]],
                color: 1
            },
            {
                type: "polygon",
                points: [[1, 0], [3, 0], [3, 1], [2, 1]],
                color: 2
            },
            {
                type: "polygon",
                points: [[0, 1], [1, 1], [1, 2], [0, 3]],
                color: 2
            },
            {
                type: "polygon",
                points: [[4, 1], [4, 3], [3, 3], [3, 2]],
                color: 2
            },
            {
                type: "polygon",
                points: [[1, 3], [2, 3], [3, 4], [1, 4]],
                color: 2
            },
        ]
    },
    {
        name: "Nine Patch",
        divisions: 3,
        shapes: [
            {
                type: "rectangle",
                points: [[0, 0], [1, 0], [1, 1], [0, 1]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[1, 0], [2, 0], [2, 1], [1, 1]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[2, 0], [3, 0], [3, 1], [2, 1]],
                color: 2
            },
            {
                type: "rectangle",
                points: [[0, 1], [1, 1], [1, 2], [0, 2]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[1, 1], [2, 1], [2, 2], [1, 2]],
                color: 2
            },
            {
                type: "rectangle",
                points: [[2, 1], [3, 1], [3, 2], [2, 2]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[0, 2], [1, 2], [1, 3], [0, 3]],
                color: 2
            },
            {
                type: "rectangle",
                points: [[1, 2], [2, 2], [2, 3], [1, 3]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[2, 2], [3, 2], [3, 3], [2, 3]],
                color: 0
            },
        ]
    },
    {
        name: "Shoofly",
        divisions: 3,
        shapes: [
            {
                type: "triangle",
                points: [[0, 0], [1, 0], [0, 1]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[1, 0], [2, 0], [2, 1], [1, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [3, 0], [3, 1]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[0, 1], [1, 1], [1, 2], [0, 2]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[2, 1], [3, 1], [3, 2], [2, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 2], [1, 3], [0, 3]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[1, 2], [2, 2], [2, 3], [1, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 2], [3, 3], [2, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 0], [1, 1], [0, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 0], [3, 1], [2, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[0, 2], [1, 2], [1, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 2], [3, 2], [2, 3]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[1, 1], [2, 1], [2, 2], [1, 2]],
                color: 2
            }
        ]
    },
    {
        name: "Calico Puzzle",
        divisions: 3,
        shapes: [
            {
                type: "triangle",
                points: [[0, 0], [1, 1], [0, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [3, 0], [2, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 3], [1, 2], [1, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 2], [3, 2], [3, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 0], [1, 0], [1, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[3, 0], [3, 1], [2, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[0, 2], [1, 2], [0, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 2], [3, 3], [2, 3]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[1, 1], [2, 1], [2, 2], [1, 2]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[1, 0], [2, 0], [2, 1], [1, 1]],
                color: 2
            },
            {
                type: "rectangle",
                points: [[0, 1], [1, 1], [1, 2], [0, 2]],
                color: 2
            },
            {
                type: "rectangle",
                points: [[2, 1], [3, 1], [3, 2], [2, 2]],
                color: 2
            },
            {
                type: "rectangle",
                points: [[1, 2], [2, 2], [2, 3], [1, 3]],
                color: 2
            }
        ]
    },
    {
        name: "54-50 or Fight",
        divisions: 6,
        shapes: [
            {
                type: "rectangle",
                points: [[0, 0], [1, 0], [1, 1], [0, 1]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[5, 0], [6, 0], [6, 1], [5, 1]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[1, 1], [2, 1], [2, 2], [1, 2]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[4, 1], [5, 1], [5, 2], [4, 2]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[2, 2], [3, 2], [3, 3], [2, 3]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[3, 3], [4, 3], [4, 4], [3, 4]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[1, 4], [2, 4], [2, 5], [1, 5]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[4, 4], [5, 4], [5, 5], [4, 5]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[0, 5], [1, 5], [1, 6], [0, 6]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[5, 5], [6, 5], [6, 6], [5, 6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [4, 0], [3, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 2], [2, 3], [0, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6, 2], [6, 4], [4, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 4], [4, 6], [2, 6]],
                color: 0
            },
            {
                type: "rectangle",
                points: [[1, 0], [2, 0], [2, 1], [1, 1]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[4, 0], [5, 0], [5, 1], [4, 1]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[0, 1], [1, 1], [1, 2], [0, 2]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[5, 1], [6, 1], [6, 2], [5, 2]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[3, 2], [4, 2], [4, 3], [3, 3]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[2, 3], [3, 3], [3, 4], [2, 4]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[0, 4], [1, 4], [1, 5], [0, 5]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[5, 4], [6, 4], [6, 5], [5, 5]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[1, 5], [2, 5], [2, 6], [1, 6]],
                color: 1
            },
            {
                type: "rectangle",
                points: [[4, 5], [5, 5], [5, 6], [4, 6]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 0], [3, 2], [2, 2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[4, 0], [4, 2], [3, 2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[0, 2], [2, 2], [2, 3]],
                color: 2
            },
            {
                type: "triangle",
                points: [[4, 2], [6, 2], [4, 3]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2, 3], [2, 4], [0, 4]],
                color: 2
            },
            {
                type: "triangle",
                points: [[4, 3], [6, 4], [4, 4]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2, 4], [3, 4], [2, 6]],
                color: 2
            },
            {
                type: "triangle",
                points: [[3, 4], [4, 4], [4, 6]],
                color: 2
            },
        ]
    },
    {
        name: "Dutchman's Puzzle",
        divisions: 4,
        shapes: [
            {
                type: "triangle",
                points: [[0, 0], [1, 0], [0, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 0], [2, 0], [2, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [3, 0], [3, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 0], [4, 0], [4, 1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 1], [1, 1], [0, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 1], [2, 1], [2, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 1], [3, 2], [2, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 1], [4, 2], [3, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 2], [1, 2], [0, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 2], [2, 2], [1, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 2], [3, 3], [2, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 2], [4, 3], [3, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 3], [1, 4], [0, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 3], [2, 4], [1, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 3], [3, 4], [2, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 3], [4, 4], [3, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1, 0], [2, 1], [0, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[3, 0], [4, 1], [3, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1, 2], [1, 4], [0, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 3], [4, 3], [3, 4]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 0], [3, 1], [2, 2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[1, 1], [2, 2], [0, 2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2, 2], [2, 4], [1, 3]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2, 2], [4, 2], [3, 3]],
                color: 2
            }
        ]
    },
    {
        name: "Battleground Quilt",
        divisions: 6,
        shapes: [
            {
                type: "triangle",
                points: [[0,0],[1,0],[0,1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1,0],[1,1],[0,1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1,0],[2,0],[1,1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2,0],[2,1],[1,1]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2,0],[3,0],[2,1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3,0],[3,1],[2,1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[3,0],[4,0],[3,1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4,0],[4,1],[3,1]],
                color: 2
            },
            {
                type: "triangle",
                points: [[4,0],[5,0],[4,1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[5,0],[5,1],[4,1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[5,0],[6,0],[5,1]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6,0],[6,1],[5,1]],
                color: 2
            },

            {
                type: "triangle",
                points: [[0,1],[1,1],[0,2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1,1],[1,2],[0,2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[1,1],[2,1],[1,2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2,1],[2,2],[1,2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2,1],[3,1],[2,2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3,1],[3,2],[2,2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[3,1],[4,1],[3,2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4,1],[4,2],[3,2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4,1],[5,1],[4,2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[5,1],[5,2],[4,2]],
                color: 2
            },
            {
                type: "triangle",
                points: [[5,1],[6,1],[5,2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6,1],[6,2],[5,2]],
                color: 1
            },

            {
                type: "triangle",
                points: [[0,2],[1,2],[0,3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1,2],[1,3],[0,3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1,2],[2,2],[1,3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2,2],[2,3],[1,3]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2,2],[3,2],[2,3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3,2],[3,3],[2,3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[3,2],[4,2],[3,3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4,2],[4,3],[3,3]],
                color: 2
            },
            {
                type: "triangle",
                points: [[4,2],[5,2],[4,3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[5,2],[5,3],[4,3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[5,2],[6,2],[5,3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6,2],[6,3],[5,3]],
                color: 2
            },

            {
                type: "triangle",
                points: [[0,3],[1,3],[0,4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1,3],[1,4],[0,4]],
                color: 2
            },
            {
                type: "triangle",
                points: [[1,3],[2,3],[1,4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2,3],[2,4],[1,4]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2,3],[3,3],[2,4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3,3],[3,4],[2,4]],
                color: 2
            },
            {
                type: "triangle",
                points: [[3,3],[4,3],[3,4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4,3],[4,4],[3,4]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4,3],[5,3],[4,4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[5,3],[5,4],[4,4]],
                color: 2
            },
            {
                type: "triangle",
                points: [[5,3],[6,3],[5,4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6,3],[6,4],[5,4]],
                color: 1
            },

            {
                type: "triangle",
                points: [[0,4],[1,4],[0,5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1,4],[1,5],[0,5]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1,4],[2,4],[1,5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2,4],[2,5],[1,5]],
                color: 2
            },
            {
                type: "triangle",
                points: [[2,4],[3,4],[2,5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3,4],[3,5],[2,5]],
                color: 1
            },
            {
                type: "triangle",
                points: [[3,4],[4,4],[3,5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4,4],[4,5],[3,5]],
                color: 2
            },
            {
                type: "triangle",
                points: [[4,4],[5,4],[4,5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[5,4],[5,5],[4,5]],
                color: 1
            },
            {
                type: "triangle",
                points: [[5,4],[6,4],[5,5]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6,4],[6,5],[5,5]],
                color: 2
            },

            {
                type: "triangle",
                points: [[0,5],[1,5],[0,6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[1,5],[1,6],[0,6]],
                color: 2
            },
            {
                type: "triangle",
                points: [[1,5],[2,5],[1,6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2,5],[2,6],[1,6]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2,5],[3,5],[2,6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3,5],[3,6],[2,6]],
                color: 2
            },
            {
                type: "triangle",
                points: [[3,5],[4,5],[3,6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4,5],[4,6],[3,6]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4,5],[5,5],[4,6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[5,5],[5,6],[4,6]],
                color: 2
            },
            {
                type: "triangle",
                points: [[5,5],[6,5],[5,6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6,5],[6,6],[5,6]],
                color: 1
            }
        ]
    },
    {
        name: "Ohio Star",
        divisions: 6,
        shapes: [
            {
                type: "rect",
                points: [[0, 0], [2, 0], [2, 2], [0, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [4, 0], [3, 1]],
                color: 0
            },
            {
                type: "rect",
                points: [[4, 0], [6, 0], [6, 2], [4, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 1], [4, 2], [2, 2]],
                color: 0
            },
            {
                type: "triangle",
                points: [[0, 2], [1, 3], [0, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 2], [2, 4], [1, 3]],
                color: 0
            },
            {
                type: "triangle",
                points: [[4, 2], [5, 3], [4, 4]],
                color: 0
            },
            {
                type: "triangle",
                points: [[6, 2], [6, 4], [5, 3]],
                color: 0
            },
            {
                type: "rect",
                points: [[0, 4], [2, 4], [2, 6], [0, 6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 4], [4, 4], [3, 5]],
                color: 0
            },
            {
                type: "rect",
                points: [[4, 4], [6, 4], [6, 6], [4, 6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[3, 5], [4, 6], [2, 6]],
                color: 0
            },
            {
                type: "triangle",
                points: [[2, 0], [3, 1], [2, 2]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4, 0], [4, 2], [3, 1]],
                color: 1
            },
            {
                type: "triangle",
                points: [[0, 2], [2, 2], [1, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4, 2], [6, 2], [5, 3]],
                color: 1
            },
            {
                type: "triangle",
                points: [[1, 3], [2, 4], [0, 4]],
                color: 1
            },
            {
                type: "triangle",
                points: [[5, 3], [6, 4], [4, 4]],
                color: 1
            },
            {
                type: "triangle",
                points: [[2, 4], [3, 5], [2, 6]],
                color: 1
            },
            {
                type: "triangle",
                points: [[4, 4], [4, 6], [3, 5]],
                color: 1
            },
            {
                type: "rect",
                points: [[2, 2], [4, 2], [4, 4], [2, 4]],
                color: 2
            }
        ]
    }
]

let currentPattern = quiltPatternsList[Math.floor(Math.random() * quiltPatternsList.length)];

document
    .getElementById("grid-options")
    .addEventListener("change", event => {

        const size = Number(event.target.value);

        // console.log("Grid size:", size);

        // redraw quilt grid
        // drawGrid(size);

    });

function setMode(mode) {
    currentMode = mode;

    modeToggle.classList.toggle("grid", mode === "grid");

    gridOptionsWrapper.classList.toggle("grid-mode", mode === "grid");
    
    document.getElementById('downloadButton').classList.toggle("grid-mode", mode === "grid");

    modeToggle.querySelectorAll(".mode-option")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.mode === mode
            );
        });
    
        if (mode == "grid") {
            generateButton.textContent = "Generate Quilt Grid";
        } else {
            currentPattern = null;
            currentShuffledColorsHex = [backgroundColor, backgroundColor, backgroundColor];
            generateButton.textContent = "Generate Quilt Block";
        }

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
function hexToRgbOriginal(hex) {
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
    const rgb = hexToRgbOriginal(hexcolor);
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
        for (let i = 0; i < nextColorCombo.length; i++) {
            const swatch = colorSwatches[i];
            const colorData = wadaColorsData.colors[nextColorCombo[i]];
    
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

    saveCanvas(fileName, 'png');
    // const scaleSize = 4000;
    // const g = createGraphics(scaleSize, scaleSize);
    // currentPattern.func(nextShuffledColorsHex, scaleSize, g);
    // g.save(`${fileName}.png`);
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = floor(random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // ES6 swap
    }
    return array;
}

// --- 4. Core Logic Functions (generateQuilt updated for pattern names) ---

```
1) Select next pattern
2) Match shapes between current and next pattern
3) Match points of shapes
4) Draw shapes with points moving on their paths

```

function getPatternGeometry(pattern) {

    if (geometryCache.has(pattern)) {
        return geometryCache.get(pattern);
    }

    const geometry = buildPatternGeometry(pattern);
    geometryCache.set(pattern, geometry);
    return geometry;
}

function buildPatternGeometry(pattern) {
    return {
        shapes: pattern.shapes.map(shape => {
            return {
                originalShape: shape,
                center:
                    calculateShapeCenter(
                        shape,
                        pattern.divisions
                    ),
                perimeter:
                    calculatePerimeter(
                        shape,
                        pattern.divisions
                    ),
                samples:
                    sampleShapeBoundary(
                        shape,
                        pattern.divisions,
                        SAMPLE_COUNT
                    )
            };
        })
    };
}

function calculateShapeCenter(shape, divisions) {

    let x = 0;
    let y = 0;

    for (const point of shape.points) {
        x += point[0] / divisions;
        y += point[1] / divisions;
    }

    return {
        x: x / shape.points.length,
        y: y / shape.points.length
    };
}

function calculatePerimeter(shape, divisions) {

    let perimeter = 0;

    for (let i = 0; i < shape.points.length; i++) {

        const a = shape.points[i];
        const b =
            shape.points[
                (i + 1) % shape.points.length
            ];
        const dx =
            (b[0] - a[0]) / divisions;
        const dy =
            (b[1] - a[1]) / divisions;
        perimeter += Math.hypot(dx,dy);
    }

    return perimeter;
}

function sampleShapeBoundary(shape, divisions, sampleCount) {

    // ------------------------------------------------------------
    // Normalize vertices into unit-square coordinates
    // ------------------------------------------------------------

    const vertices = shape.points.map(point => [
        point[0] / divisions,
        point[1] / divisions
    ]);

    const edgeCount = vertices.length;

    // ------------------------------------------------------------
    // Compute edge lengths
    // ------------------------------------------------------------

    const edgeLengths = [];
    let perimeter = 0;

    for (let i = 0; i < edgeCount; i++) {

        const a = vertices[i];
        const b = vertices[(i + 1) % edgeCount];

        const length = Math.hypot(
            b[0] - a[0],
            b[1] - a[1]
        );

        edgeLengths.push(length);
        perimeter += length;

    }

    // ------------------------------------------------------------
    // We reserve one sample for every vertex.
    // ------------------------------------------------------------

    const remainingSamples =
        sampleCount - edgeCount;

    // Number of interior samples per edge
    const interiorCounts =
        new Array(edgeCount).fill(0);

    // Fractional remainders used for balancing
    const remainders =
        new Array(edgeCount).fill(0);

    let assigned = 0;

    for (let i = 0; i < edgeCount; i++) {

        const exact =
            remainingSamples *
            edgeLengths[i] /
            perimeter;

        interiorCounts[i] = Math.floor(exact);

        remainders[i] =
            exact - interiorCounts[i];

        assigned += interiorCounts[i];

    }

    // ------------------------------------------------------------
    // Distribute leftover samples to the largest remainders
    // ------------------------------------------------------------

    let leftovers =
        remainingSamples - assigned;

    while (leftovers > 0) {

        let bestEdge = 0;

        for (let i = 1; i < edgeCount; i++) {

            if (remainders[i] > remainders[bestEdge]) {
                bestEdge = i;
            }

        }

        interiorCounts[bestEdge]++;
        remainders[bestEdge] = -1;

        leftovers--;

    }

    // ------------------------------------------------------------
    // Generate samples
    // ------------------------------------------------------------

    const samples = [];

    for (let i = 0; i < edgeCount; i++) {

        const start = vertices[i];
        const end =
            vertices[(i + 1) % edgeCount];

        // Always include the vertex
        samples.push([
            start[0],
            start[1]
        ]);

        // Interior samples
        const count =
            interiorCounts[i];

        for (let j = 1; j <= count; j++) {

            const t =
                j / (count + 1);

            samples.push([

                start[0] +
                    (end[0] - start[0]) * t,

                start[1] +
                    (end[1] - start[1]) * t

            ]);

        }

    }

    // ------------------------------------------------------------
    // Sanity check
    // ------------------------------------------------------------

    if (samples.length !== sampleCount) {

        console.error(
            "sampleShapeBoundary(): expected",
            sampleCount,
            "samples but generated",
            samples.length
        );

    }

    return samples;

}

function findBestSampleRotation(currentSamples, nextSamples) {

    let bestRotation = 0;
    let bestError = Infinity;

    for (let rotation = 0; rotation < SAMPLE_COUNT; rotation++) {

        let error = 0;

        for (let i = 0; i < SAMPLE_COUNT; i++) {
            const current = currentSamples[i];
            const next =
                nextSamples[
                    (i + rotation) % SAMPLE_COUNT
                ];
            const dx = current[0] - next[0];
            const dy = current[1] - next[1];
            error += dx * dx + dy * dy;
        }

        if (error < bestError) {
            bestError = error;
            bestRotation = rotation;
        }
    }

    return bestRotation;

}

function hexToRgb(hex) {
    // console.log(`hexToRgb: hex = ${hex}`);
    hex = hex.replace("#", "");

    return {
        r: parseInt(hex.slice(0,2),16),
        g: parseInt(hex.slice(2,4),16),
        b: parseInt(hex.slice(4,6),16)
    };
}

function rgbToHex(r, g, b) {

    return "#" +
        r.toString(16).padStart(2,"0") +
        g.toString(16).padStart(2,"0") +
        b.toString(16).padStart(2,"0");
}

function srgbToLinear(c) {

    c /= 255;

    if (c <= 0.04045)
        return c / 12.92;

    return Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c) {

    if (c <= 0.0031308)
        return 12.92 * c;

    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function labF(t) {
    if (t > 0.008856) {
        return Math.cbrt(t);
    }

    return (7.787 * t) + (16 / 116);
}

function labFInverse(t) {

    const t3 = t * t * t;
    if (t3 > 0.008856)
        return t3;
    return (t - (16 / 116)) / 7.787;
}

function hexToLAB(hex) {
    // console.log(`hexToLab: hex = ${hex}`);
    const colorsRGB = hexToRgb(hex);
    // console.log(`colorsRGB = ${colorsRGB.r}, ${colorsRGB.g}, ${colorsRGB.b}`);
    
    const rLinear = srgbToLinear(colorsRGB.r);
    const gLinear = srgbToLinear(colorsRGB.g);
    const bLinear = srgbToLinear(colorsRGB.b);
    // console.log(`rgb linear = ${rLinear}, ${gLinear}, ${bLinear}`);
    
    const X = (0.4124564 * rLinear + 0.3575761 * gLinear + 0.1804375 * bLinear) * 100
    const Y = (0.2126729 * rLinear + 0.7151522 * gLinear + 0.0721750 * bLinear) * 100
    const Z = (0.0193339 * rLinear + 0.1191920 * gLinear + 0.9503041 * bLinear) * 100
    // console.log(`X Y Z = ${X}, ${Y}, ${Z}`);
    
    const x = X / 95.047;
    const y = Y / 100.000;
    const z = Z / 108.883;
    // console.log(`x y z = ${x}, ${y}, ${z}`);
    
    const fx = labF(x);
    const fy = labF(y);
    const fz = labF(z);
    // console.log(`fx fy fz = ${fx}, ${fy}, ${fz}`);

    return {
        L: (116 * fy) - 16,
        a: 500 * (fx - fy),
        b: 200 * (fy - fz)
    }
}

function clamp01(x) {
    return Math.max(0, Math.min(1, x));
}

function labToHex(lab) {
    let fy = (lab.L + 16) / 116;
    let fx = fy + (lab.a / 500);
    let fz = fy - (lab.b / 200);
    
    let x = labFInverse(fx);
    let y = labFInverse(fy);
    let z = labFInverse(fz);

    let X = x * 95.047;;
    let Y = y * 100.000;
    let Z = z * 108.883;

    let r =
        3.2404542 * X / 100
    - 1.5371385 * Y / 100
    - 0.4985314 * Z / 100;

    let g =
        -0.9692660 * X / 100
    + 1.8760108 * Y / 100
    + 0.0415560 * Z / 100;

    let b =
        0.0556434 * X / 100
    - 0.2040259 * Y / 100
    + 1.0572252 * Z / 100;

    r = linearToSrgb(r);
    g = linearToSrgb(g);
    b = linearToSrgb(b);

    r = clamp01(r);
    g = clamp01(g);
    b = clamp01(b);

    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    return rgbToHex(r, g, b);
}

function initializeAnimation() {
    transitionalShapesMapping = [];

    const currentGeometry =
        currentPattern == null
        ? null
        : getPatternGeometry(currentPattern);

    const nextGeometry =
        getPatternGeometry(nextPattern);

    const shapeMatches = currentPattern == null ? buildInitialMatches(nextGeometry) : matchShapes(currentGeometry, nextGeometry);

    buildTransitionMapping(shapeMatches);
}

function buildInitialMatches(nextGeometry) {

    return nextGeometry.shapes.map(shape => ({
        current: shape,
        next: [shape]
    }));

}

function matchShapes(currentGeometry, nextGeometry) {

    const candidates = [];

    for (const current of currentGeometry.shapes) {
        for (const next of nextGeometry.shapes) {
            const dx = current.center.x - next.center.x;
            const dy = current.center.y - next.center.y;

            candidates.push({
                current,
                next,
                distance: Math.hypot(dx, dy)
            });
        }
    }

    candidates.sort((a, b) => a.distance - b.distance);

    const matches = currentGeometry.shapes.map(shape => ({
        current: shape,
        next: []
    }));

    const usedCurrent = new Set();
    const usedNext = new Set();

    for (const current of currentGeometry.shapes) {

        const nearest = candidates.find(
            c => c.current === current
        );

        const match = matches.find(
            m => m.current === current
        );

        match.next.push(nearest.next);

    }

    const assignedNext = new Set();

    for (const match of matches) {

        assignedNext.add(match.next[0]);

    }

    for (const next of nextGeometry.shapes) {

        if (assignedNext.has(next))
            continue;

        const nearest = candidates.find(
            c => c.next === next
        );

        const match = matches.find(
            m => m.current === nearest.current
        );

        match.next.push(next);

    }

    return matches;

}

function buildTransitionMapping(shapeMatches) {

    for (const match of shapeMatches) {

        const currentGeometryShape = match.current;
        const currentShape = currentGeometryShape.originalShape;

        // One current shape may transition into multiple next shapes
        for (const nextGeometryShape of match.next) {

            const nextShape = nextGeometryShape.originalShape;
            const nextDivisions = nextPattern.divisions;

            const labStart =
                hexToLAB(
                    currentShuffledColorsHex[currentShape.color]
                );

            const labEnd =
                hexToLAB(
                    nextShuffledColorsHex[nextShape.color]
                );

            const transition = {
                color: {
                    start: labStart,
                    end: labEnd
                },
                paths: []
            };

            transitionalShapesMapping.push(transition);

            // Keep the existing point matching algorithm
            // for (let j = 0; j < nextShape.points.length; j++) {

            //     const nextPoint = nextShape.points[j];

            //     const currentPoint =
            //         currentGeometryShape.points[j] ?? [0, 0];

            //     transition.paths.push({
            //         start: [
            //             currentPoint[0] / currentDivisions,
            //             currentPoint[1] / currentDivisions
            //         ],
            //         end: [
            //             nextPoint[0] / nextDivisions,
            //             nextPoint[1] / nextDivisions
            //         ]
            //     });
            // }

            const currentSamples = currentGeometryShape.samples;
            const nextSamples = nextGeometryShape.samples;

            const rotation = findBestSampleRotation(currentSamples, nextSamples);

            for (let i = 0; i < SAMPLE_COUNT; i++) {

                transition.paths.push({
                    start: currentSamples[i],
                    end: nextSamples[(i + rotation) % SAMPLE_COUNT]
                });
            }
        }
    }
}

function interpolatePatterns(t) {
    
    let transitionalShapes = [];
    for (const shape of transitionalShapesMapping) {
        let lab = {
            L: lerp(shape.color.start.L, shape.color.end.L, t),
            a: lerp(shape.color.start.a, shape.color.end.a, t),
            b: lerp(shape.color.start.b, shape.color.end.b, t)
        };
        transitionalShapes.push({points: [], color: labToHex(lab)});
        // interpolate between start and end points for all 
        for (const point of shape.paths) {
            transitionalShapes.at(-1).points.push(
                [point.start[0] + (point.end[0] - point.start[0]) * t,
                point.start[1] + (point.end[1] - point.start[1]) * t]
            ) 
        }
    }
    return {
        name: nextPattern.name,
        divisions: nextPattern.divisions,
        shapes: transitionalShapes
    };
}

function drawPattern(pattern, size) {

    // let size = quiltSize * scaleSize;    

    noStroke();
    rectMode(CORNERS);
    // background(backgroundColor);

    for (const shape of pattern.shapes) {
        fill(shape.color);
        beginShape();
        for (const point of shape.points) {
            vertex(
                point[0] * size, point[1] * size
            );
        }
        endShape(CLOSE);
    }
}

function generateQuilt() {

    nextColorComboID = random(Object.keys(wadaColorsData.combinations));
    nextColorCombo = wadaColorsData.combinations[nextColorComboID];
    nextShuffledColors = shuffleArray([...nextColorCombo]);

    nextShuffledColorsHex = nextShuffledColors.map(
        id => wadaColorsData.colors[id].hex
    );
    
    nextPattern = quiltPatternsList[Math.floor(Math.random() * quiltPatternsList.length)];

    initializeAnimation();
    animationProgress = 0;
    isAnimating = true;
    drawCurrentQuilt();
}

function drawCurrentQuilt() {
    
    quiltSize = calculateQuiltSize().canvasSize;
    resizeCanvas(quiltSize * scaleSize, quiltSize * scaleSize);
    quiltBlockCanvas.canvas.style.width = quiltSize + "px";
    quiltBlockCanvas.canvas.style.height = quiltSize + "px";

    // background(255);

    // background(100);
    // currentPattern.func(nextShuffledColorsHex, quiltSize * scaleSize);
    
    display_text = `${nextPattern.name}<br>Color Combo: ${nextColorComboID}`;
    display_swatches = true;
    fileName = `wada_quilt_combo_${nextColorComboID}_${nextPattern.name.toLowerCase()}`
    
    updateColorDisplay();
    loop();
}

function generateQuiltGridData() {
    const currentGridOption = document.getElementById("grid-options").value;
    let displayText = '';
    currentBlocksGrid.length = 0;
    const shuffledPatterns = shuffleArray(quiltPatternsList);
    
    if (currentGridOption == 1) {
        // Select random color
        nextColorComboID = random(Object.keys(wadaColorsData.combinations));
        nextColorCombo = wadaColorsData.combinations[nextColorComboID];
        nextShuffledColors = shuffleArray([...nextColorCombo]);
        const shuffledColorsHex = nextShuffledColors.map(id => wadaColorsData.colors[id].hex)
        
        for (let i = 0; i < 16; i++) {
            const patternIndex = i % quiltPatternsList.length;
            currentBlocksGrid.push({
                pattern: shuffledPatterns[patternIndex],
                colors: shuffledColorsHex
            });
        }
        display_text = `Color Combo: ${nextColorComboID}`;
        display_swatches = true;
        fileName = `wada_quilt_combo_${nextColorComboID}_mixed_patterns`

    } else if (currentGridOption == 2) {
        currentPattern = random(quiltPatternsList);
        const shuffledCombinations = shuffleArray(Object.keys(wadaColorsData.combinations));
        // console.log(shuffledCombinations)
        for (let i = 0; i < 16; i++) {
            const comboIndex = i;
            const combo = shuffledCombinations[comboIndex];
            const comboHex = wadaColorsData.combinations[combo].map(id => wadaColorsData.colors[id].hex)
            currentBlocksGrid.push({
                pattern: currentPattern,
                colors: comboHex
            });
        }

        display_text = `Pattern: ${currentPattern.name}`;
        display_swatches = false;
        fileName = `wada_quilt_mixed_colors_${currentPattern.name.toLowerCase()}`

    } else {
        const shuffledCombinations = shuffleArray(Object.keys(wadaColorsData.combinations));
        for (let i = 0; i < 16; i++) {
            const patternIndex = i % quiltPatternsList.length;
            const comboIndex = i;
            const combo = shuffledCombinations[comboIndex];
            const comboHex = wadaColorsData.combinations[combo].map(id => wadaColorsData.colors[id].hex)
            currentBlocksGrid.push({
                pattern: shuffledPatterns[patternIndex],
                colors: comboHex
            });
        }
        display_text = `Mixed colors and patterns`;
        display_swatches = false
        fileName = 'wada_quilt_mixed_colors_patterns'
    }
}

function drawQuiltGrid() {

    sizeData = calculateQuiltSize();
    quiltSize = sizeData.canvasSize;
    const padding = sizeData.padding * scaleSize;
    const blockSize = sizeData.blockSize * scaleSize;
    resizeCanvas(quiltSize * scaleSize, quiltSize * scaleSize);
    quiltBlockCanvas.canvas.style.width = quiltSize + "px";
    quiltBlockCanvas.canvas.style.height = quiltSize + "px";

    console.log(`sizeData: ${quiltSize}, ${blockSize}, ${padding}, ${scaleSize}`);
    
    background(backgroundColor);

    let blockIndex = 0;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let x = col * (blockSize + padding);
            let y = row * (blockSize + padding);

            push();
            translate(x, y);
            
            let blockData = currentBlocksGrid[blockIndex];
            // blockData.drawFunc(blockData.colors, blockSize);

            const pattern =
                colorizePattern(
                    blockData.pattern,
                    blockData.colors
                );

            drawPattern(pattern, blockSize);
            
            pop();
            blockIndex++;
        }
    }

    updateColorDisplay();
}

function colorizePattern(patternDefinition, colorsHex) {

    return {
        divisions: patternDefinition.divisions,
        shapes: patternDefinition.shapes.map(shape => ({
            type: shape.type,
            points: shape.points.map(point => [
                point[0] / patternDefinition.divisions,
                point[1] / patternDefinition.divisions
            ]),
            color: colorsHex[shape.color]
        }))
    };

}

// --- 5. p5.js setup() and draw() (updated for new element) ---

function preload() {
    wadaColorsData = loadJSON("/assets/data/wada-colors.json");
}

function setup() {
    
    pixelDensity(1);
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
        // console.log("observer", w);
        if (currentMode === "single") {
            drawCurrentQuilt();
        } else {
            drawQuiltGrid();
        }
    }).observe(canvas_container);
}

function easeInOut(t) {
    return t * t * (3 - 2 * t);
}

function easeInOutCubic(t) {
    if (t < 0.5)
        return 4*t*t*t;
    return 1 - Math.pow(-2*t+2,3)/2;
}

function easeSine(t) {
    return 0.5 - 0.5*Math.cos(Math.PI*t);
}

function smootherStep(t) {
    return t*t*t*(t*(6*t-15)+10);
}

function draw() {
    
    if (isAnimating) {
        animationProgress += 0.02;
    }

    const interpolatedPattern = interpolatePatterns(easeInOutCubic(animationProgress));
    drawPattern(interpolatedPattern, quiltSize * scaleSize);

    if (isAnimating && animationProgress >= 1) {
        currentPattern = nextPattern;
        currentShuffledColorsHex = nextShuffledColorsHex;
        isAnimating = false;
        noLoop();
    }
}
