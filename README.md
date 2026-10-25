<!-- ═════════════ HEADER ═════════════ -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:05070c,50:0051ff,100:00d2ff&height=200&section=header&text=Quantum%20Terminal&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=Prism%20Protocol%20%E2%80%A2%20Cyberpunk%20Multi-Mode%20Calculator&descAlignY=58&descSize=16" width="100%" />
</p>

<p align="center">
  <img src="assets/logo.png" width="84" alt="Prism Protocol logo" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=20&duration=2600&pause=800&color=00D2FF&center=true&vCenter=true&width=600&lines=Standard+%E2%80%A2+Scientific+%E2%80%A2+Programmer+%E2%80%A2+DeFi;HEX+%2F+BIN+%2F+OCT+conversions;APR+%E2%86%92+APY+and+compound+yield;Zero+dependencies.+Pure+HTML%2C+CSS+%26+JS." alt="Typing SVG" />
</p>

<p align="center">
  <a href="https://krishyaa06.github.io/prism-protocol-calculator/"><img src="https://img.shields.io/badge/LIVE%20DEMO-00d2ff?style=for-the-badge&logo=githubpages&logoColor=black" /></a>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <a href="LICENSE"><img src="https://img.shields.io/github/license/krishyaa06/prism-protocol-calculator?style=for-the-badge&color=6C63FF" /></a>
  <img src="https://img.shields.io/github/stars/krishyaa06/prism-protocol-calculator?style=for-the-badge&color=0051ff" />
</p>

<p align="center">
  <a href="https://krishyaa06.github.io/prism-protocol-calculator/"><img src="assets/screenshots/hero.png" width="90%" alt="Quantum Terminal screenshot" /></a>
</p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%" />

## ⚡ Overview

**Quantum Terminal** is a sleek, cyberpunk-themed web calculator built for the **Prism Protocol** community.
It combines four calculation modes in a single glassmorphism interface with neon glow, smooth animations and full keyboard support. No frameworks, no build step: just open `index.html`.

## 🎬 Demo

<p align="center">
  <img src="assets/screenshots/demo.gif" width="380" alt="Quantum Terminal demo" />
</p>

## 🧩 Modes

<table>
  <tr>
    <td align="center" width="25%"><img src="assets/screenshots/mode-standard.png" width="100%" /><br><b>STD</b><br><sub>Everyday arithmetic</sub></td>
    <td align="center" width="25%"><img src="assets/screenshots/mode-scientific.png" width="100%" /><br><b>SCI</b><br><sub>Trig, logs, powers</sub></td>
    <td align="center" width="25%"><img src="assets/screenshots/mode-programmer.png" width="100%" /><br><b>PROG</b><br><sub>Base conversions</sub></td>
    <td align="center" width="25%"><img src="assets/screenshots/mode-defi.png" width="100%" /><br><b>DEFI</b><br><sub>Yield maths</sub></td>
  </tr>
</table>

| Mode | Functions |
|------|-----------|
| **STD** | `+` `−` `×` `÷` `%`, operator chaining, delete and clear |
| **SCI** | `sin` `cos` `tan` (degrees), `√`, `log`, `ln`, `x²`, `1/x`, `n!`, `π`, `e`, `±` |
| **PROG** | Convert integers between **HEX** (`0x`), **BIN** (`0b`), **OCT** (`0o`) and **DEC**; converted values can be used in further calculations |
| **DEFI** | Custom **APR %** input · **Simple 1Y** return · **Compound** (daily, 1 year) · **APR → APY** conversion |

## ✨ Features

- 🌌 **Animated UI**: floating gradient orbs, drifting grid, rotating neon border, ripple on every button press and a result flash
- ⌨️ **Full keyboard support**: digits, `+ - * /`, `Enter` / `=`, `Backspace`, `Esc`, `%`
- 🛡️ **Safe evaluation**: expressions are validated before they are computed; division by zero, `√` of negatives and undefined `tan` show `Error` instead of `NaN` / `Infinity`
- 🎯 **Precise output**: floating-point noise is trimmed (`0.1 + 0.2 = 0.3`) and long numbers auto-shrink to fit
- 📱 **Responsive**: looks great from 320px phones to desktops
- ♿ **Accessible**: live-region display and `prefers-reduced-motion` support
- 🪶 **Lightweight**: zero dependencies, about 25 KB total

## 📱 Mobile

<p align="center">
  <img src="assets/screenshots/mobile.png" width="300" alt="Mobile view" />
</p>

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/krishyaa06/prism-protocol-calculator.git
cd prism-protocol-calculator

# 2. Run (any static server works, or just open index.html)
python -m http.server 8080
# → http://localhost:8080
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0`–`9`, `.` | Enter number |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete last digit |
| `Esc` or `Delete` | Clear all |
| `%` | Percent |

## 📁 Project Structure

```text
prism-protocol-calculator/
├── index.html              # Markup and layout
├── css/
│   └── style.css           # Cyberpunk theme and animations
├── js/
│   └── app.js              # Calculator engine (state, modes, keyboard)
├── assets/
│   ├── logo.png            # Prism Protocol logo
│   └── screenshots/        # README images and demo GIF
├── LICENSE
└── README.md
```

## 🗺️ Roadmap

- [x] Four calculation modes
- [x] Keyboard support
- [x] Animated cyberpunk UI
- [ ] Calculation history panel
- [ ] Bitwise operators (AND, OR, XOR) in PROG mode
- [ ] Custom compounding period and duration in DEFI mode
- [ ] Installable PWA (offline support)

## 🤝 Contributing

Contributions are welcome.

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing-idea`
3. Commit: `git commit -m "Add amazing idea"`
4. Push and open a Pull Request

## 👤 Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/krishyaa06"><img src="https://github.com/krishyaa06.png" width="90" style="border-radius:50%" /><br><b>Soumya Bhandare</b></a><br>
      <sub>Founder @ Prism Protocol</sub>
    </td>
    <td>
      <a href="https://dc.gg/prismprotocol"><img src="https://img.shields.io/badge/Discord-Prism%20Protocol-5865F2?style=for-the-badge&logo=discord&logoColor=white" /></a><br>
      <a href="https://instagram.com/prism_protocol_"><img src="https://img.shields.io/badge/Instagram-@prism__protocol__-E4405F?style=for-the-badge&logo=instagram&logoColor=white" /></a><br>
      <a href="https://x.com/krishyaa06"><img src="https://img.shields.io/badge/X-@krishyaa06-000000?style=for-the-badge&logo=x&logoColor=white" /></a>
    </td>
  </tr>
</table>

## 📄 License

Released under the [MIT License](LICENSE).

<p align="center">
  <b>If you like this project, consider giving it a ⭐</b><br>
  <sub>"Build. Create. Compete." · Made with ⚡ by Prism Protocol</sub>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00d2ff,50:0051ff,100:05070c&height=110&section=footer" width="100%" />
