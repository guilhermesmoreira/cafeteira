export function Alert({ message, type = "info" }) {
    const colors = {
      info: "bg-blue-100 text-blue-700 border-blue-500",
      success: "bg-green-100 text-green-700 border-green-500",
      warning: "bg-yellow-100 text-yellow-700 border-yellow-500",
      error: "bg-red-100 text-red-700 border-red-500",
    };
  
    return (
      <div className={`border-l-4 p-3 rounded-md ${colors[type]}`}>
        {message}
      </div>
    );
  }
  