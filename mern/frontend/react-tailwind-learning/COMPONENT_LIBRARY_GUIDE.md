# Reusable Component Library Guide

This guide documents the creation of a reusable component library with Button and Card components, demonstrating props, variants, and composition patterns in React with Tailwind CSS.

## 📋 Overview

The component library demonstrates essential React patterns for building reusable, flexible components:
- **Props and Default Values** - Making components configurable
- **Variant Patterns** - Creating multiple styles from one component
- **Component Composition** - Building complex UIs from simple components
- **Conditional Rendering** - Showing/hiding parts based on props
- **Spread Props** - Passing through HTML attributes

## 🎯 Objective

Create a practical component library that teaches:
1. How to build reusable React components
2. Props and default values pattern
3. Variant system implementation
4. Component composition techniques
5. Real-world component patterns

## 📁 Files Created/Modified

### Files Created:
- `src/components/Button.jsx` - Reusable Button component with variants and sizes
- `src/components/Card.jsx` - Reusable Card component with optional sections
- `src/components/ComponentDemo.jsx` - Demonstration of component library usage

### Files Modified:
- `src/App.jsx` - Added ComponentDemo to the main application

## 🚀 Step-by-Step Implementation

### Step 1: Create Button Component

The Button component demonstrates props, variants, and dynamic class composition.

**File: `src/components/Button.jsx`**

