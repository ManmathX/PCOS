import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MedicationTracker() {
  const [medications, setMedications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "",
    type: "medication",
    frequency: "daily",
    timeOfDay: [],
    startDate: new Date().toISOString().split("T")[0],
  });

  const fetchMedications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/medications");
      setMedications(response.data.medications);
    } catch (error) {
      console.error("Failed to fetch medications", error);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleAddMedication = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/medications", newMed);
      setShowAddForm(false);
      fetchMedications();
      setNewMed({
        name: "",
        type: "medication",
        frequency: "daily",
        timeOfDay: [],
        startDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Failed to add medication", error);
    }
  };

  const logDose = async (medicationId, taken = true) => {
    try {
      await axios.post(
        `http://localhost:5000/api/medications/${medicationId}/log`,
        { taken }
      );
      fetchMedications();
    } catch (error) {
      console.error("Failed to log dose", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          💊 Medications & Supplements
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
        >
          {showAddForm ? "Cancel" : "+ Add New"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddMedication}
          className="mb-6 p-4 bg-orange-50 rounded-xl"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Medication Name"
              className="p-2 rounded border border-gray-200"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              required
            />
            <select
              className="p-2 rounded border border-gray-200"
              value={newMed.type}
              onChange={(e) => setNewMed({ ...newMed, type: e.target.value })}
            >
              <option value="medication">Medication</option>
              <option value="supplement">Supplement</option>
            </select>
            <select
              className="p-2 rounded border border-gray-200"
              value={newMed.frequency}
              onChange={(e) =>
                setNewMed({ ...newMed, frequency: e.target.value })
              }
            >
              <option value="daily">Daily</option>
              <option value="twice_daily">Twice Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg"
          >
            Save Medication
          </button>
        </form>
      )}

      <div className="space-y-4">
        {medications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No medications tracked yet.
          </p>
        ) : (
          medications.map((med) => {
            const todayLog = med.logs?.[0]; // Assuming backend returns logs sorted by date desc
            const isTaken = todayLog?.taken;

            return (
              <div
                key={med.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition bg-white"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{med.name}</h3>
                  <p className="text-sm text-gray-500">
                    {med.dosage} • {med.frequency}
                  </p>
                </div>

                <div className="flex gap-2">
                  {isTaken ? (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      ✓ Taken Today
                    </span>
                  ) : (
                    <button
                      onClick={() => logDose(med.id)}
                      className="px-4 py-2 border border-rose-500 text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    >
                      Mark as Taken
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
