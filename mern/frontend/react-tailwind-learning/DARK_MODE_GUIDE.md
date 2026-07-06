# Dark Mode Implementation Guide

This guide documents the implementation of dark mode toggle functionality in the component library, demonstrating React state management, Tailwind CSS dark mode configuration, and conditional styling patterns.

## 📋 Overview

Dark mode implementation demonstrates:
- **Tailwind CSS Dark Mode** - Class-based dark mode configuration
- **React State Management** - Using `useState` hook for toggle state
- **Conditional Styling** - Applying dark mode classes conditionally
- **Component Scoping** - Scoped dark mode to specific sections
- **User Experience** - Smooth transitions and visual feedback

## 🎯 Objective

Implement a dark mode toggle that:
1. Only affects the ComponentDemo section (scoped)
2. Uses Tailwind CSS dark mode classes
3. Provides smooth transitions
4. Shows clear visual feedback
5. Maintains component consistency

## 📁 Files Modified/Created

### Files Modified:
- `tailwind.config.js` - Added dark mode configuration
- `src/components/Card.jsx` - Added dark mode classes
- `src/components/ComponentDemo.jsx` - Created with dark mode toggle
- `src/App.jsx` - Updated to include all components

### Quick Reference: Where Each Step Goes

| Step | File | Location |
|------|------|----------|
| Step 1: Configure Tailwind | `tailwind.config.js` | Add `darkMode: 'class'` to config object |
| Step 2: Update Card Component | `src/components/Card.jsx` | Add `dark:*` classes to existing classes |
| Step 3: Create ComponentDemo | `src/components/ComponentDemo.jsx` | Create new file with useState hook |
| Step 4: Toggle Button | `src/components/ComponentDemo.jsx` | Inside ComponentDemo, after opening wrapper div |
| Step 5: Apply Dark Mode | `src/components/ComponentDemo.jsx` | Inside ComponentDemo, in all section elements |
| Step 6: User Profile | `src/components/ComponentDemo.jsx` | Inside ComponentDemo, in Section 3 |

## 🚀 Step-by-Step Implementation

### Step 1: Configure Tailwind CSS for Dark Mode

Enable class-based dark mode in Tailwind configuration.

**File: `tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',  // Enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Key Configuration:**
- `darkMode: 'class'` - Enables class-based dark mode
- Dark mode activates when `.dark` class is present on a parent element
- More flexible than `'media'` (which uses prefers-color-scheme)

**Why 'class' instead of 'media'?**
- User control: Users can toggle manually
- Scoped: Can apply to specific sections
- Better UX: Not dependent on system preferences

### Step 2: Update Card Component for Dark Mode

Add dark mode variants to all Card component styles.

**File: `src/components/Card.jsx`**

```jsx
function Card({ title, children, borderColor = 'border-gray-300', footer }) {
  return (
    <div className={`border-4 ${borderColor} rounded-lg bg-white dark:bg-gray-800 shadow-lg`}>
      {/* Title Section */}
      {title && (
        <div className="border-b-2 border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 dark:text-gray-200">
        {children}
      </div>

      {/* Footer Section */}
      {footer && (
        <div className="border-t-2 border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          {footer}
        </div>
      )}
    </div>
  )
}
```

**Dark Mode Classes Added:**

| Element | Light Mode | Dark Mode | Purpose |
|---------|------------|-----------|---------|
| Main Container | `bg-white` | `dark:bg-gray-800` | Card background |
| Title Section | `bg-gray-50` | `dark:bg-gray-900` | Header background |
| Title Text | `text-gray-800` | `dark:text-white` | Title color |
| Borders | `border-gray-200` | `dark:border-gray-700` | Border color |
| Content Text | (default) | `dark:text-gray-200` | Content color |
| Footer Section | `bg-gray-50` | `dark:bg-gray-900` | Footer background |

**Pattern:**
- Light mode classes come first
- Dark mode classes prefixed with `dark:`
- Tailwind applies dark classes when parent has `.dark` class

### Step 3: Create ComponentDemo with Dark Mode Toggle

Implement the main component with state management and toggle functionality.

**File: `src/components/ComponentDemo.jsx`**

```jsx
import { useState } from 'react'
import Button from './Button.jsx'
import Card from './Card.jsx'

function ComponentDemo() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8">
        {/* Toggle Section */}
        {/* Component Sections */}
      </div>
    </div>
  )
}
```

**Key Concepts:**

1. **useState Hook**
   ```jsx
   const [darkMode, setDarkMode] = useState(false)
   ```
   - `darkMode` - Current state (boolean)
   - `setDarkMode` - Function to update state
   - `false` - Initial value (light mode)

2. **Conditional Class Application**
   ```jsx
   <div className={darkMode ? 'dark' : ''}>
   ```
   - Adds `.dark` class when `darkMode` is `true`
   - Removes class when `darkMode` is `false`
   - Tailwind dark mode classes activate when `.dark` is present

3. **Scoped Dark Mode**
   - Dark mode only affects ComponentDemo section
   - Other components (FlexDemo, GridDemo) remain in light mode
   - Achieved by wrapping only ComponentDemo in `.dark` div

### Step 4: Implement Dark Mode Toggle Button

**File Location:** `src/components/ComponentDemo.jsx`

Create a toggle button with visual feedback. This code goes inside the ComponentDemo component, right after the opening wrapper div (after line 10 in the component structure).

**File: `src/components/ComponentDemo.jsx`**

```jsx
import { useState } from 'react'
import Button from './Button.jsx'
import Card from './Card.jsx'

