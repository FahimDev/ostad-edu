# Tailwind CSS Responsive Cheat Sheet

A quick reference guide for making responsive designs with Tailwind CSS.

## 🎯 Tailwind Breakpoints

Tailwind uses mobile-first approach - base styles are mobile, then scale up.

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm:` | 640px | Small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large desktops |

**Remember:** Base styles (no prefix) = Mobile first!

## 📱 Common Responsive Patterns

### 1. Responsive Grid Columns

```jsx
{/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* items */}
</div>

{/* Mobile: 1 col, Desktop: 4 cols */}
<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
  {/* items */}
</div>

{/* Mobile: 2 cols, Tablet: 3 cols, Desktop: 6 cols */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
  {/* items */}
</div>
```

### 2. Responsive Flex Direction

```jsx
{/* Mobile: column, Desktop: row */}
<div className="flex flex-col lg:flex-row gap-4">
  {/* items */}
</div>

{/* Mobile: column, Tablet: row */}
<div className="flex flex-col md:flex-row gap-4">
  {/* items */}
</div>
```

### 3. Responsive Text Sizes

```jsx
{/* Mobile: small, Desktop: large */}
<h1 className="text-2xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>

{/* Mobile: base, Tablet: lg, Desktop: xl */}
<p className="text-base md:text-lg lg:text-xl">
  Responsive paragraph
</p>
```

### 4. Responsive Padding/Margin

```jsx
{/* Mobile: small padding, Desktop: large padding */}
<div className="p-4 md:p-8 lg:p-12">
  Content
</div>

{/* Mobile: small margin, Desktop: large margin */}
<div className="m-4 md:m-8 lg:m-12">
  Content
</div>
```

### 5. Responsive Display

```jsx
{/* Hidden on mobile, visible on desktop */}
<div className="hidden md:block">
  Desktop only content
</div>

{/* Visible on mobile, hidden on desktop */}
<div className="block md:hidden">
  Mobile only content
</div>

{/* Hidden on mobile/tablet, visible on desktop */}
<div className="hidden lg:block">
  Desktop only
</div>
```

### 6. Responsive Width

```jsx
{/* Full width mobile, max-width desktop */}
<div className="w-full md:max-w-2xl lg:max-w-4xl mx-auto">
  Content
</div>

{/* Narrow mobile, wide desktop */}
<div className="w-11/12 md:w-3/4 lg:w-1/2 mx-auto">
  Content
</div>
```

### 7. Responsive Spacing

```jsx
{/* Mobile: small gap, Desktop: large gap */}
<div className="flex gap-2 md:gap-4 lg:gap-8">
  {/* items */}
</div>

{/* Mobile: tight spacing, Desktop: loose spacing */}
<div className="space-y-2 md:space-y-4 lg:space-y-8">
  {/* items */}
</div>
```

## 🎨 Complete Responsive Examples

### Example 1: Responsive Card Grid

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <div className="bg-white p-4 rounded-lg">Card 1</div>
  <div className="bg-white p-4 rounded-lg">Card 2</div>
  <div className="bg-white p-4 rounded-lg">Card 3</div>
  <div className="bg-white p-4 rounded-lg">Card 4</div>
</div>
```

**Result:**
- Mobile (< 640px): 1 column
- Small (≥ 640px): 2 columns
- Large (≥ 1024px): 3 columns
- XL (≥ 1280px): 4 columns

### Example 2: Responsive Navigation

```jsx
<nav className="flex flex-col md:flex-row justify-between items-center p-4">
  <div className="text-2xl font-bold mb-4 md:mb-0">Logo</div>
  <div className="flex flex-col md:flex-row gap-4">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>
</nav>
```

**Result:**
- Mobile: Vertical stack (column)
- Desktop: Horizontal layout (row)

### Example 3: Responsive Hero Section

```jsx
<section className="px-4 md:px-8 lg:px-16 py-8 md:py-16 lg:py-24">
  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
    Welcome
  </h1>
  <p className="text-base md:text-lg lg:text-xl mb-8">
    Responsive hero text
  </p>
  <button className="px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4">
    Get Started
  </button>
</section>
```

### Example 4: Responsive Sidebar Layout

```jsx
<div className="flex flex-col lg:flex-row">
  {/* Sidebar - Hidden on mobile, visible on desktop */}
  <aside className="hidden lg:block w-full lg:w-64 bg-gray-100 p-4">
    Sidebar
  </aside>
  
  {/* Main Content */}
  <main className="flex-1 p-4 md:p-8">
    Main content
  </main>
</div>
```

### Example 5: Responsive Image Gallery

```jsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
  <img src="..." className="w-full h-auto rounded" />
  <img src="..." className="w-full h-auto rounded" />
  {/* more images */}
</div>
```

## 🔧 Quick Reference: Common Responsive Utilities

### Grid Columns

| Class | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | 1 | 2 | 3 |
| `grid-cols-1 lg:grid-cols-4` | 1 | 1 | 4 |
| `grid-cols-2 md:grid-cols-4 lg:grid-cols-6` | 2 | 4 | 6 |

### Flex Direction

| Class | Mobile | Desktop |
|-------|--------|---------|
| `flex-col md:flex-row` | Column | Row |
| `flex-row md:flex-col lg:flex-row` | Row | Column | Row |

### Text Sizes

| Class | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| `text-sm md:text-base lg:text-lg` | Small | Base | Large |
| `text-2xl md:text-4xl lg:text-6xl` | 2xl | 4xl | 6xl |

### Padding

| Class | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| `p-4 md:p-6 lg:p-8` | 1rem | 1.5rem | 2rem |
| `px-4 md:px-8 lg:px-16` | 1rem | 2rem | 4rem |

### Display

| Class | Mobile | Desktop |
|-------|--------|---------|
| `hidden md:block` | Hidden | Visible |
| `block md:hidden` | Visible | Hidden |
| `flex md:hidden` | Flex | Hidden |

### Width

| Class | Mobile | Desktop |
|-------|--------|---------|
| `w-full md:w-1/2 lg:w-1/3` | 100% | 50% | 33% |
| `w-11/12 md:w-3/4 lg:w-1/2` | 91% | 75% | 50% |

## 📐 Responsive Layout Patterns

### Pattern 1: Mobile-First Card Stack

```jsx
{/* Cards stack on mobile, grid on desktop */}
<div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
</div>
```

### Pattern 2: Responsive Container

```jsx
{/* Full width mobile, centered with max-width desktop */}
<div className="w-full px-4 md:px-8 lg:max-w-6xl lg:mx-auto">
  Content
</div>
```

### Pattern 3: Responsive Typography Scale

```jsx
{/* Responsive heading */}
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
  Responsive Heading
</h1>

{/* Responsive body text */}
<p className="text-sm sm:text-base md:text-lg lg:text-xl">
  Body text
</p>
```

### Pattern 4: Responsive Spacing Scale

```jsx
{/* Responsive gaps */}
<div className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-8">
  Items
</div>

{/* Responsive margins */}
<div className="mt-4 md:mt-8 lg:mt-12">
  Content
</div>
```

## 🎯 Common Responsive Scenarios

### Scenario 1: Responsive Navigation Bar

```jsx
<nav className="flex flex-col md:flex-row justify-between items-center p-4">
  <div className="text-xl md:text-2xl font-bold mb-4 md:mb-0">
    Logo
  </div>
  <div className="flex flex-col md:flex-row gap-4">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>
</nav>
```

### Scenario 2: Responsive Dashboard Layout

```jsx
<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
  {/* Sidebar */}
  <aside className="lg:col-span-1">
    Sidebar
  </aside>
  
  {/* Main Content */}
  <main className="lg:col-span-3">
    Main Content
  </main>
</div>
```

### Scenario 3: Responsive Form Layout

```jsx
<form className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
  <input className="w-full" placeholder="First Name" />
  <input className="w-full" placeholder="Last Name" />
  <input className="w-full md:col-span-2" placeholder="Email" />
  <button className="w-full md:col-span-2">Submit</button>
</form>
```

### Scenario 4: Responsive Image with Text

```jsx
<div className="flex flex-col md:flex-row gap-4">
  <img src="..." className="w-full md:w-1/2" />
  <div className="w-full md:w-1/2">
    <h2 className="text-2xl md:text-3xl">Title</h2>
    <p className="text-base md:text-lg">Description</p>
  </div>
</div>
```

### Scenario 5: Responsive Modal

```jsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
  <div className="bg-white rounded-lg w-full max-w-md lg:max-w-2xl p-4 md:p-8">
    Modal Content
  </div>
</div>
```

## 💡 Pro Tips

### 1. Mobile-First Thinking

Always start with mobile styles, then add larger breakpoints:

```jsx
{/* ✅ Good: Mobile first */}
<div className="text-sm md:text-base lg:text-lg">

{/* ❌ Bad: Desktop first */}
<div className="text-lg md:text-base sm:text-sm">
```

### 2. Use Consistent Breakpoints

Stick to common breakpoints:
- `sm:` for small tablets (640px)
- `md:` for tablets (768px)
- `lg:` for laptops (1024px)
- `xl:` for desktops (1280px)

### 3. Combine Utilities

You can combine multiple responsive utilities:

```jsx
<div className="
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 md:gap-6 lg:gap-8
  p-4 md:p-6 lg:p-8
">
  Content
</div>
```

### 4. Test on Real Devices

Always test on actual devices, not just browser resize:
- Mobile: 375px - 640px
- Tablet: 768px - 1024px
- Desktop: 1280px+

### 5. Use Container Queries (Future)

Tailwind 3.2+ supports container queries:

```jsx
<div className="@container">
  <div className="@md:grid @md:grid-cols-2">
    Content
  </div>
</div>
```

## 🚀 Quick Copy-Paste Templates

### Template 1: Responsive Card Grid

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <div key={item.id} className="bg-white p-4 rounded-lg shadow">
      {item.content}
    </div>
  ))}
