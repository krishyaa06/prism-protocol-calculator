
/**
 * Prism Protocol Quantum Terminal Logic
 * Copyright (c) 2026 Prism Protocol
 * Licensed under the MIT License
 */

let currentInput = "0";
let history = "";
let currentMode = "standard";

const mainDisplay = document.getElementById("main-display");
const historyDisplay = document.getElementById("history-display");
const extraGrid = document.getElementById("extra-grid");
const modeButtons = document.querySelectorAll(".mode-btn");

function updateScreen() {
    mainDisplay.innerText = currentInput;
    historyDisplay.innerText = history;
}

// Number buttons
document.querySelectorAll(".btn-num").forEach(button => {
    button.addEventListener("click", () => {
        if (currentInput === "0" && button.innerText !== ".") {
            currentInput = button.innerText;
        } else {
            if (button.innerText === "." && currentInput.includes(".")) return;
            currentInput += button.innerText;
        }
        updateScreen();
    });
});

// Basic operators
document.querySelectorAll("[data-op]").forEach(button => {
    button.addEventListener("click", () => {
        history = currentInput + " " + button.innerText;
        currentInput = "0";
        updateScreen();
    });
});

// AC (Clear)
document.getElementById("btn-clear").addEventListener("click", () => {
    currentInput = "0";
    history = "";
    updateScreen();
});

// DEL (Delete)
document.getElementById("btn-delete").addEventListener("click", () => {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    updateScreen();
});

// Equals
document.getElementById("btn-equal").addEventListener("click", () => {
    if (!history) return;
    try {
        let cleanHistory = history.replace("×", "*").replace("÷", "/");
        let expression = cleanHistory + currentInput;
        let result = Function('"use strict";return (' + expression + ')')();
        history = "";
        currentInput = String(Math.round(result * 1e8) / 1e8);
    } catch {
        currentInput = "Error";
    }
    updateScreen();
});

// Mode Switching Layouts
const modeConfigs = {
    standard: [],
    scientific: [
        { label: "sin", action: () => applyMath(Math.sin) },
        { label: "cos", action: () => applyMath(Math.cos) },
        { label: "tan", action: () => applyMath(Math.tan) },
        { label: "√", action: () => applyMath(Math.sqrt) },
        { label: "log", action: () => applyMath(Math.log10) },
        { label: "ln", action: () => applyMath(Math.log) },
        { label: "x²", action: () => { currentInput = String(Math.pow(parseFloat(currentInput), 2)); updateScreen(); } },
        { label: "π", action: () => { currentInput = String(Math.PI); updateScreen(); } }
    ],
    programmer: [
        { label: "HEX", action: () => { currentInput = parseInt(currentInput).toString(16).toUpperCase(); updateScreen(); } },
        { label: "BIN", action: () => { currentInput = parseInt(currentInput).toString(2); updateScreen(); } },
        { label: "OCT", action: () => { currentInput = parseInt(currentInput).toString(8); updateScreen(); } },
        { label: "DEC", action: () => { currentInput = parseInt(currentInput, 16).toString(10); updateScreen(); } }
    ],
    defi: [
        { label: "APY 365d", action: () => calculateAPY(365) },
        { label: "APY 52w", action: () => calculateAPY(52) },
        { label: "APY 12m", action: () => calculateAPY(12) },
        { label: "Daily %", action: () => { currentInput = String((parseFloat(currentInput) / 365).toFixed(4)); updateScreen(); } }
    ]
};

function applyMath(fn) {
    try {
        currentInput = String(Math.round(fn(parseFloat(currentInput)) * 1e8) / 1e8);
    } catch {
        currentInput = "Error";
    }
    updateScreen();
}

function calculateAPY(compounds) {
    let apr = parseFloat(currentInput) / 100;
    let apy = (Math.pow(1 + (apr / compounds), compounds) - 1) * 100;
    currentInput = String(apy.toFixed(2)) + "%";
    updateScreen();
}

modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        modeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentMode = btn.dataset.mode;
        renderExtraPanel(currentMode);
    });
});

function renderExtraPanel(mode) {
    extraGrid.innerHTML = "";
    if (mode === "standard" || !modeConfigs[mode].length) {
        extraGrid.style.display = "none";
        return;
    }
    extraGrid.style.display = "grid";
    modeConfigs[mode].forEach(item => {
        const b = document.createElement("button");
        b.className = "btn btn-sci-op";
        b.innerText = item.label;
        b.addEventListener("click", item.action);
        extraGrid.appendChild(b);
    });
}

// Keyboard Support
window.addEventListener("keydown", (e) => {
    if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
        if (currentInput === "0" && e.key !== ".") currentInput = e.key;
        else currentInput += e.key;
    } else if (["+", "-", "*", "/"].includes(e.key)) {
        history = currentInput + " " + (e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key);
        currentInput = "0";
    } else if (e.key === "Enter" || e.key === "=") {
        document.getElementById("btn-equal").click();
    } else if (e.key === "Backspace") {
        document.getElementById("btn-delete").click();
    } else if (e.key === "Escape") {
        document.getElementById("btn-clear").click();
    }
    updateScreen();
});
