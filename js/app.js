/* ============================================
   Prism Protocol — Quantum Terminal
   Core Calculator Engine
   ============================================ */

const state = {
    input: "0",          // value currently being typed / shown
    history: "",         // pending expression, e.g. "12 ×"
    mode: "standard",
    justEvaluated: false, // next digit starts a fresh number
    awaitingOperand: false, // operator pressed, no digit typed yet
    base: 10,            // programmer mode display base
    rate: 12             // DeFi annual rate (%)
};

const OP_SYMBOL = { "+": "+", "-": "−", "*": "×", "/": "÷" };
const mainDisplay = document.getElementById("main-display");
const historyDisplay = document.getElementById("history-display");
const extraGrid = document.getElementById("extra-grid");

/* ---------- helpers ---------- */

function format(num) {
    if (typeof num !== "number" || !Number.isFinite(num)) return "Error";
    // trim floating noise (0.1 + 0.2) and trailing zeros
    const clean = Number.parseFloat(num.toPrecision(12));
    if (Math.abs(clean) >= 1e15 || (Math.abs(clean) < 1e-9 && clean !== 0)) {
        return clean.toExponential(6);
    }
    return String(clean);
}

function isError() {
    return state.input === "Error";
}

function currentValue() {
    if (state.base !== 10) {
        const digits = state.input.replace(/^-?0[xbo]/i, m => (m.startsWith("-") ? "-" : ""));
        return parseInt(digits, state.base);
    }
    return parseFloat(state.input);
}

function setBase10(value) {
    state.awaitingOperand = false;
    state.base = 10;
    state.input = format(value);
}

function render() {
    mainDisplay.textContent = state.input;
    historyDisplay.textContent = state.history;
    mainDisplay.classList.toggle("is-error", isError());
    // auto-shrink long numbers so they always fit
    const len = state.input.length;
    mainDisplay.style.fontSize = len > 14 ? "1.5rem" : len > 10 ? "1.9rem" : "";
}

function flash() {
    mainDisplay.classList.remove("flash");
    void mainDisplay.offsetWidth; // restart animation
    mainDisplay.classList.add("flash");
}

/* ---------- core actions ---------- */

function inputDigit(d) {
    if (isError() || state.justEvaluated || state.base !== 10) {
        state.input = "0";
        state.base = 10;
        state.justEvaluated = false;
    }
    state.awaitingOperand = false;
    if (d === ".") {
        if (state.input.includes(".")) return;
        state.input += ".";
    } else {
        state.input = state.input === "0" ? d : state.input === "-0" ? "-" + d : state.input + d;
    }
    render();
}

function inputOperator(op) {
    if (isError()) return;
    const symbol = OP_SYMBOL[op];

    // Operator pressed twice in a row -> just swap the operator
    if (state.history && state.awaitingOperand) {
        state.history = state.history.replace(/\s\S$/, " " + symbol);
        render();
        return;
    }

    const value = format(currentValue());
    state.history = state.history ? `${state.history} ${value} ${symbol}` : `${value} ${symbol}`;
    state.input = "0";
    state.base = 10;
    state.justEvaluated = false;
    state.awaitingOperand = true;
    render();
}

function evaluate() {
    if (!state.history || isError()) return;
    const expression = `${state.history} ${format(currentValue())}`
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-");

    try {
        // Only digits, operators, dots, spaces and exponent notation allowed
        if (!/^[\d\s+\-*/.e()]+$/i.test(expression)) throw new Error("Invalid");
        const result = Function(`"use strict"; return (${expression});`)();
        state.input = format(result);
    } catch {
        state.input = "Error";
    }
    state.history = "";
    state.base = 10;
    state.justEvaluated = true;
    state.awaitingOperand = false;
    render();
    flash();
}

function clearAll() {
    state.input = "0";
    state.history = "";
    state.base = 10;
    state.justEvaluated = false;
    state.awaitingOperand = false;
    render();
}

function deleteLast() {
    if (isError() || state.justEvaluated || state.base !== 10) {
        clearAll();
        return;
    }
    state.input = state.input.length > 1 && state.input !== "-0" ? state.input.slice(0, -1) : "0";
    if (state.input === "-") state.input = "0";
    render();
}

function percent() {
    if (isError()) return;
    setBase10(currentValue() / 100);
    state.justEvaluated = true;
    render();
}

function toggleSign() {
    if (isError() || state.base !== 10) return;
    state.awaitingOperand = false;
    state.input = state.input.startsWith("-") ? state.input.slice(1) : "-" + state.input;
    render();
}

/* ---------- mode-specific controls ---------- */

function handleScientific(action) {
    if (isError()) return;
    const num = currentValue();
    const rad = num * Math.PI / 180;
    let result;

    switch (action) {
        case "sin": result = Math.sin(rad); break;
        case "cos": result = Math.cos(rad); break;
        // tan(90°), tan(270°)... are undefined
        case "tan": result = Math.abs(Math.cos(rad)) < 1e-12 ? NaN : Math.tan(rad); break;
        case "sqrt": result = num < 0 ? NaN : Math.sqrt(num); break;
        case "log": result = num <= 0 ? NaN : Math.log10(num); break;
        case "ln": result = num <= 0 ? NaN : Math.log(num); break;
        case "square": result = num * num; break;
        case "inverse": result = num === 0 ? NaN : 1 / num; break;
        case "fact": result = factorial(num); break;
        case "pi": result = Math.PI; break;
        case "e": result = Math.E; break;
        case "sign": toggleSign(); return;
    }
    setBase10(result);
    state.justEvaluated = true;
    render();
    flash();
}

