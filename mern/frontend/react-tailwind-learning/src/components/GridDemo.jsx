function GridDemo() {
  return (
    <div className="space-y-8">
      {/* Main Section Title */}
      <h2 className="text-3xl font-bold text-purple-600 text-center mb-8">
        Grid Examples
      </h2>

      {/* Example 1 - Basic 3-Column Grid */}
      <section className="border-4 border-purple-500 bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Example 1: Basic 3-Column Grid
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Using: <code className="bg-gray-100 px-2 py-1 rounded">grid grid-cols-3 gap-4</code>
        </p>
        <div className="border-2 border-blue-400 bg-white p-4 rounded grid grid-cols-3 gap-4">
          <div className="border-2 border-red-400 bg-red-50 p-4 rounded flex items-center justify-center">
            Col 1
          </div>
          <div className="border-2 border-red-400 bg-red-50 p-4 rounded flex items-center justify-center">
            Col 2
          </div>
          <div className="border-2 border-red-400 bg-red-50 p-4 rounded flex items-center justify-center">
            Col 3
          </div>
          <div className="border-2 border-red-400 bg-red-50 p-4 rounded flex items-center justify-center">
            Col 4
          </div>
          <div className="border-2 border-red-400 bg-red-50 p-4 rounded flex items-center justify-center">
            Col 5
          </div>
          <div className="border-2 border-red-400 bg-red-50 p-4 rounded flex items-center justify-center">
            Col 6
          </div>
        </div>
      </section>

      {/* Example 2 - Column Spanning */}
      <section className="border-4 border-purple-500 bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Example 2: Column Spanning
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Using: <code className="bg-gray-100 px-2 py-1 rounded">grid grid-cols-3 gap-4</code> with <code className="bg-gray-100 px-2 py-1 rounded">col-span-3</code> and <code className="bg-gray-100 px-2 py-1 rounded">col-span-2</code>
        </p>
        <div className="border-2 border-blue-400 bg-white p-4 rounded grid grid-cols-3 gap-4">
          <div className="border-2 border-green-400 bg-green-50 p-4 rounded flex items-center justify-center col-span-3">
            <span className="font-semibold">Full Width</span>
          </div>
          <div className="border-2 border-yellow-400 bg-yellow-50 p-4 rounded flex items-center justify-center col-span-2">
            <span className="font-semibold">Spans 2 Columns</span>
          </div>
          <div className="border-2 border-red-400 bg-red-50 p-4 rounded flex items-center justify-center">
            <span className="font-semibold">1 Col</span>
          </div>
        </div>
      </section>

      {/* Example 3 - Dashboard Layout */}
      <section className="border-4 border-purple-500 bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Example 3: Dashboard Layout
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Using: <code className="bg-gray-100 px-2 py-1 rounded">grid grid-cols-4 grid-rows-3 gap-4</code> with <code className="bg-gray-100 px-2 py-1 rounded">col-span</code> and <code className="bg-gray-100 px-2 py-1 rounded">row-span</code>
        </p>
        <div className="border-2 border-blue-400 bg-white p-4 rounded grid grid-cols-4 grid-rows-3 gap-4 min-h-[300px]">
          <div className="border-2 border-indigo-400 bg-indigo-50 p-4 rounded flex items-center justify-center col-span-4">
            <span className="font-bold text-lg">HEADER</span>
          </div>
          <div className="border-2 border-pink-400 bg-pink-50 p-4 rounded flex items-center justify-center row-span-2">
            <span className="font-bold text-lg">SIDEBAR</span>
          </div>
          <div className="border-2 border-orange-400 bg-orange-50 p-4 rounded flex items-center justify-center col-span-3 row-span-2">
            <span className="font-bold text-lg">MAIN CONTENT</span>
          </div>
        </div>
      </section>

      {/* Example 4 - Auto-Responsive Grid Cards */}
      <section className="border-4 border-purple-500 bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Example 4: Auto-Responsive Grid Cards
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Using: <code className="bg-gray-100 px-2 py-1 rounded">grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4</code>
        </p>
        <p className="text-xs text-gray-500 mb-4 italic">
          Mobile: 1 col | Tablet: 2 cols | Desktop: 4 cols
        </p>
        <div className="border-2 border-blue-400 bg-white p-4 rounded grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <div
              key={num}
              className="border-2 border-teal-400 bg-teal-50 p-4 rounded flex items-center justify-center min-h-[100px]"
            >
              <span className="font-semibold">Card {num}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Example 5 - Complex Grid Pattern */}
      <section className="border-4 border-purple-500 bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Example 5: Complex Grid Pattern
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Using: <code className="bg-gray-100 px-2 py-1 rounded">grid grid-cols-6 gap-4</code> with multiple spanning items
        </p>
        <div className="border-2 border-blue-400 bg-white p-4 rounded grid grid-cols-6 gap-4">
          <div className="border-2 border-gray-400 bg-gray-50 p-4 rounded flex items-center justify-center col-span-6">
            <span className="font-bold">Header</span>
          </div>
          <div className="border-2 border-gray-400 bg-gray-50 p-4 rounded flex items-center justify-center col-span-2">
            <span className="font-semibold">Nav</span>
          </div>
          <div className="border-2 border-gray-400 bg-gray-50 p-4 rounded flex items-center justify-center col-span-4">
            <span className="font-semibold">Content</span>
          </div>
          <div className="border-2 border-gray-400 bg-gray-50 p-4 rounded flex items-center justify-center col-span-2">
            <span className="font-semibold">Sidebar</span>
          </div>
          <div className="border-2 border-gray-400 bg-gray-50 p-4 rounded flex items-center justify-center col-span-4">
            <span className="font-semibold">Main</span>
          </div>
          <div className="border-2 border-gray-400 bg-gray-50 p-4 rounded flex items-center justify-center col-span-6">
            <span className="font-bold">Footer</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default GridDemo
