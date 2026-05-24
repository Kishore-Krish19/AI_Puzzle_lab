# AI Puzzle Lab

A web-based lab of interactive AI-powered puzzles, built with React, TypeScript, Vite, and Gemini AI integration.

---

## Features

- 🧩 Multiple classic puzzle games (Sudoku, Sliding Puzzle, Maze, Color Sorter) built as interactive React components
- 🤖 Optional AI assistance via [Google Gemini](https://ai.google.dev/) API for hints, solving, or puzzle generation
- 🎨 Modern UI with Tailwind CSS and componentized layout (Navbar, Footer, Landing Page)
- 🥳 Animations & effects with Canvas Confetti and Motion for a fun puzzle-solving experience

---

## Project Structure

```
/
├── index.html               # HTML entry point
├── package.json             # Scripts and dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── metadata.json            # Project/app metadata
├── src/
│   ├── App.tsx              # App root component
│   ├── main.tsx             # React/Vite bootstrap
│   ├── index.css            # Global styles (Tailwind)
│   ├── components/
│   │   ├── Footer.tsx
│   │   ├── LandingPage.tsx
│   │   └── Navbar.tsx
│   └── games/
│       ├── ColorSortGame.tsx
│       ├── MazeGame.tsx
│       ├── SlidingPuzzleGame.tsx
│       └── SudokuGame.tsx
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Installation & Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kishore-Krish19/AI_Puzzle_lab.git
   cd AI_Puzzle_lab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **(Optional) Configure Gemini AI API key**

   If using the Gemini-powered AI features, create a `.env.local` file in the project root:
   ```
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. The app runs on [http://localhost:3000](http://localhost:3000)

---

## Available Scripts

- `npm run dev` — Launch the app in development mode
- `npm run build` — Build the app for production
- `npm run preview` — Preview the production build
- `npm run lint` — Run TypeScript checks
- `npm run clean` — Remove the build output

---

## Technologies Used

- React 19, ReactDOM
- TypeScript
- Vite (build tool)
- Tailwind CSS (utility-first styling)
- Google Gemini API (`@google/genai`)
- Express (if backend is used)
- Canvas Confetti, Lucide icons, Motion (UX enhancements)

---

## Folder Guide

- **src/components/**: App UI structure (Navbar, Footer, Landing page, etc.)
- **src/games/**: Puzzle game logic & UI (each a separate TSX file)
- **src/**: Main entry points (App.tsx, main.tsx, index.css)

---

## Contributing

1. Fork this repository
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is under the MIT license.

---

## Author

Made by [Kishore-Krish19](https://github.com/Kishore-Krish19)
