import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ExerciseLogger() {
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    activityType: "walking",
    duration: "",
    intensity: "moderate",
    caloriesBurned: "",
  });

  useEffect(() => {
    // Mock data or fetch from API if implemented
    // fetchExercises();
  }, []);

  const fetchExercises = async () => {
    // Implementation for later
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call to save exercise would go here
    console.log("Saving exercise:", newExercise);

    // Mock add for UI demo
    setExercises([
      { ...newExercise, id: Date.now(), date: new Date() },
      ...exercises,
    ]);
    setShowForm(false);
    setNewExercise({
      activityType: "walking",
      duration: "",
      intensity: "moderate",
      caloriesBurned: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          💪 Activity & Exercise
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          {showForm ? "Cancel" : "+ Log Workout"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-yellow-50 rounded-xl"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              className="p-2 rounded border"
              value={newExercise.activityType}
              onChange={(e) =>
                setNewExercise({ ...newExercise, activityType: e.target.value })
              }
            >
              <option value="walking">Walking</option>
              <option value="running">Running</option>
              <option value="yoga">Yoga</option>
              <option value="strength">Strength Training</option>
              <option value="cycling">Cycling</option>
              <option value="swimming">Swimming</option>
            </select>
            <input
              type="number"
              placeholder="Duration (mins)"
              className="p-2 rounded border"
              value={newExercise.duration}
              onChange={(e) =>
                setNewExercise({ ...newExercise, duration: e.target.value })
              }
              required
            />
            <select
              className="p-2 rounded border"
              value={newExercise.intensity}
              onChange={(e) =>
                setNewExercise({ ...newExercise, intensity: e.target.value })
              }
            >
              <option value="low">Low Intensity</option>
              <option value="moderate">Moderate</option>
              <option value="high">High Intensity</option>
            </select>
            <input
              type="number"
              placeholder="Calories (approx)"
              className="p-2 rounded border"
              value={newExercise.caloriesBurned}
              onChange={(e) =>
                setNewExercise({
                  ...newExercise,
                  caloriesBurned: e.target.value,
                })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded-lg"
          >
            Log Activity
          </button>
        </form>
      )}

      <div className="space-y-3">
        {exercises.length === 0 ? (
          <p className="text-center text-gray-400 py-4">
            No activities logged yet.
          </p>
        ) : (
          exercises.map((ex) => (
            <div
              key={ex.id}
              className="flex items-center justify-between p-3 border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {ex.activityType === "yoga"
                    ? "🧘‍♀️"
                    : ex.activityType === "running"
                    ? "🏃‍♀️"
                    : "🚶‍♀️"}
                </span>
                <div>
                  <p className="font-bold text-gray-800 capitalize">
                    {ex.activityType}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ex.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{ex.duration} min</p>
                <p className="text-xs text-gray-500 capitalize">
                  {ex.intensity} Intensity
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