function ComponentDemo() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8">
        {/* TOP SECTION - Dark Mode Toggle Button */}
        {/* Add this code here: */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Component Library
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* Rest of component sections */}
        <div className="space-y-8">
          {/* ... */}
        </div>
      </div>
    </div>
  )
}

export default ComponentDemo
```

**Where to add:** Place the toggle button code right after the opening `<div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8">` and before the `<div className="space-y-8">` that contains the sections.

**Toggle Button Features:**

1. **State Toggle**
   ```jsx
   onClick={() => setDarkMode(!darkMode)}
   ```
   - Toggles `darkMode` between `true` and `false`
   - Uses functional update pattern

2. **Dynamic Icon**
   ```jsx
   {darkMode ? '☀️' : '🌙'}
   ```
   - Shows sun (☀️) when in dark mode (click to go light)
   - Shows moon (🌙) when in light mode (click to go dark)
   - Visual indicator of current state

3. **Dynamic Text**
   ```jsx
   {darkMode ? 'Light Mode' : 'Dark Mode'}
   ```
   - Shows "Light Mode" when dark (action available)
   - Shows "Dark Mode" when light (action available)
   - Clear user instruction

4. **Dark Mode Styles**
   ```jsx
   className="... dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
   ```
   - Button adapts to dark mode
   - Maintains contrast and readability
   - Smooth transitions

### Step 5: Apply Dark Mode to All Sections

Add dark mode classes throughout ComponentDemo sections. All these sections go in **`src/components/ComponentDemo.jsx`** inside the `<div className="space-y-8">` container.

**File: `src/components/ComponentDemo.jsx`**

**Section 1 - Button Components:**
```jsx
<section className="border-4 border-blue-500 bg-white dark:bg-gray-800 p-6 rounded-lg">
  <h2 className="text-3xl font-bold text-blue-600 dark:text-white mb-6">
    Button Components
  </h2>
  {/* ... */}
</section>
```

**Section 2 - Card Components:**
```jsx
<section className="border-4 border-blue-500 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
  <h2 className="text-3xl font-bold text-blue-600 dark:text-white mb-6">
    Card Components
  </h2>
  {/* Cards with dark mode support */}
</section>
```

**Section 3 - Component Composition:**
```jsx
<section className="border-4 border-blue-500 bg-white dark:bg-gray-800 p-6 rounded-lg">
  <h2 className="text-3xl font-bold text-blue-600 dark:text-white mb-6">
    Component Composition
  </h2>
  {/* User profile card */}
</section>
```

**Dark Mode Classes Used:**

| Element | Light | Dark | Notes |
|---------|-------|------|-------|
| Section Backgrounds | `bg-white`, `bg-gray-50` | `dark:bg-gray-800`, `dark:bg-gray-900` | Alternating for contrast |
| Titles | `text-blue-600` | `dark:text-blue-400`, `dark:text-white` | Maintains visibility |
| Content Text | `text-gray-700` | `dark:text-gray-300` | Readable contrast |
| Borders | `border-blue-500` | (same) | Borders remain visible |

### Step 6: Dark Mode for User Profile Section

Add dark mode support to nested components.

```jsx
<div className="border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
  {/* User Avatar */}
  <div className="flex items-center gap-4 mb-4">
    <div className="w-16 h-16 bg-purple-500 rounded-full ...">
      JD
    </div>
    <div>
      <h4 className="text-xl font-bold text-gray-800 dark:text-white">
        John Doe
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        john.doe@example.com
      </p>
    </div>
  </div>

  {/* Badges */}
  <div className="flex gap-2 flex-wrap">
    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full ...">
      Developer
    </span>
    {/* More badges */}
  </div>
</div>
```

