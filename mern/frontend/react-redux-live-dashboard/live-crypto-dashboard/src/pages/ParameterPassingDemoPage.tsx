/**
 * ParameterPassingDemoPage
 * 
 * Demonstrates PARAMETER PASSING from PAGE to COMPONENT.
 * 
 * This page shows how to:
 * 1. Pass primitive values (string, number, boolean) to child components
 * 2. Pass objects to child components
 * 3. Pass functions (callbacks) to child components
 * 4. Pass optional parameters
 * 5. Handle function callbacks from child components
 */

import { useState } from 'react'
import UserCard from '../components/UserCard'

export default function ParameterPassingDemoPage() {
  // State to demonstrate dynamic parameter passing
  const [message, setMessage] = useState<string>('No button clicked yet')

  /**
   * Callback function that will be passed to child component
   * This demonstrates passing a FUNCTION as a parameter
   * 
   * When child component calls this function, it updates parent's state
   */
  const handleUserCardClick = (clickMessage: string) => {
    console.log('Parent received message from child:', clickMessage)
    setMessage(clickMessage)
  }

  // Example data to pass as parameters
  const userData = {
    email: 'john.doe@example.com',
    role: 'Developer',
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Parameter Passing Examples</h1>
        <p>Demonstrates passing parameters from Page to Component</p>
      </div>

      {/* Display message from child component */}
      <div style={{ padding: '1rem', background: '#2d2d2d', margin: '1rem', borderRadius: '8px' }}>
        <h3>Parent State (updated by child):</h3>
        <p>{message}</p>
      </div>

      {/* EXAMPLE 1: Passing primitive parameters */}
      <section style={{ margin: '2rem 0' }}>
        <h2>Example 1: Primitive Parameters (string, number, boolean)</h2>
        <UserCard
          userName="John Doe"
          userAge={28}
          isActive={true}
          userDetails={userData}
          onButtonClick={handleUserCardClick}
        />
      </section>

      {/* EXAMPLE 2: Passing different values */}
      <section style={{ margin: '2rem 0' }}>
        <h2>Example 2: Different Parameter Values</h2>
        <UserCard
          userName="Jane Smith"
          userAge={32}
          isActive={false}
          userDetails={{
            email: 'jane.smith@example.com',
            role: 'Designer',
          }}
          onButtonClick={handleUserCardClick}
          avatarUrl="https://via.placeholder.com/50" // Optional parameter
        />
      </section>

      {/* EXAMPLE 3: Passing function with different implementation */}
      <section style={{ margin: '2rem 0' }}>
        <h2>Example 3: Different Callback Function</h2>
        <UserCard
          userName="Bob Wilson"
          userAge={45}
          isActive={true}
          userDetails={{
            email: 'bob.wilson@example.com',
            role: 'Manager',
          }}
          onButtonClick={(msg) => {
            // Inline function - different implementation
            alert(`Alert from parent: ${msg}`)
            setMessage(`Alert shown: ${msg}`)
          }}
        />
      </section>

      {/* Code explanation */}
      <div style={{ margin: '2rem 0', padding: '1rem', background: '#1a1a1a', borderRadius: '8px' }}>
        <h3>How Parameter Passing Works:</h3>
        <ol style={{ textAlign: 'left', color: '#fff' }}>
          <li>
            <strong>Parent (Page) passes parameters:</strong>
            <pre style={{ background: '#2d2d2d', padding: '0.5rem', margin: '0.5rem 0' }}>
{`<UserCard 
  userName="John"      // String parameter
  userAge={28}          // Number parameter
  isActive={true}       // Boolean parameter
  userDetails={{...}}   // Object parameter
  onButtonClick={fn}   // Function parameter
/>`}
            </pre>
          </li>
          <li>
            <strong>Child (Component) receives parameters:</strong>
            <pre style={{ background: '#2d2d2d', padding: '0.5rem', margin: '0.5rem 0' }}>
{`function UserCard({ userName, userAge, ... }) {
  // Use parameters here
  return <div>{userName}</div>
}`}
            </pre>
          </li>
          <li>
            <strong>Child can call parent function:</strong>
            <pre style={{ background: '#2d2d2d', padding: '0.5rem', margin: '0.5rem 0' }}>
{`onButtonClick("Hello from child!")
// This calls the function passed from parent`}
            </pre>
          </li>
        </ol>
      </div>
    </div>
  )
}

