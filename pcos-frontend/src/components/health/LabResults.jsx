import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LabResults() {
  const [labs, setLabs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLab, setNewLab] = useState({
    testDate: new Date().toISOString().split("T")[0],
    testName: "Hormone Panel",
    labName: "",
    values: [{ marker: "", value: "", unit: "" }],
  });

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/labs");
      setLabs(res.data.results);
    } catch (error) {
      console.error("Failed to fetch labs", error);
    }
  };

  const handleCreateLab = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/labs", newLab);
      setIsAdding(false);
      setNewLab({
        testDate: new Date().toISOString().split("T")[0],
        testName: "Hormone Panel",
        labName: "",
        values: [{ marker: "", value: "", unit: "" }],
      });
      fetchLabs();
    } catch (error) {
      console.error("Failed to create lab", error);
    }
  };

  const addValueField = () => {
    setNewLab({
      ...newLab,
      values: [...newLab.values, { marker: "", value: "", unit: "" }],
    });
  };

  const updateValueField = (index, field, val) => {
    const updated = [...newLab.values];
    updated[index][field] = val;
    setNewLab({ ...newLab, values: updated });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">🧬 Lab Results</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {isAdding ? "Cancel" : "+ Add Report"}
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreateLab}
          className="mb-8 p-4 bg-purple-50 rounded-xl"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="date"
              className="p-2 rounded border"
              value={newLab.testDate}
              onChange={(e) =>
                setNewLab({ ...newLab, testDate: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Test Name (e.g. Thyroid Panel)"
              className="p-2 rounded border"
              value={newLab.testName}
              onChange={(e) =>
                setNewLab({ ...newLab, testName: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-xs font-semibold text-gray-500 px-1">
              <span>Marker</span>
              <span>Value</span>
              <span>Unit</span>
            </div>
            {newLab.values.map((v, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2">
                <input
                  placeholder="e.g. Free Testosterone"
                  className="p-2 rounded border text-sm"
                  value={v.marker}
                  onChange={(e) =>
                    updateValueField(idx, "marker", e.target.value)
                  }
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="p-2 rounded border text-sm"
                  value={v.value}
                  onChange={(e) =>
                    updateValueField(idx, "value", e.target.value)
                  }
                  required
                />
                <input
                  placeholder="e.g. ng/dL"
                  className="p-2 rounded border text-sm"
                  value={v.unit}
                  onChange={(e) =>
                    updateValueField(idx, "unit", e.target.value)
                  }
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addValueField}
              className="text-sm text-purple-600 font-medium hover:underline"
            >
              + Add another marker
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-900 text-white rounded-lg"
          >
            Save Report
          </button>
        </form>
      )}

      {/* Lab History List */}
      <div className="space-y-6">
        {labs.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            No lab reports found.
          </p>
        ) : (
          labs.map((lab) => (
            <div
              key={lab.id}
              className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition"
            >
              <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-800">{lab.testName}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(lab.testDate).toLocaleDateString()}
                  </p>
                </div>
                {lab.labName && (
                  <span className="text-xs bg-white px-2 py-1 rounded border text-gray-500">
                    {lab.labName}
                  </span>
                )}
              </div>
              <div className="p-3 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-50">
                      <th className="pb-2 font-medium">Marker</th>
                      <th className="pb-2 font-medium">Result</th>
                      <th className="pb-2 font-medium">Ref Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lab.values.map((val) => (
                      <tr
                        key={val.id}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="py-2 text-gray-800">{val.marker}</td>
                        <td className="py-2 font-semibold">
                          {val.value}{" "}
                          <span className="text-xs text-gray-400 font-normal">
                            {val.unit}
                          </span>
                          {val.isAbnormal && (
                            <span className="ml-2 w-2 h-2 inline-block rounded-full bg-red-500"></span>
                          )}
                        </td>
                        <td className="py-2 text-gray-400 text-xs">
                          {val.normalMin && val.normalMax
                            ? `${val.normalMin} - ${val.normalMax}`
                            : "--"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
