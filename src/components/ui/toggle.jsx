export function Toggle({ checked, onClick, children }) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded ${checked ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
      >
        {children}
      </button>
    );
  }
  