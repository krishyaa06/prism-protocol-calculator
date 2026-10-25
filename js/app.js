
/* ============================================
   Prism Protocol — Quantum Terminal
   Core Calculator Engine
   ============================================ */

let currentInput = "0";
let history = "";
let currentMode = "standard";

const mainDisplay = document.getElementById("main-display");
const historyDisplay = document.getElementById("history-display");
const extraGrid = document.getElementById("extra-grid");

function updateScreen() {
    mainDisplay.innerText = currentInput;
    historyDisplay.innerText = history;
}

// Number buttons
document.querySelectorAll(".btn-num").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.innerText;

        if (currentInput === "0" && value !== ".") {
            currentInput = value;
        } else if (value === "." && currentInput.includes(".")) {
            return;
        } else {
            currentInput += value;
        }
        updateScreen();
    });
});

// Operator buttons
document.querySelectorAll("[data-op]").forEach(button => {
    button.addEventListener("click", () => {
        const op = button.getAttribute("data-op");
        const symbol = button.innerText;

        if (history && currentInput !== "0") {
            // chain calculation
            history = history + " " + currentInput + " " + symbol;
        } else {
            history = currentInput + " " + symbol;
        }
        currentInput = "0";
        updateScreen();
    });
});

// Clear
document.getElementById("btn-clear").addEventListener("click", () => {
    currentInput = "0";
    history = "";
    updateScreen();
});

// Delete
document.getElementById("btn-delete").addEventListener("click", () => {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    updateScreen();
});

// Percentage
document.querySelector("[data-action='percent']").addEventListener("click", () => {
    try {
        currentInput = String(parseFloat(currentInput) / 100);
        updateScreen();
    } catch {
        currentInput = "Error";
        updateScreen();
    }
});

// Equal
document.getElementById("btn-equal").addEventListener("click", () => {
    if (!history) return;

    try {
        let expression = (history + " " + currentInput)
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");

        // Basic safety
        if (!/^[\d\s+\-*/.()]+$/.test(expression)) {
            throw new Error("Invalid");
        }

        let result = Function('"use strict"; return (' + expression + ')')();
        history = "";
        currentInput = String(Number(result.toFixed(10)));
    } catch {
        currentInput = "Error";
        history = "";
    }
    updateScreen();
});

// Mode switching
document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentMode = btn.getAttribute("data-mode");

        // Reset display on mode change
        currentInput = "0";
        history = "";
        updateScreen();

        renderExtraControls(currentMode);
    });
});

function renderExtraControls(mode) {
    extraGrid.innerHTML = "";
    extraGrid.style.display = "none";

    if (mode === "scientific") {
        extraGrid.style.display = "grid";
        const sciButtons = [
            { label: "sin", action: "sin" },
            { label: "cos", action: "cos" },
            { label: "tan", action: "tan" },
            { label: "√", action: "sqrt" },
            { label: "log", action: "log" },
            { label: "ln", action: "ln" },
            { label: "x²", action: "square" },
            { label: "π", action: "pi" }
        ];

        sciButtons.forEach(item => {
            const b = document.createElement("button");
            b.className = "btn btn-sci-op";
            b.innerText = item.label;
            b.addEventListener("click", () => handleScientific(item.action));
            extraGrid.appendChild(b);
        });
    }

    if (mode === "programmer") {
        extraGrid.style.display = "grid";
        const progButtons = [
            { label: "HEX", action: "hex" },
            { label: "BIN", action: "bin" },
            { label: "OCT", action: "oct" },
            { label: "DEC", action: "dec" }
        ];

        progButtons.forEach(item => {
            const b = document.createElement("button");
            b.className = "btn btn-sci-op";
            b.innerText = item.label;
            b.addEventListener("click", () => handleProgrammer(item.action));
            extraGrid.appendChild(b);
        });
    }

    if (mode === "defi") {
        extraGrid.style.display = "grid";
        const defiButtons = [
            { label: "APY", action: "apy" },
            { label: "Compound", action: "compound" }
        ];

        defiButtons.forEach(item => {
            const b = document.createElement("button");
            b.className = "btn btn-sci-op";
            b.innerText = item.label;
            b.addEventListener("click", () => handleDefi(item.action));
            extraGrid.appendChild(b);
        });
    }
}

function handleScientific(action) {
    const num = parseFloat(currentInput);
    if (isNaN(num)) return;

    switch (action) {
        case "sin": currentInput = String(Math.sin(num * Math.PI / 180).toFixed(8)); break;
        case "cos": currentInput = String(Math.cos(num * Math.PI / 180).toFixed(8)); break;
        case "tan": currentInput = String(Math.tan(num * Math.PI / 180).toFixed(8)); break;
        case "sqrt": currentInput = String(Math.sqrt(num).toFixed(8)); break;
        case "log": currentInput = String(Math.log10(num).toFixed(8)); break;
        case "ln": currentInput = String(Math.log(num).toFixed(8)); break;
        case "square": currentInput = String((num * num).toFixed(8)); break;
        case "pi": currentInput = String(Math.PI.toFixed(8)); break;
    }
    updateScreen();
}

function handleProgrammer(action) {
    const num = parseInt(currentInput);
    if (isNaN(num)) return;

    switch (action) {
        case "hex": currentInput = num.toString(16).toUpperCase(); break;
        case "bin": currentInput = num.toString(2); break;
        case "oct": currentInput = num.toString(8); break;
        case "dec": currentInput = String(parseInt(currentInput, currentInput.startsWith("0x") ? 16 : 10)); break;
    }
    updateScreen();
}

function handleDefi(action) {
    // Simple demo: treat currentInput as principal and show example APY
    const principal = parseFloat(currentInput) || 0;

    if (action === "apy") {
        // Example 12% APY
        const result = principal * 0.12;
        history = `${principal} × 12% APY`;
        currentInput = result.toFixed(2);
    }

    if (action === "compound") {
        // Daily compound example for 1 year at 12%
        const rate = 0.12;
        const result = principal * Math.pow(1 + rate / 365, 365);
        history = `Compound (${principal})`;
        currentInput = result.toFixed(2);
    }
    updateScreen();
}

// Keyboard support
document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") {
        if (currentInput === "0") currentInput = e.key;
        else currentInput += e.key;
        updateScreen();
    }
    if (e.key === ".") {
        if (!currentInput.includes(".")) {
            currentInput += ".";
            updateScreen();
        }
    }
    if (e.key === "Enter" || e.key === "=") {
        document.getElementById("btn-equal").click();
    }
    if (e.key === "Backspace") {
        document.getElementById("btn-delete").click();
    }
    if (e.key === "Escape") {
        document.getElementById("btn-clear").click();
    }
    if (["+", "-", "*", "/"].includes(e.key)) {
        const opMap = { "+": "+", "-": "−", "*": "×", "/": "÷" };
        history = currentInput + " " + opMap[e.key];
        currentInput = "0";
        updateScreen();
    }
});

// Initial
updateScreen();
