import React, { useState } from "react";

export default function SkinHairTracker() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">✨ Skin & Hair</h2>
        <button className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition">
          + Log Daily Check
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-rose-50 rounded-xl">
          <h3 className="font-semibold text-rose-800 mb-2">Acne Activity</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-800">Low</span>
            <span className="text-sm text-gray-500 mb-1">severity today</span>
          </div>
        </div>
        <div className="p-4 bg-rose-50 rounded-xl">
          <h3 className="font-semibold text-rose-800 mb-2">Hair Health</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-800">Good</span>
            <span className="text-sm text-gray-500 mb-1">condition</span>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-gray-800 mb-4">Photo Diary 📸</h3>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-32 h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200"
          >
            <span className="text-xs">No Photo</span>
          </div>
        ))}
        <button className="flex-shrink-0 w-32 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-rose-400 hover:text-rose-500 transition">
          <span className="text-2xl mb-1">+</span>
          <span className="text-xs">Add Photo</span>
        </button>
      </div>
    </div>
  );
}
