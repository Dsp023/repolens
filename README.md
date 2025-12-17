# RepoLens

**RepoLens** is a modern, AI-powered tool that helps you understand GitHub repositories in seconds. Just paste a repository URL, and it generates a beginner-friendly explanation, tech stack summary, and simplified running instructions.

## ✨ Features

- **AI-Powered Analysis**: Uses Google's Gemini 2.0 Flash model to simplify complex codebases.
- **Instant Insights**: Get a summary, tech stack, and target audience breakdown.
- **Smart File Structure**: Visualizes the project structure in a clean, readable tree format (automatically stripping messy HTML).
- **GitHub-Style UI**: A premium, clean interface inspired by GitHub's design system ("Primer").
- **Dark Mode**: Fully supported dark theme for late-night coding sessions.
- **Responsive Design**: Looks great on desktop and mobile.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (with custom GitHub-themed variables)
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Icons**: Custom SVG icons

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key (Get one [here](https://aistudio.google.com/app/apikey))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Dsp023/repolens.git
    cd repolens
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file in the root directory and add your API Key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the App:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🤝 Credits

Created by **Devi Sri Prasad**.

