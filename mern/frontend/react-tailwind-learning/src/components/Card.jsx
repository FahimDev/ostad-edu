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

export default Card
