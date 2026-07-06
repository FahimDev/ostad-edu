import { useState } from 'react'
import Button from './Button.jsx'
import Card from './Card.jsx'

function ComponentDemo() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8">
        {/* Top Section - Dark Mode Toggle */}
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

        <div className="space-y-8">
          {/* Section 1 - Button Variants */}
          <section className="border-4 border-blue-500 bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-3xl font-bold text-blue-600 dark:text-white mb-6">Button Components</h2>
            
            {/* Button Variants */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Button Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Button Sizes</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>
          </section>

          {/* Section 2 - Card Components */}
          <section className="border-4 border-blue-500 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h2 className="text-3xl font-bold text-blue-600 dark:text-white mb-6">Card Components</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Red Card */}
              <Card 
                title="Red Card" 
                borderColor="border-red-500"
                footer={
                  <Button variant="danger" size="sm">Delete</Button>
                }
              >
                <p className="text-gray-700 dark:text-gray-300">
                  This is a red card with a danger button in the footer. Cards can have optional titles and footers.
                </p>
              </Card>

              {/* Blue Card */}
              <Card 
                title="Blue Card" 
                borderColor="border-blue-500"
              >
                <p className="text-gray-700 dark:text-gray-300">
                  This is a blue card without a footer. Notice how the card adapts to the content structure.
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
                <p className="text-gray-700 dark:text-gray-300">
                  This green card has multiple buttons in the footer, demonstrating component composition.
                </p>
              </Card>
            </div>
          </section>

          {/* Section 3 - Component Composition */}
          <section className="border-4 border-blue-500 bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-3xl font-bold text-blue-600 dark:text-white mb-6">Component Composition</h2>
            
            <Card 
              title="User Profile" 
              borderColor="border-purple-500"
              footer={
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: Today</span>
                  <Button variant="primary" size="sm">Edit Profile</Button>
                </div>
              }
            >
              <div className="border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
                {/* User Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    JD
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white">John Doe</h4>
                    <p className="text-gray-600 dark:text-gray-300">john.doe@example.com</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                    Developer
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                    Active
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-semibold">
                    Premium
                  </span>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ComponentDemo
