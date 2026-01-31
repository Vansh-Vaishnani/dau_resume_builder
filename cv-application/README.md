# CV Application - React Learning Project

A professional CV/Resume builder application built with React, demonstrating key React concepts from The Odin Project curriculum.

## 🎯 React Concepts Demonstrated

### 1. **Component Composition**
- Breaking down the UI into reusable components (`GeneralInfo`, `Education`, `Experience`, `ResumePreview`)
- Each component has a single, well-defined responsibility

### 2. **State Management with useState**
- Managing local component state for edit/display modes
- Managing form input state with controlled components
- Working with complex state objects and arrays

### 3. **Lifting State Up**
- All CV data is managed in the parent `App` component
- Child components receive data through props and communicate changes back through callback functions
- Demonstrates proper data flow in React (unidirectional data flow)

### 4. **Props**
- Passing data from parent to child components
- Passing callback functions as props to handle child component events
- Props as the mechanism for component communication

### 5. **Controlled Components**
- All form inputs are controlled by React state
- Input values are tied to state, changes update state via `onChange` handlers
- Demonstrates proper form handling in React

### 6. **Event Handling**
- `onClick` handlers for buttons
- `onChange` handlers for form inputs
- `onSubmit` handlers for forms with `e.preventDefault()`

### 7. **Conditional Rendering**
- Toggling between edit and display modes
- Showing/hiding the resume preview
- Displaying empty states when no data is present
- Using ternary operators and logical AND (`&&`) for conditional rendering

### 8. **Lists and Keys**
- Rendering dynamic lists of education and experience entries
- Using `.map()` to render arrays of data
- Proper use of `key` prop with unique identifiers

### 9. **Array State Manipulation**
- Adding items to arrays with spread operator (`[...array, newItem]`)
- Removing items with `.filter()`
- Demonstrating immutable state updates

### 10. **Form Handling**
- Multiple input fields managed together
- Form submission and validation
- Resetting form state after submission

## 🚀 Features

- ✏️ Add and edit general information (name, email, phone)
- 🎓 Add multiple education entries
- 💼 Add multiple work experience entries
- 👁️ Live preview of your CV
- 📥 Download resume as professional PDF
- 🎨 Clean, modern UI with responsive design

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and development server
- **jsPDF** - PDF generation
- **CSS3** - Styling

## 📚 Project Structure

```
src/
├── App.jsx                 # Main app component (state management)
├── App.css                 # Global styles
├── components/
│   ├── GeneralInfo.jsx     # General info form (props, controlled components)
│   ├── Education.jsx       # Education entries (array state, lists)
│   ├── Experience.jsx      # Work experience (array manipulation)
│   └── ResumePreview.jsx   # CV preview & PDF download
└── styles/
    └── ResumePreview.css   # Preview specific styles
```

## 🎓 Learning Objectives Met

This project covers the core React concepts from The Odin Project:

1. ✅ Understanding JSX
2. ✅ Component creation and composition
3. ✅ Props for component communication
4. ✅ State management with hooks
5. ✅ Controlled components and forms
6. ✅ Event handling
7. ✅ Conditional rendering
8. ✅ Lists and keys
9. ✅ Lifting state up
10. ✅ Practical project implementation

## 🌐 Deployment

This project can be deployed to:
- **Netlify** - Import from GitHub
- **Vercel** - Auto-detects Vite configuration
- **Cloudflare Pages** - Deploy with GitHub integration

## 📝 Usage

1. Fill in your general information (name, email, phone)
2. Add your education entries with school name, degree, and dates
3. Add your work experience with company, position, responsibilities, and dates
4. Click "Preview CV" to see your resume
5. Download as PDF using the download button

## 🎨 Customization

You can customize the CV styling by editing:
- `App.css` - Global styles and color scheme
- `ResumePreview.css` - CV preview and PDF layout
- Colors are defined as CSS variables in `App.css`

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

Built as part of [The Odin Project](https://www.theodinproject.com/) React curriculum.