</div>
```

### Template 2: Responsive Hero Section

```jsx
<section className="px-4 md:px-8 lg:px-16 py-12 md:py-20 lg:py-32">
  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
    Hero Title
  </h1>
  <p className="text-base md:text-lg lg:text-xl mb-8">
    Hero description
  </p>
  <button className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg">
    CTA Button
  </button>
</section>
```

### Template 3: Responsive Navigation

```jsx
<nav className="flex flex-col md:flex-row justify-between items-center p-4">
  <div className="text-xl md:text-2xl font-bold mb-4 md:mb-0">
    Logo
  </div>
  <div className="flex flex-col md:flex-row gap-4">
    <a href="#" className="hover:underline">Home</a>
    <a href="#" className="hover:underline">About</a>
    <a href="#" className="hover:underline">Contact</a>
  </div>
</nav>
```

### Template 4: Responsive Sidebar Layout

```jsx
<div className="flex flex-col lg:flex-row gap-4">
  <aside className="w-full lg:w-64 bg-gray-100 p-4">
    Sidebar
  </aside>
  <main className="flex-1 p-4">
    Main Content
  </main>
</div>
```

### Template 5: Responsive Form

```jsx
<form className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
  <input className="w-full p-2 border rounded" placeholder="Field 1" />
  <input className="w-full p-2 border rounded" placeholder="Field 2" />
  <input className="w-full md:col-span-2 p-2 border rounded" placeholder="Field 3" />
  <button className="w-full md:col-span-2 px-4 py-2 bg-blue-500 text-white rounded">
    Submit
  </button>