**Special Dark Mode Techniques:**

1. **Opacity with Slash Notation**
   ```jsx
   dark:bg-yellow-900/20
   ```
   - Uses opacity modifier (`/20` = 20% opacity)
   - Subtle background in dark mode
   - Maintains yellow tint while being dark-friendly

2. **Badge Colors**
   ```jsx
   bg-blue-100 dark:bg-blue-900
   text-blue-800 dark:text-blue-200
   ```
   - Light badges: Light background, dark text
   - Dark badges: Dark background, light text
   - Maintains color identity in both modes

## 🎨 Dark Mode Color Palette

### Background Colors

| Element | Light Mode | Dark Mode | Purpose |
|---------|------------|-----------|---------|
| Main Background | `bg-gray-50` | `dark:bg-gray-900` | Page background |
| Section Background | `bg-white` | `dark:bg-gray-800` | Card/section background |
| Alt Background | `bg-gray-50` | `dark:bg-gray-900` | Alternating sections |
| Header/Footer | `bg-gray-50` | `dark:bg-gray-900` | Card headers/footers |

### Text Colors

| Element | Light Mode | Dark Mode | Purpose |
|---------|------------|-----------|---------|
| Primary Text | `text-gray-800` | `dark:text-white` | Headings, important text |
| Secondary Text | `text-gray-700` | `dark:text-gray-300` | Body text |
| Tertiary Text | `text-gray-600` | `dark:text-gray-300` | Subtle text |
| Muted Text | `text-gray-500` | `dark:text-gray-400` | Timestamps, labels |

### Border Colors

| Element | Light Mode | Dark Mode | Purpose |
|---------|------------|-----------|---------|
| Section Borders | `border-blue-500` | `border-blue-500` | Main borders (same) |
| Divider Borders | `border-gray-200` | `dark:border-gray-700` | Card dividers |
| Toggle Button | `border-gray-300` | `dark:border-gray-600` | Button border |

### Accent Colors

| Element | Light Mode | Dark Mode | Purpose |
|---------|------------|-----------|---------|
| Primary Accent | `text-blue-600` | `dark:text-blue-400` | Main headings |
| Badge Backgrounds | `bg-*-100` | `dark:bg-*-900` | Status badges |
| Badge Text | `text-*-800` | `dark:text-*-200` | Badge text |

## 🔧 React Concepts Demonstrated

### useState Hook

**What is useState?**
- React hook for managing component state
- Returns current state and setter function
- Triggers re-render when state changes

**Syntax:**
```jsx
const [state, setState] = useState(initialValue)
```

**In Our Implementation:**
```jsx
const [darkMode, setDarkMode] = useState(false)
```

**How It Works:**
1. Initial render: `darkMode = false`
2. User clicks toggle: `setDarkMode(!darkMode)` called
3. State updates: `darkMode = true`
4. Component re-renders with new state
5. Dark mode classes activate

### Conditional Rendering

**Template Literal with Ternary:**
```jsx
className={darkMode ? 'dark' : ''}
```

**How It Works:**
- If `darkMode` is `true`: className becomes `"dark"`
- If `darkMode` is `false`: className becomes `""`
- Tailwind checks for `.dark` class on parent
- Dark mode classes activate when `.dark` is present

### Event Handlers

**Inline Arrow Function:**
```jsx
onClick={() => setDarkMode(!darkMode)}
```

**What Happens:**
1. User clicks button
2. Arrow function executes
3. `setDarkMode(!darkMode)` called
4. State toggles (true ↔ false)
5. Component re-renders

## 📚 Tailwind CSS Dark Mode

### Class-Based Dark Mode

**Configuration:**
```javascript
darkMode: 'class'
```

**How It Works:**
- Tailwind checks for `.dark` class on parent element
- When `.dark` is present, `dark:*` classes activate
- Scoped to elements with `.dark` ancestor

**Example:**
```jsx
<div className="dark">  {/* Parent with .dark */}
  <div className="bg-white dark:bg-gray-800">
    {/* This div will be gray-800 in dark mode */}
  </div>
</div>
```

### Dark Mode Class Syntax

**Pattern:**
```
dark:{utility-class}
```

**Examples:**
- `dark:bg-gray-800` - Dark background
- `dark:text-white` - Dark text color
- `dark:border-gray-700` - Dark border
- `dark:hover:bg-gray-700` - Dark hover state

### Scoped Dark Mode

