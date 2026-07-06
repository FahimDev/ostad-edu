import FlexDemo from './components/FlexDemo.jsx'
import GridDemo from './components/GridDemo.jsx'
import ComponentDemo from './components/ComponentDemo.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Centered Title */}
      <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">
        React + Tailwind CSS Fundamentals
      </h1>

      {/* Welcome Box with Red Border */}
      <div className="border-4 border-red-500 bg-white p-4 rounded-lg max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome Box</h2>
        <p className="text-gray-700">
          This is a demonstration of our visual debugging approach. Throughout this learning session, 
          all components will have colored borders (4px thick) to help visualize the layout structure 
          and understand how Tailwind CSS classes work. This makes it easier to see component boundaries, 
          spacing, and alignment.
        </p>
      </div>

      {/* Flexbox Examples */}
      <FlexDemo />

      {/* Grid Examples */}
      <div className="mt-8">
        <GridDemo />
      </div>

      {/* Component Library Demo with Dark Mode */}
      <div className="mt-8">
        <ComponentDemo />
      </div>
    </div>
  )
}

export default App