</form>
```

## 📊 Responsive Breakpoint Cheat Sheet

### Grid Columns

```jsx
grid-cols-1              // Mobile: 1 column
sm:grid-cols-2           // Small: 2 columns
md:grid-cols-3           // Medium: 3 columns
lg:grid-cols-4           // Large: 4 columns
xl:grid-cols-5           // XL: 5 columns
2xl:grid-cols-6          // 2XL: 6 columns
```

### Flex Direction

```jsx
flex-col                 // Mobile: column
md:flex-row              // Medium+: row
flex-row                 // Mobile: row
md:flex-col              // Medium+: column
```

### Text Sizes

```jsx
text-sm                  // Mobile: small
md:text-base             // Medium: base
lg:text-lg               // Large: large
xl:text-xl               // XL: extra large
```

### Padding

```jsx
p-4                      // Mobile: 1rem
md:p-6                   // Medium: 1.5rem
lg:p-8                   // Large: 2rem
xl:p-12                  // XL: 3rem
```

### Display

```jsx
hidden                   // Hidden on mobile
md:block                 // Visible on medium+
block                    // Visible on mobile
md:hidden                // Hidden on medium+
```

### Width

```jsx
w-full                   // Mobile: 100%
md:w-1/2                 // Medium: 50%
lg:w-1/3                 // Large: 33%
xl:w-1/4                 // XL: 25%
```

## 🎓 Remember

1. **Mobile First**: Base styles = mobile, then scale up
2. **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
3. **Combine Utilities**: You can use multiple responsive classes
4. **Test**: Always test on real devices
5. **Consistency**: Use the same breakpoints throughout

---

**Happy Responsive Coding! 📱💻**