**Why Scope?**
- Only ComponentDemo needs dark mode
- FlexDemo and GridDemo stay light
- Better user experience
- More flexible implementation

**Implementation:**
```jsx
// ComponentDemo - has dark mode
<div className={darkMode ? 'dark' : ''}>
  {/* Dark mode classes work here */}
</div>

// FlexDemo - no dark mode wrapper
<FlexDemo />
// Dark mode classes don't activate
```

## ✅ Best Practices

### 1. Color Contrast

✅ **Do:**
- Use sufficient contrast ratios (WCAG AA: 4.5:1)
- Test readability in both modes
- Use semantic color names

❌ **Don't:**
- Use low contrast colors
- Assume light colors work in dark mode
- Forget to test accessibility

### 2. State Management

✅ **Do:**
- Use useState for simple toggles
- Consider Context API for global dark mode
- Persist preference to localStorage

❌ **Don't:**
- Use complex state for simple toggles
- Forget to handle initial state
- Create unnecessary re-renders

### 3. Transitions

✅ **Do:**
- Add transitions for smooth changes
- Use `transition-all duration-200`
- Test transition performance

❌ **Don't:**
- Skip transitions (jarring UX)
- Use long durations (feels slow)
- Animate everything (performance)

### 4. Component Design

✅ **Do:**
- Design components for both modes
- Use consistent color palette
- Test all variants

❌ **Don't:**
- Hard-code colors
- Ignore dark mode in design
- Create mode-specific components

## 🚀 Advanced Patterns

### Persisting Dark Mode Preference

**Using localStorage:**
```jsx
function ComponentDemo() {
  const [darkMode, setDarkMode] = useState(() => {
    // Get saved preference or default to false
    return localStorage.getItem('darkMode') === 'true'
  })

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode.toString())
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* ... */}
      <button onClick={toggleDarkMode}>
        {/* ... */}
      </button>
    </div>
  )
}
```

### Global Dark Mode with Context

**Create DarkModeContext:**
```jsx
import { createContext, useContext, useState } from 'react'

const DarkModeContext = createContext()

export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false)
  
  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  return useContext(DarkModeContext)
}
```

**Usage:**
```jsx
function ComponentDemo() {
  const { darkMode, setDarkMode } = useDarkMode()
  
  return (
    <button onClick={() => setDarkMode(!darkMode)}>
      Toggle
    </button>
  )
}
```

### System Preference Detection

**Detect System Preference:**
```jsx
function ComponentDemo() {
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Listen for system changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => setDarkMode(e.matches)
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* ... */}
    </div>
  )
}
```

## 🎓 Learning Outcomes

After studying this implementation, students will understand:

1. ✅ How to configure Tailwind CSS dark mode
2. ✅ Using useState hook for state management
3. ✅ Conditional class application
4. ✅ Scoped dark mode implementation
5. ✅ Dark mode color palette design
6. ✅ Smooth transitions and UX
7. ✅ Component composition with dark mode
8. ✅ Best practices for dark mode

## 🚀 Next Steps

After mastering dark mode, students can:

1. **Add Persistence**: Save preference to localStorage
2. **Global Dark Mode**: Use Context API for app-wide dark mode
3. **System Detection**: Detect and sync with system preferences
4. **More Components**: Add dark mode to all components
5. **Theme Customization**: Allow users to choose color schemes
6. **Animation**: Add smooth mode transition animations
7. **Accessibility**: Ensure WCAG compliance in both modes

## 📖 Additional Resources

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [React useState Hook](https://react.dev/reference/react/useState)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)

## 🎯 Teaching Tips

### For Instructors

1. **Start Simple**: Begin with basic toggle, then add features
2. **Show State Flow**: Explain how useState triggers re-renders
3. **Demonstrate Scoping**: Show how `.dark` class affects children
4. **Color Theory**: Explain contrast and accessibility
5. **Real Examples**: Show dark mode in popular apps

### Common Student Questions

**Q: Why use 'class' instead of 'media' for darkMode?**
A: 'class' gives user control and allows scoped dark mode. 'media' only responds to system preferences.

**Q: Does dark mode affect performance?**
A: Minimal impact. Tailwind generates CSS for both modes at build time. Only class toggling happens at runtime.

**Q: Can I have multiple dark mode sections?**
A: Yes! Each section can have its own `.dark` wrapper and state.

**Q: How do I test dark mode?**
A: Toggle the button, check contrast ratios, test in both modes, verify all components adapt.

**Q: Should I persist dark mode preference?**
A: Yes, for better UX. Use localStorage to save user preference.

---

**Happy Learning! 🌙☀️**
