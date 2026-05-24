# AI Puzzle Lab

A web-based lab of interactive AI-powered puzzles, built with React, TypeScript, Vite, and Gemini AI integration.

Welcome to **AI Puzzle Lab**! This repository contains interactive puzzle applications powered by AI, with two different deployment targets:

1. **React Web App** deployed on [Vercel](https://vercel.com/) — a full-featured React-based experience.
2. **Single HTML Puzzle** — a standalone `HTML` file (`SingleHtmlPuzzle/index.html`) for simple, easily sharable deployment.

---

## Features

- 🧩 Multiple classic puzzle games (Sudoku, Sliding Puzzle, Maze, Color Sorter) built as interactive React components
- 🤖 Optional AI assistance via [Google Gemini](https://ai.google.dev/) API for hints, solving, or puzzle generation
- 🎨 Modern UI with Tailwind CSS and componentized layout (Navbar, Footer, Landing Page)
- 🥳 Animations & effects with Canvas Confetti and Motion for a fun puzzle-solving experience

---

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure

```
AI_Puzzle_lab/
├── public/                     # Static assets for the React app
├── src/                        # React app source code
│   └── ...                     # Components, hooks, utilities, etc.
├── SingleHtmlPuzzle/
│   └── index.html              # Self-contained HTML puzzle app
├── package.json
└── README.md                   # You're here!
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Kishore-Krish19/AI_Puzzle_lab.git
cd AI_Puzzle_lab
```

---

### 2. Run the React Web App Locally

> _**Pre-requisite:** [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine._

```bash
npm install
npm run dev         # or 'npm start' as per your scripts
```

- Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## Deployment

### Vercel React App

The main React application is set up for continuous deployment via [Vercel](https://vercel.com/).

#### Deploy Manually

1. Push your latest changes to the repository.
2. Visit the [Vercel Dashboard](https://vercel.com/) and import this repository if not done already.
3. Vercel will automatically build and deploy your app on every push to main.

Your live app will be available at the Vercel-assigned URL.

#### Configure Environment Variables

If your app needs environment variables, set them up in the Vercel dashboard under project settings.

---

### Single HTML Puzzle

The `SingleHtmlPuzzle/index.html` is a self-contained HTML file and can be deployed anywhere static files are supported (GitHub Pages, your own server, Netlify, etc).

#### To Use:

- Open `SingleHtmlPuzzle/index.html` directly in your browser.
- Or, upload the file to any static hosting provider.

##### GitHub Pages Deployment

1. Move or copy `SingleHtmlPuzzle/index.html` to the root or to `/docs` and enable GitHub Pages in the repository settings pointing to the correct path.
2. The HTML puzzle will then be accessible via `https://<username>.github.io/AI_Puzzle_lab/SingleHtmlPuzzle/` (or the path you chose).

---

## Usage

### React Web App

- Visit the deployed site (Vercel URL shown in your dashboard).
- Interactive puzzles, leaderboards, progress tracking, and more (subject to implementation).

### Single HTML Puzzle

- Use for demos, lightweight deployment, or as an embeddable widget.
- No server setup required. One file, instant puzzle!

---

## Tech Stack

- **React** (with TypeScript) — Main application.
- **HTML/CSS/JavaScript** — Used in the Single HTML Puzzle.
- **Vercel** — For frictionless deployment and hosting.
- **GitHub Pages** (Optional) — For static single puzzle hosting.

---

## Contributing

Contributions are welcome! Suggestions, bug reports, and pull requests are appreciated.

1. Fork this repo
2. Make your changes (ensure code quality and add tests if relevant)
3. Submit a pull request describing your changes

---

## License

[MIT](LICENSE)

---

## Maintainer

- [@Kishore-Krish19](https://github.com/Kishore-Krish19)