function factorial(n) {
    if (n < 0 || !Number.isInteger(n) || n > 170) return NaN;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function handleProgrammer(action) {
    if (isError()) return;
    const num = currentValue();
    if (!Number.isFinite(num) || !Number.isInteger(num)) {
        state.input = "Error";
        render();
        return;
    }
    state.awaitingOperand = false;
    const sign = num < 0 ? "-" : "";
    const abs = Math.abs(num);

    switch (action) {
        case "hex": state.base = 16; state.input = sign + "0x" + abs.toString(16).toUpperCase(); break;
        case "bin": state.base = 2;  state.input = sign + "0b" + abs.toString(2); break;
        case "oct": state.base = 8;  state.input = sign + "0o" + abs.toString(8); break;
        case "dec": state.base = 10; state.input = String(num); break;
    }
    state.justEvaluated = true;
    render();
    flash();
}

function handleDefi(action) {
    if (isError()) return;
    const principal = currentValue() || 0;
    const r = state.rate / 100;
    let result;

    switch (action) {
        case "simple":   // simple interest for 1 year
            result = principal * (1 + r);
            state.history = `${format(principal)} @ ${state.rate}% simple · 1Y`;
            break;
        case "compound": // daily compounding for 1 year
            result = principal * Math.pow(1 + r / 365, 365);
            state.history = `${format(principal)} @ ${state.rate}% daily · 1Y`;
            break;
        case "apy":      // APR -> effective APY (daily compounding)
            result = (Math.pow(1 + r / 365, 365) - 1) * 100;
            state.history = `APR ${state.rate}% → APY %`;
            break;
    }
    state.base = 10;
    state.awaitingOperand = false;
    state.input = Number.isFinite(result) ? String(Math.round(result * 100) / 100) : "Error";
    state.justEvaluated = true;
    render();
    flash();
}

function makeButton(label, onClick, extraClass = "") {
    const b = document.createElement("button");
    b.className = `btn btn-sci-op ${extraClass}`.trim();
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
}

function renderExtraControls(mode) {
    extraGrid.innerHTML = "";
    extraGrid.classList.remove("show");

    const layouts = {
        scientific: [
            ["sin", "sin"], ["cos", "cos"], ["tan", "tan"], ["√", "sqrt"],
            ["log", "log"], ["ln", "ln"], ["x²", "square"], ["1/x", "inverse"],
            ["n!", "fact"], ["π", "pi"], ["e", "e"], ["±", "sign"]
        ].map(([l, a]) => makeButton(l, () => handleScientific(a))),

        programmer: [
            ["HEX", "hex"], ["BIN", "bin"], ["OCT", "oct"], ["DEC", "dec"]
        ].map(([l, a]) => makeButton(l, () => handleProgrammer(a))),

        defi: (() => {
            const wrap = document.createElement("label");
            wrap.className = "rate-field";
            wrap.innerHTML = `<span>APR %</span>`;
            const input = document.createElement("input");
            input.type = "number";
            input.min = "0";
            input.step = "any";
            input.value = state.rate;
            input.addEventListener("input", () => {
                const v = parseFloat(input.value);
                state.rate = Number.isFinite(v) && v >= 0 ? v : 0;
            });
            // don't let typing in the field trigger calculator shortcuts
            input.addEventListener("keydown", e => e.stopPropagation());
            wrap.appendChild(input);
            return [
                wrap,
                makeButton("Simple 1Y", () => handleDefi("simple")),
                makeButton("Compound", () => handleDefi("compound")),
                makeButton("APR→APY", () => handleDefi("apy"))
            ];
        })()
    };

    const items = layouts[mode];
    if (!items) return;
    items.forEach((el, i) => {
        el.style.animationDelay = `${i * 25}ms`;
        extraGrid.appendChild(el);
    });
    extraGrid.classList.add("show");
}

/* ---------- wiring ---------- */

document.querySelectorAll(".btn-num").forEach(btn =>
    btn.addEventListener("click", () => inputDigit(btn.textContent.trim()))
);
document.querySelectorAll("[data-op]").forEach(btn =>
    btn.addEventListener("click", () => inputOperator(btn.dataset.op))
);
document.getElementById("btn-clear").addEventListener("click", clearAll);
document.getElementById("btn-delete").addEventListener("click", deleteLast);
document.getElementById("btn-equal").addEventListener("click", evaluate);
document.querySelector("[data-action='percent']").addEventListener("click", percent);

document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.mode = btn.dataset.mode;
        clearAll();
        renderExtraControls(state.mode);
    });
});

// Ripple effect on every button press
document.addEventListener("pointerdown", e => {
    const btn = e.target.closest(".btn");
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
});

// Keyboard support (uses the same logic as the buttons)
document.addEventListener("keydown", e => {
    const k = e.key;
    if (/^[0-9]$/.test(k) || k === ".") inputDigit(k);
    else if (k in OP_SYMBOL) { e.preventDefault(); inputOperator(k); }
    else if (k === "Enter" || k === "=") { e.preventDefault(); evaluate(); }
    else if (k === "Backspace") deleteLast();
    else if (k === "Escape" || k === "Delete") clearAll();
    else if (k === "%") percent();
});

render();
