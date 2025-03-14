import { useState } from "react";

export function Switch({ checked, onChange }) {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 duration-300 ${
          checked ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </label>
  );
}
