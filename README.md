
![RateCalculator Pro Banner](YOUR_IMAGE_LINK_HERE)

<div align="center">

# RateCalculator Pro

**The ultimate client-side tool for complex product rate calculations, tax estimation, and commission tracking.**

[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

[Features](#features) • [The Math](#calculation-logic) • [Installation](#getting-started) • [Usage](#usage-guide)

</div>

---

## 🚀 Overview

**RateCalculator Pro** is a modern, responsive web application designed for merchants and traders who need to calculate final product costs quickly. Unlike standard spreadsheets, it provides a dedicated UI for managing multiple calculation panels, applying global formulas, and printing clean, invoice-ready tables.

It features **automatic data persistence**, meaning your calculations are saved instantly to your browser's local storage—you'll never lose your work on a refresh.

## ✨ Key Features

### 📊 Dynamic Panel Management
- **Multiple Workspaces:** Create unlimited panels to categorize different product lines.
- **Excel-Style Navigation:** Use `ENTER` to jump between cells and rows for rapid data entry.
- **Smart Fill:** Auto-fill Tax or Commission columns for the entire table with one click.

### 🧠 Intelligent Automation
- **Auto-Commission Engine:** Automatically calculates agent commission based on net value using customizable percentage tiers.
- **Real-time Math:** Results update instantly as you type.

### 🎨 UI & Experience
- **Dark/Light Mode:** Fully responsive theme switching.
- **Clean Print Mode:** Generates a stripped-down, black-and-white "Excel-style" view for physical printing.
- **Data Privacy:** 100% Client-side. Your financial data never leaves your browser.
- **Interactive Guide:** Includes a helpful animated stickman guide to assist new users.

### 📤 Export & Share
- **Clipboard Ready:** One-click copy that formats data specifically for pasting directly into **Microsoft Excel** or **Google Sheets**.

---

## 🧮 Calculation Logic

RateCalculator Pro uses a specific sequence of operations to ensure financial accuracy.

### The Core Formula
The final **Result** column is calculated as follows:

```math
Result = (BasicRate - Discount) + Tax - Commission + Freight
```

1. **Net Rate:** `Basic Rate` - `Discount`
2. **Tax Amount:** `Net Rate` * `Tax %`
3. **Subtotal:** `Net Rate` + `Tax Amount`
4. **Final:** `Subtotal` - `Commission` + `Freight`

### The Commission Formula
The commission is auto-calculated using a configurable two-step percentage logic. By default, it follows this structure:

```math
Commission = [(BasicRate - Discount) * Rate1%] - Rate2%
```

*   **Rate 1 (Default 1.5%):** Applied to the Net Rate.
*   **Rate 2 (Default 12%):** A reduction applied to the result of the first calculation.

> **Note:** You can customize these percentages for every panel by clicking the **"Commission"** header.

---

## 🛠 Getting Started

To run this project locally, you need [Node.js](https://nodejs.org/) installed.

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rate-calculator-pro.git](https://github.com/waleedabdullah415-ai/Rate-Caluculator.git
   cd Rate-Calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## 📖 Usage Guide

| Action | How-To |
| :--- | :--- |
| **Add a Row** | Click the "+ Add Row" button or keep pressing `Enter` at the end of the table. |
| **Configure Commission** | Click the word **"Commission"** in the table header to open the settings modal. Adjust the percentages and click "Save & Recalculate". |
| **Bulk Fill** | Hover over the **Tax %** or **Commission** headers and click the small `Arrow Down` icon to copy the first row's value to all empty rows below. |
| **Print** | Click the `Printer` icon on a specific panel. The app will hide all other panels and UI elements, printing only the selected table. |
| **Export to Excel** | Click the `Copy` icon. Open Excel and press `Ctrl+V`. The columns will align perfectly. |

---

## 💻 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br />

<div align="center">
  <sub>Built with ❤️ by CHAX for Traders in PK.</sub>
</div>
