function FlexDemo() {
  return (
    <div className="space-y-8">
      {/* Main Section Title */}
      <h2 className="text-3xl font-bold text-green-600 text-center mb-8">
        Flexbox Examples
      </h2>

      {/* Example 1 - Flex Row with Space Between */}
      <section className="border-4 border-green-500 bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Example 1: Flex Row with Space Between
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Using: <code className="bg-gray-100 px-2 py-1 rounded">flex justify-between items-center</code>
        </p>
        <div className="border-2 border-blue-400 bg-white p-4 rounded flex justify-between items-center">
          <div className="border-2 border-red-400 bg-red-50 p-4 rounded">
            Item 1
          </div>
          <div className="border-2 border-red-400 bg-red-50 p-4 rounded">
            Item 2
          </div>
          <div className="border-2 border-red-400 bg-red-50 p-4 rounded">
            Item 3
          </div>
        </div>
      </section>

      {/* Example 2 - Flex Column Center */}
      <section className="border-4 border-green-500 bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Example 2: Flex Column Center
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Using: <code className="bg-gray-100 px-2 py-1 rounded">flex flex-col items-center gap-3</code>
        </p>
        <div className="border-2 border-blue-400 bg-white p-4 rounded flex flex-col items-center gap-3 min-h-[200px]">
          <div className="border-2 border-purple-400 bg-purple-50 p-4 rounded">
            Top
          </div>
          <div className="border-2 border-purple-400 bg-purple-50 p-4 rounded">
            Middle
          </div>
          <div className="border-2 border-purple-400 bg-purple-50 p-4 rounded">
            Bottom
          </div>
        </div>
      </section>

      {/* Example 3 - Perfect Center */}
      <section className="border-4 border-green-500 bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Example 3: Perfect Center
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Using: <code className="bg-gray-100 px-2 py-1 rounded">flex items-center justify-center</code>
        </p>
        <div className="border-2 border-blue-400 bg-white p-4 rounded flex items-center justify-center h-40">
          <div className="border-2 border-yellow-400 bg-yellow-50 p-4 rounded">
            <span className="font-bold text-lg">CENTERED!</span>
          </div>
        </div>
      </section>

      {/* Example 4 - Flex Wrap */}
      <section className="border-4 border-green-500 bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Example 4: Flex Wrap
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Using: <code className="bg-gray-100 px-2 py-1 rounded">flex flex-wrap gap-4</code>
        </p>
        <div className="border-2 border-blue-400 bg-white p-4 rounded flex flex-wrap gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <div
              key={num}
              className="border-2 border-orange-400 bg-orange-50 p-4 rounded w-24 h-24 flex items-center justify-center"
            >
              Box {num}
            </div>
          ))}
        </div>
      </section>

      {/* Example 5 - Navbar Pattern */}
      <section className="border-4 border-green-500 bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Example 5: Navbar Pattern
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Using: <code className="bg-gray-100 px-2 py-1 rounded">flex justify-between items-center</code>
        </p>
        <div className="border-2 border-blue-400 bg-gray-800 p-4 rounded flex justify-between items-center">
          <div className="border-2 border-yellow-400 bg-yellow-50 p-3 rounded">
            <span className="font-bold text-gray-800">LOGO</span>
          </div>
          <div className="border-2 border-green-400 bg-green-50 p-3 rounded flex gap-4">
            <a href="#" className="text-gray-800 hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-800 hover:text-blue-600">About</a>
            <a href="#" className="text-gray-800 hover:text-blue-600">Contact</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FlexDemo
