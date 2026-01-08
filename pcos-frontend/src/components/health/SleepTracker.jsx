import React, { useState } from "react";

export default function SleepTracker() {
  const [sleepData, setSleepData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [entry, setEntry] = useState({
    bedTime: "22:00",
    wakeTime: "07:00",
    quality: 5,
    factors: [],
  });

  const calculateDuration = (start, end) => {
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);

    let diff = (endDate - startDate) / 1000 / 60 / 60; // hours
    if (diff < 0) diff += 24; // Handle overnight
    return diff.toFixed(1);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const duration = calculateDuration(entry.bedTime, entry.wakeTime);
    const newLog = {
      ...entry,
      duration,
      date: new Date(),
      id: Date.now(),
    };
    setSleepData([newLog, ...sleepData]);
    setIsEditing(false);
  };

  const FACTORS = [
    "Caffeine",
    "Screen Time",
    "Stress",
    "Exercise",
    "Late Meal",
  ];

  const toggleFactor = (f) => {
    if (entry.factors.includes(f)) {
      setEntry({ ...entry, factors: entry.factors.filter((i) => i !== f) });
    } else {
      setEntry({ ...entry, factors: [...entry.factors, f] });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">😴 Sleep Hygiene</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
        >
          {isEditing ? "Cancel" : "+ Log Sleep"}
        </button>
      </div>

      {isEditing && (
        <form
          onSubmit={handleSave}
          className="mb-6 p-4 bg-indigo-50 rounded-xl"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-500">
                Bed Time
              </label>
              <input
                type="time"
                className="w-full p-2 rounded border"
                value={entry.bedTime}
                onChange={(e) =>
                  setEntry({ ...entry, bedTime: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">
                Wake Time
              </label>
              <input
                type="time"
                className="w-full p-2 rounded border"
                value={entry.wakeTime}
                onChange={(e) =>
                  setEntry({ ...entry, wakeTime: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 block mb-2">
              Quality (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
              value={entry.quality}
              onChange={(e) =>
                setEntry({ ...entry, quality: parseInt(e.target.value) })
              }
            />
            <div className="text-center font-bold text-indigo-800">
              {entry.quality}/10
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 block mb-2">
              Factors
            </label>
            <div className="flex flex-wrap gap-2">
              {FACTORS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFactor(f)}
                  className={`text-xs px-2 py-1 rounded border ${
                    entry.factors.includes(f)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full py-2 bg-gray-900 text-white rounded-lg">
            Save Sleep Log
          </button>
        </form>
      )}

      <div className="space-y-3">
        {sleepData.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No sleep logs yet.</p>
        ) : (
          sleepData.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-gray-800">{log.duration} Hours</p>
                <p className="text-xs text-gray-500">
                  {log.bedTime} - {log.wakeTime}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    log.quality >= 7
                      ? "bg-green-100 text-green-700"
                      : log.quality >= 4
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  Quality: {log.quality}/10
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
