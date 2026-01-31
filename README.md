# DAU Resume Builder

A React-based web application to generate LaTeX resumes following Dhirubhai Ambani University's official template format.

## Project Purpose

Build and customize professional resumes in LaTeX format without knowing LaTeX syntax. Exports ready-to-compile ZIP packages for Overleaf.

## Tech Stack

- **React 19** - Component-based UI with hooks (useState, useRef)
- **Vite** - Fast development and build tool
- **JSZip** - ZIP file creation and extraction
- **file-saver** - Browser download functionality
- **react-icons** - UI icons

## Features

- **Smart Import** - Upload existing resume ZIP and auto-fill form
- **Markdown Formatting** - Use `**bold**`, `*italic*`, `\\` for line breaks
- **ZIP Export** - Download complete LaTeX package with logo and templates
- **Live Help** - Built-in instructions modal
- **Professional Output** - Clean usernames display, proper LaTeX escaping

## What I Learned

### React Concepts
- State management with `useState` for complex nested objects
- Form handling with controlled components
- `useRef` for file input and DOM manipulation
- Conditional rendering for dynamic sections

### Advanced JavaScript
- Regex patterns for parsing LaTeX syntax
- String manipulation with placeholders to avoid conflicts
- Async/await with JSZip for file operations
- Bidirectional text conversion (Markdown ↔ LaTeX)

### File Handling
- Browser File API for ZIP uploads
- Blob creation and download triggers
- ZIP structure navigation and parsing
- Base64 encoding for images

### Problem Solving
- Special character escaping in LaTeX
- Placeholder systems to prevent double-escaping
- Auto-detection of nested folder structures in ZIPs
- Regex for unclosed brace patterns

## Usage

1. Fill form with resume details
2. Use Markdown shortcuts for formatting
3. Download ZIP package
4. Upload to Overleaf and compile

## Installation

```bash
npm install
npm run dev
```

## The Odin Project

Part of The Odin Project's React curriculum - building real-world applications with modern web technologies.