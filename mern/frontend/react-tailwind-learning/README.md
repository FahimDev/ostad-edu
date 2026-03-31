# React + Tailwind CSS Learning Project

A React project with Tailwind CSS and visual debugging borders for teaching purposes.

## 🚀 Quick Start

### Installation

```bash
cd mern/frontend/react-tailwind-learning
npm install
```

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in terminal).

## 📁 Project Structure

```
react-tailwind-learning/
├── src/
│   ├── App.jsx          # Main application component
│   ├── index.css        # Tailwind directives + debug utilities
│   └── main.jsx         # Application entry point
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Visual Debugging System

This project includes a visual debugging system using colored borders to help visualize component structure and layout.

### Debug Utility Classes

The following debug classes are available in `src/index.css`:

- `.debug-red` - Red border (4px)
- `.debug-blue` - Blue border (4px)
- `.debug-green` - Green border (4px)
- `.debug-yellow` - Yellow border (4px)
- `.debug-purple` - Purple border (4px)

### Usage Example

```jsx
<div className="debug-red p-4">
  <h2>Component with Red Debug Border</h2>
</div>
```

## 📝 Features

- ✅ React 19 with Vite
- ✅ Tailwind CSS v4
- ✅ Visual debugging utilities
- ✅ Clean, modern UI
- ✅ ES6 modules

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎯 Learning Objectives

This project demonstrates:

1. **React Component Structure** - Clean, functional components
2. **Tailwind CSS Utilities** - Utility-first CSS approach
3. **Visual Debugging** - Using borders to understand layout
4. **ES6 Modules** - Modern JavaScript import/export syntax

## 📚 Key Concepts

### Tailwind CSS Classes Used

- `min-h-screen` - Minimum height of viewport
- `bg-gray-50` - Light gray background
- `p-8` - Padding (2rem / 32px)
- `border-4` - 4px border width
- `border-red-500` - Red border color
- `rounded-lg` - Large border radius
- `max-w-2xl` - Maximum width constraint
- `mx-auto` - Horizontal margin auto (centering)

### Visual Debugging Approach

All components use **4px borders** (`border-4`) for clear visibility. This helps:
- Understand component boundaries
- Visualize spacing and padding
- Debug layout issues
- Learn Tailwind CSS classes

## 🔧 Configuration

### Tailwind CSS

The `tailwind.config.js` file is configured to scan all JS/JSX files in the `src` directory:

```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

### PostCSS

PostCSS is configured with Tailwind CSS and Autoprefixer plugins for optimal CSS processing.

## 📖 Next Steps

1. Add more components with different debug borders
2. Experiment with Tailwind utility classes
3. Create reusable components
4. Build out a complete UI

## 🤝 Contributing

This is a learning project. Feel free to experiment and modify!

---

**Happy Learning! 🎓**
