import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BodyMetrics() {
  const [metrics, setMetrics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    weight: "",
    waist: "",
    hip: "",
    height: "",
    notes: "",
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/metrics");
      // Reverse primarily for chart display logic if needed or sorting
      setMetrics(response.data.metrics.reverse());
    } catch (error) {
      console.error("Failed to fetch metrics", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/metrics", {
        ...newEntry,
        date: new Date(),
      });
      setShowForm(false);
      setNewEntry({ weight: "", waist: "", hip: "", height: "", notes: "" });
      fetchMetrics();
    } catch (error) {
      console.error("Failed to add metric", error);
    }
  };

  const chartData = metrics.map((m) => ({
    date: new Date(m.date).toLocaleDateString(),
    weight: m.weight,
    waist: m.waist,
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">📏 Body Signals</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
        >
          {showForm ? "Cancel" : "+ Log Metrics"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-pink-50 rounded-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full p-2 rounded border"
                value={newEntry.weight}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, weight: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Waist (cm)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full p-2 rounded border"
                value={newEntry.waist}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, waist: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Hip (cm)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full p-2 rounded border"
                value={newEntry.hip}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, hip: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                className="w-full p-2 rounded border"
                placeholder="Once only"
                value={newEntry.height}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, height: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded-lg"
          >
            Save Measurements
          </button>
        </form>
      )}

      {/* Chart */}
      <div className="h-64 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" fontSize={12} tickMargin={10} />
            <YAxis fontSize={12} domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#ec4899"
              strokeWidth={2}
              name="Weight (kg)"
            />
            <Line
              type="monotone"
              dataKey="waist"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Waist (cm)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {metrics.length > 0 && (
          <>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-gray-800">
                {metrics[metrics.length - 1].bmi || "--"}
              </div>
              <div className="text-xs text-gray-500 font-medium">BMI Score</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-gray-800">
                {metrics[metrics.length - 1].waistHipRatio || "--"}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Waist/Hip Ratio
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-gray-800">
                {metrics[metrics.length - 1].weight}{" "}
                <span className="text-sm font-normal">kg</span>
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Current Weight
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
