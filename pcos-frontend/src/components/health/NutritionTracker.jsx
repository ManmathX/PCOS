import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NutritionTracker() {
  const [logs, setLogs] = useState([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    mealType: "breakfast",
    foodName: "",
    calories: "",
    isPCOSFriendly: false,
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/nutrition");
      setLogs(response.data.foodEntries);
      setWaterIntake(response.data.waterIntake?.glasses || 0);
    } catch (error) {
      console.error("Failed to fetch nutrition logs", error);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/nutrition/food", {
        ...newEntry,
        date: new Date(),
      });
      setShowForm(false);
      setNewEntry({
        mealType: "breakfast",
        foodName: "",
        calories: "",
        isPCOSFriendly: false,
      });
      fetchLogs();
    } catch (error) {
      console.error("Failed to add food", error);
    }
  };

  const updateWater = async (glasses) => {
    try {
      await axios.post("http://localhost:5000/api/nutrition/water", {
        date: new Date(),
        glasses,
      });
      setWaterIntake(glasses);
    } catch (error) {
      console.error("Failed to update water", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">🥗 Nutrition & Diet</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {showForm ? "Cancel" : "+ Log Meal"}
        </button>
      </div>

      {/* Water Tracker */}
      <div className="mb-8 p-6 bg-blue-50 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">Water Intake</h3>
          <p className="text-sm text-blue-700">Goal: 8 glasses/day</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => updateWater(Math.max(0, waterIntake - 1))}
            className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold shadow-sm"
          >
            -
          </button>
          <div className="text-center">
            <span className="text-2xl font-bold text-blue-800">
              {waterIntake}
            </span>
            <div className="text-xs text-blue-600">glasses</div>
          </div>
          <button
            onClick={() => updateWater(waterIntake + 1)}
            className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold shadow-sm"
          >
            +
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddFood}
          className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              className="p-2 rounded border"
              value={newEntry.mealType}
              onChange={(e) =>
                setNewEntry({ ...newEntry, mealType: e.target.value })
              }
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
            <input
              type="text"
              placeholder="Food Name"
              className="p-2 rounded border"
              value={newEntry.foodName}
              onChange={(e) =>
                setNewEntry({ ...newEntry, foodName: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Calories"
              className="p-2 rounded border"
              value={newEntry.calories}
              onChange={(e) =>
                setNewEntry({ ...newEntry, calories: e.target.value })
              }
            />
            <label className="flex items-center gap-2 p-2 border rounded bg-white">
              <input
                type="checkbox"
                checked={newEntry.isPCOSFriendly}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, isPCOSFriendly: e.target.checked })
                }
              />
              <span className="text-sm">PCOS Friendly? 🌿</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Save Entry
          </button>
        </form>
      )}

      {/* Food Log List */}
      <div className="space-y-4">
        {logs.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="px-2 py-1 bg-gray-100 rounded text-xs uppercase font-bold text-gray-500 w-20 text-center">
                {entry.mealType}
              </div>
              <div>
                <p className="font-medium text-gray-800">{entry.foodName}</p>
                <p className="text-xs text-gray-500">{entry.calories} kcal</p>
              </div>
            </div>
            {entry.isPCOSFriendly && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                PCOS Friendly 🌿
              </span>
            )}
          </div>
        ))}

        {logs.length === 0 && (
          <p className="text-center text-gray-400 py-4">
            No meals logged today
          </p>
        )}
      </div>
    </div>
  );
}
