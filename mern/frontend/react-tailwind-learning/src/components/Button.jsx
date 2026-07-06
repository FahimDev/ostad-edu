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
