import React from "react";

export default function FertilityPlanner() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        👶 Fertility & Ovulation
      </h2>

      <div className="p-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl mb-8 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-teal-900 mb-1">
            Predicted Fertile Window
          </h3>
          <p className="text-teal-700">Jan 12 - Jan 18</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-teal-600 uppercase mb-1">
            Chance of Conception
          </div>
          <div className="text-3xl font-bold text-teal-800">High</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-100 p-4 rounded-xl">
          <label className="text-xs font-bold text-gray-500 block mb-2">
            BBT Temperature
          </label>
          <input
            type="number"
            placeholder="36.5"
            className="w-full text-2xl font-bold text-gray-800 border-none p-0 focus:ring-0 placeholder-gray-200"
          />
          <span className="text-xs text-gray-400">°C today</span>
        </div>
        <div className="border border-gray-100 p-4 rounded-xl">
          <label className="text-xs font-bold text-gray-500 block mb-2">
            Cervical Mucus
          </label>
          <select className="w-full text-lg font-bold text-gray-800 border-none p-0 focus:ring-0 bg-transparent">
            <option>Sticky</option>
            <option>Creamy</option>
            <option>Egg White</option>
            <option>Watery</option>
            <option>Dry</option>
          </select>
        </div>
      </div>

      <h3 className="font-bold text-gray-800 mb-4">Treatment Log (IVF/IUI)</h3>
      <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
        <p>No active treatments logged.</p>
        <button className="mt-2 text-teal-600 font-semibold hover:underline">
          Start a treatment plan
        </button>
      </div>
    </div>
  );
}
