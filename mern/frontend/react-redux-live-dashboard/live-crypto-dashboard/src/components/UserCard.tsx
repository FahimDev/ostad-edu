/**
 * UserCard Component
 * 
 * Demonstrates PARAMETER PASSING from parent to child component.
 * 
 * This component receives parameters (props) from its parent component.
 * 
 * Types of parameters demonstrated:
 * 1. Primitive types (string, number, boolean)
 * 2. Object parameter
 * 3. Function parameter (callback)
 * 4. Optional parameters
 */

// Define the shape of parameters this component expects
interface UserCardProps {
  // Example 1: Primitive parameters (string, number, boolean)
  userName: string
  userAge: number
  isActive: boolean

  // Example 2: Object parameter
  userDetails: {
    email: string
    role: string
  }

  // Example 3: Function parameter (callback)
  onButtonClick: (message: string) => void

  // Example 4: Optional parameter (using ?)
  avatarUrl?: string
}

/**
 * UserCard - Child component that receives parameters from parent
 * 
 * PARAMETER PASSING FLOW:
 * 1. Parent component calls: <UserCard userName="John" userAge={25} ... />
 * 2. Parameters are passed as props object
 * 3. This component receives them in the props parameter
 * 4. We can use them directly: props.userName or destructure: { userName }
 */
export default function UserCard({
  userName,
  userAge,
  isActive,
  userDetails,
  onButtonClick,
  avatarUrl,
}: UserCardProps) {
  /**
   * Handle button click
   * Calls the function passed from parent component
   * This demonstrates passing a function as a parameter
   */
  const handleClick = () => {
    // Call the function passed from parent with a message
    onButtonClick(`Button clicked by ${userName}!`)
  }

  return (
    <div className="user-card" style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem' }}>
      <h3>User Card Component</h3>
      
      {/* Example 1: Using primitive parameters */}
      <p>
        <strong>Name:</strong> {userName} (Age: {userAge})
      </p>
      <p>
        <strong>Status:</strong> {isActive ? 'Active' : 'Inactive'}
      </p>

      {/* Example 2: Using object parameter properties */}
      <p>
        <strong>Email:</strong> {userDetails.email}
      </p>
      <p>
        <strong>Role:</strong> {userDetails.role}
      </p>

      {/* Example 4: Using optional parameter */}
      {avatarUrl && (
        <img src={avatarUrl} alt={userName} style={{ width: '50px', height: '50px' }} />
      )}

      {/* Example 3: Calling function parameter */}
      <button onClick={handleClick} style={{ marginTop: '1rem', padding: '0.5rem' }}>
        Click Me (calls parent function)
      </button>
    </div>
  )
}