```jsx
function Button({ variant = 'primary', size = 'md', children, ...props }) {
  // Variant styles
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-700',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white border-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white border-red-700',
    success: 'bg-green-500 hover:bg-green-600 text-white border-green-700',
  }

  // Size styles
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  // Base classes
  const baseClasses = 'border-2 rounded-lg font-semibold transition-all duration-200 active:scale-95'

  // Combine all classes
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]}`

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
```

**Key Concepts:**

1. **Props Destructuring with Defaults**
   ```jsx
   function Button({ variant = 'primary', size = 'md', children, ...props })
   ```
   - `variant = 'primary'` - Default variant if not provided
   - `size = 'md'` - Default size if not provided
   - `children` - Content inside the button
   - `...props` - Spread operator to pass through other props (onClick, disabled, etc.)

2. **Variant Object Pattern**
   ```jsx
   const variants = {
     primary: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-700',
     // ...
   }
   ```
   - Stores all variant styles in an object
   - Easy to add new variants
   - Centralized style management

3. **Dynamic Class Composition**
   ```jsx
   const classes = `${baseClasses} ${variants[variant]} ${sizes[size]}`
   ```
   - Combines base, variant, and size classes
   - Uses template literals for string interpolation
   - Accesses object properties dynamically

4. **Spread Props**
   ```jsx
   <button className={classes} {...props}>
   ```
   - Passes through any additional props (onClick, disabled, type, etc.)
   - Makes component flexible and HTML-compliant

**Button Variants:**

| Variant | Colors | Use Case |
|---------|--------|----------|
| `primary` | Blue | Main actions, primary CTAs |
| `secondary` | Gray | Secondary actions, less important |
| `danger` | Red | Destructive actions (delete, remove) |
| `success` | Green | Positive actions (save, confirm) |

**Button Sizes:**

| Size | Padding | Text Size | Use Case |
|------|---------|-----------|----------|
| `sm` | px-3 py-1 | text-sm | Compact spaces, dense layouts |
| `md` | px-4 py-2 | text-base | Standard buttons (default) |
| `lg` | px-6 py-3 | text-lg | Prominent CTAs, hero sections |

**Base Classes Explained:**
- `border-2` - 2px border for definition
- `rounded-lg` - Large border radius
- `font-semibold` - Bold text
- `transition-all duration-200` - Smooth transitions
- `active:scale-95` - Press animation (scales down on click)

### Step 2: Create Card Component

The Card component demonstrates conditional rendering and flexible composition.

**File: `src/components/Card.jsx`**

```jsx
function Card({ title, children, borderColor = 'border-gray-300', footer }) {
  return (
    <div className={`border-4 ${borderColor} rounded-lg bg-white shadow-lg`}>
      {/* Title Section */}
      {title && (
        <div className="border-b-2 border-gray-200 p-4 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        {children}
      </div>

      {/* Footer Section */}
      {footer && (
        <div className="border-t-2 border-gray-200 p-4 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
```

**Key Concepts:**

1. **Conditional Rendering**
   ```jsx
   {title && (
     <div>...</div>
   )}
   ```
   - Only renders if `title` prop exists
   - Uses JavaScript's truthy/falsy evaluation
   - Clean, readable syntax

2. **Dynamic Border Color**
   ```jsx
   borderColor = 'border-gray-300'
   className={`border-4 ${borderColor} ...`}
   ```
   - Default border color if not provided
   - Template literal for dynamic class
   - Allows customization per card instance

3. **Children Prop**
   ```jsx
   <div className="p-6">
     {children}
   </div>
   ```
   - Renders any content passed between opening/closing tags
   - Makes component flexible and composable

4. **Footer as React Element**
   ```jsx
   footer={...}
   {footer && <div>{footer}</div>}
   ```
   - Accepts any React element (button, text, multiple elements)
   - Enables complex footer compositions

**Card Structure:**

```
┌─────────────────────────┐
│  Title (optional)       │ ← border-b-2, bg-gray-50
├─────────────────────────┤
│                         │
│  Content (children)     │ ← p-6, flexible content
│                         │
├─────────────────────────┤
│  Footer (optional)      │ ← border-t-2, bg-gray-50
└─────────────────────────┘
```

**Card Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | undefined | Card title (renders header section) |
| `children` | ReactNode | required | Main card content |
| `borderColor` | string | 'border-gray-300' | Tailwind border color class |
| `footer` | ReactNode | undefined | Footer content (buttons, text, etc.) |

### Step 3: Create ComponentDemo Component

This component demonstrates how to use Button and Card together.

**File: `src/components/ComponentDemo.jsx`**

```jsx
import Button from './Button.jsx'
import Card from './Card.jsx'

function ComponentDemo() {
  return (
    <div className="space-y-8">
      {/* Section 1 - Button Variants */}
      <section className="border-4 border-blue-500 bg-white p-6 rounded-lg">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Button Components</h2>
        
        {/* Button Variants */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Button Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
          </div>
        </div>

        {/* Button Sizes */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Button Sizes</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </div>
      </section>

      {/* Section 2 - Card Components */}
      <section className="border-4 border-blue-500 bg-white p-6 rounded-lg">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Card Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Red Card */}
          <Card 
            title="Red Card" 
            borderColor="border-red-500"
            footer={
              <Button variant="danger" size="sm">Delete</Button>
            }
          >
            <p className="text-gray-700">
              This is a red card with a danger button in the footer.
            </p>
          </Card>

          {/* Blue Card */}
          <Card 
            title="Blue Card" 
            borderColor="border-blue-500"
          >
            <p className="text-gray-700">
              This is a blue card without a footer.
            </p>
          </Card>

          {/* Green Card */}
          <Card 
            title="Green Card" 
            borderColor="border-green-500"
            footer={
              <div className="flex gap-2">
                <Button variant="success" size="sm">Save</Button>
                <Button variant="secondary" size="sm">Cancel</Button>
              </div>
            }
          >
            <p className="text-gray-700">
              This green card has multiple buttons in the footer.
            </p>
          </Card>
        </div>
      </section>

      {/* Section 3 - Component Composition */}
      <section className="border-4 border-blue-500 bg-white p-6 rounded-lg">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Component Composition</h2>
        
        <Card 
          title="User Profile" 
          borderColor="border-purple-500"
          footer={
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Last updated: Today</span>
              <Button variant="primary" size="sm">Edit Profile</Button>
            </div>
          }
        >
          <div className="border-2 border-yellow-400 bg-yellow-50 p-4 rounded">
            {/* User Avatar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                JD
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">John Doe</h4>
                <p className="text-gray-600">john.doe@example.com</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                Developer
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Active
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                Premium
              </span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default ComponentDemo
```

**Section Breakdown:**

**Section 1: Button Components**
- Shows all 4 variants in a flex container
- Shows all 3 sizes using primary variant
- Demonstrates basic component usage

**Section 2: Card Components**
- Responsive grid layout (1 col mobile, 2 tablet, 3 desktop)
- Three cards showing different configurations:
  - Red card with danger button footer
  - Blue card without footer
  - Green card with multiple buttons in footer

**Section 3: Component Composition**
- Complex example combining Card and Button
- Shows nested components (Card > Content > User Info)
- Demonstrates real-world pattern (user profile card)
- Yellow bordered box inside card for visual debugging

## 🎨 Design Patterns Demonstrated

### 1. Props Pattern

**Default Values:**
```jsx
function Button({ variant = 'primary', size = 'md' })
```
- Provides sensible defaults
- Makes component easy to use
- Reduces required props

**Required vs Optional:**
- `children` - Required (no default)
- `variant`, `size` - Optional (have defaults)
- `title`, `footer` - Optional (conditional rendering)

### 2. Variant Pattern

**Object-Based Variants:**
```jsx
const variants = {
  primary: '...',
  secondary: '...',
  danger: '...',
  success: '...',
}
```

**Benefits:**
- Centralized style management
- Easy to add new variants
- Type-safe (if using TypeScript)
- Consistent styling

### 3. Composition Pattern

**Component Nesting:**
```jsx
<Card footer={<Button>Click</Button>}>
  <div>Content</div>
</Card>
```

**Benefits:**
- Flexible and reusable
- Components work together
- Easy to build complex UIs
- Follows React best practices

### 4. Conditional Rendering Pattern

**Simple Conditional:**
```jsx
{title && <div>...</div>}
```

**Benefits:**
- Clean syntax
- No unnecessary DOM elements
- Performance optimized
- Readable code

## 📚 React Concepts Explained

### Props

**What are Props?**
- Props (properties) are data passed from parent to child
- Read-only in child component
- Enable component reusability

**Example:**
```jsx
<Button variant="primary" size="lg">Click Me</Button>
// variant and size are props
```

### Default Parameters

**ES6 Default Parameters:**
```jsx
function Button({ variant = 'primary' })
```
- Provides fallback value
- Used when prop is undefined
- Makes props optional

### Spread Operator

**Props Spreading:**
```jsx
<button {...props}>
```
- Passes through all additional props
- Enables HTML attribute support
- Maintains component flexibility

**Example Usage:**
```jsx
<Button onClick={handleClick} disabled={true}>
  Submit
</Button>
// onClick and disabled are passed through via ...props
```

### Children Prop

**Special Prop:**
```jsx
<Card>
  <p>This is children</p>
</Card>
```
- Content between opening/closing tags
- Can be text, elements, or components
- Enables composition

### Conditional Rendering

**Truthy/Falsy Evaluation:**
```jsx
{title && <div>Title</div>}
```
- Renders if `title` is truthy
- Doesn't render if `title` is falsy (null, undefined, false, '')
- Common React pattern

## 🔧 Component API Reference

### Button Component

**Props:**

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | 'primary' \| 'secondary' \| 'danger' \| 'success' | 'primary' | No | Button style variant |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | No | Button size |
| `children` | ReactNode | - | Yes | Button content |
| `...props` | HTMLButtonElement props | - | No | Any button HTML attributes |

**Usage Examples:**

```jsx
// Basic usage
<Button>Click Me</Button>

// With variant
<Button variant="danger">Delete</Button>

// With size
<Button size="lg">Large Button</Button>

// With event handler
<Button onClick={() => alert('Clicked!')}>Click</Button>

// Disabled state
<Button disabled>Disabled</Button>
```

### Card Component

**Props:**

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | string | undefined | No | Card title (renders header) |
| `children` | ReactNode | - | Yes | Card content |
| `borderColor` | string | 'border-gray-300' | No | Tailwind border color class |
| `footer` | ReactNode | undefined | No | Footer content |

**Usage Examples:**

```jsx
// Basic card
<Card>
  <p>Content</p>
</Card>

// With title
<Card title="My Card">
  <p>Content</p>
</Card>

// With custom border
<Card borderColor="border-blue-500">
  <p>Content</p>
</Card>

// With footer
<Card 
  title="Card Title"
  footer={<Button>Action</Button>}
>
  <p>Content</p>
</Card>

// Full example
<Card 
  title="User Profile"
  borderColor="border-purple-500"
  footer={
    <div className="flex gap-2">
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Cancel</Button>
    </div>
  }
>
  <div>User content here</div>
</Card>
```

## 🎯 Best Practices

### 1. Component Design

✅ **Do:**
- Use default values for optional props
- Provide sensible defaults
- Make components flexible
- Use descriptive prop names
- Document prop types

❌ **Don't:**
- Require unnecessary props
- Hard-code values
- Create overly specific components
- Use unclear prop names

### 2. Variant Pattern

✅ **Do:**
- Store variants in objects
- Use consistent naming
- Make variants easily extensible
- Keep variant styles together

❌ **Don't:**
- Use inline conditional classes everywhere
- Create too many variants
- Mix variant logic with component logic

### 3. Composition

✅ **Do:**
- Build complex UIs from simple components
- Use children prop for flexibility
- Accept React elements as props
- Keep components focused

❌ **Don't:**
- Create monolithic components
- Hard-code component relationships
- Limit composition possibilities

## 🚀 Advanced Patterns

### Extending Button Component

**Adding New Variant:**
```jsx
const variants = {
  primary: '...',
  secondary: '...',
  danger: '...',
  success: '...',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-700', // New!
}
```

**Adding Loading State:**
```jsx
function Button({ variant = 'primary', size = 'md', loading, children, ...props }) {
  return (
    <button 
      className={classes} 
      disabled={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

### Extending Card Component

**Adding onClick Handler:**
```jsx
function Card({ title, children, borderColor, footer, onClick }) {
  return (
    <div 
      className={`border-4 ${borderColor} ...`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* ... */}
    </div>
  )
}
```

**Adding Custom Header:**
```jsx
function Card({ title, header, children, ... }) {
  return (
    <div>
      {header || (title && <div>...</div>)}
      {/* ... */}
    </div>
  )
}
```

## ✅ Verification Checklist

After implementing, verify:

- [ ] Button.jsx created with variants and sizes
- [ ] Card.jsx created with optional sections
- [ ] ComponentDemo.jsx demonstrates all features
- [ ] App.jsx imports and renders ComponentDemo
- [ ] All button variants display correctly
- [ ] All button sizes display correctly
- [ ] Cards render with different configurations
- [ ] Component composition example works
- [ ] Build succeeds (`npm run build`)
- [ ] Development server runs (`npm run dev`)

## 🎓 Learning Outcomes

After studying this component library, students will understand:

1. ✅ How to create reusable React components
2. ✅ Props and default values pattern
3. ✅ Variant system implementation
4. ✅ Component composition techniques
5. ✅ Conditional rendering patterns
6. ✅ Spread props for flexibility
7. ✅ Children prop usage
8. ✅ Real-world component patterns

## 🚀 Next Steps

After mastering these components, students can:

1. **Extend Components**: Add new variants, sizes, or features
2. **Create More Components**: Input, Modal, Dropdown, etc.
3. **Add TypeScript**: Type props for better developer experience
4. **Build Component Library**: Create a full design system
5. **Add Tests**: Write unit tests for components
6. **Documentation**: Create Storybook or similar docs
7. **Theming**: Add theme support (dark mode, custom colors)

## 📖 Additional Resources

- [React Props Documentation](https://react.dev/learn/passing-props-to-a-component)
- [React Composition Patterns](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Component Design Patterns](https://reactpatterns.com/)

## 🎯 Teaching Tips

### For Instructors

1. **Start Simple**: Begin with basic Button, then add variants
2. **Show Patterns**: Explain why we use objects for variants
3. **Demonstrate Composition**: Show how components work together
4. **Real Examples**: Connect to real-world use cases
5. **Encourage Experimentation**: Let students modify and extend

### Common Student Questions

**Q: Why use objects for variants instead of if/else?**
A: Objects are cleaner, easier to extend, and more performant. They also make it easy to add new variants.

**Q: What's the difference between props and state?**
A: Props come from parent, state is internal. Props are read-only in child, state can be changed.

**Q: Can I pass functions as props?**
A: Yes! Functions are just values in JavaScript. You can pass onClick handlers, callbacks, etc.

**Q: Why use ...props spread operator?**
A: It allows passing through HTML attributes (onClick, disabled, type, etc.) without explicitly defining them all.

**Q: When should I create a new component vs using props?**
A: Create new component when you need significantly different structure. Use props for variations of the same structure.

---

**Happy Learning! 🎨**
