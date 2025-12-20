import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import DailyQuestionnaireForm from "../../components/daily/DailyQuestionnaireForm";
import DailyLogCalendar from "../../components/daily/DailyLogCalendar";
import DailyLogModal from "../../components/daily/DailyLogModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const DailyLogPage = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formInitialData, setFormInitialData] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [currentMonth]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the first and last day of the current month
      const startDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      )
        .toISOString()
        .split("T")[0];
      const endDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      )
        .toISOString()
        .split("T")[0];

      const response = await fetch(
        `${API_URL}/daily-logs?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      const data = await response.json();
      setLogs(data.logs);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("Failed to load daily logs");
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date, log) => {
    setSelectedDate(date);
    setSelectedLog(log);
    if (log) {
      setShowModal(true);
    } else {
      setFormInitialData(null);
      setShowForm(true);
    }
  };

  const handleAddNewLog = () => {
    const today = new Date();
    setSelectedDate(today);
    setFormInitialData(null);
    setShowForm(true);
  };

  const handleEditLog = () => {
    setFormInitialData(selectedLog);
    setShowModal(false);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/daily-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save log");
      }

      const data = await response.json();

      // Update logs list
      setLogs((prevLogs) => {
        const existingIndex = prevLogs.findIndex(
          (log) => log.id === data.log.id
        );
        if (existingIndex >= 0) {
          const newLogs = [...prevLogs];
          newLogs[existingIndex] = data.log;
          return newLogs;
        }
        return [...prevLogs, data.log];
      });

      setShowForm(false);
      setSelectedDate(null);
      setFormInitialData(null);

      // Show success message
      const successMsg = document.createElement("div");
      successMsg.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in";
      successMsg.textContent =
        data.log.photoUrl && data.log.acneSeverity !== null
          ? "✓ Daily log saved with photo analysis!"
          : "✓ Daily log saved successfully!";
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (err) {
      console.error("Error saving log:", err);
      setError(err.message || "Failed to save daily log. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedDate(null);
    setFormInitialData(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setSelectedLog(null);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Daily Health Journal
        </h1>
        <p className="text-gray-600">
          Track your daily health, mood, and symptoms. Click on a date to view
          or add an entry.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Quick Add Button */}
      <div className="mb-6">
        <button
          onClick={handleAddNewLog}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Today&apos;s Log
        </button>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar View */}
        <div className="md:col-span-2">
          <DailyLogCalendar
            logs={logs}
            onDateClick={handleDateClick}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </div>

        {/* Form (shown when adding/editing) */}
        {showForm && (
          <div className="md:col-span-2">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {formInitialData ? "Edit Log Entry" : "New Log Entry"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <DailyQuestionnaireForm
              onSubmit={handleFormSubmit}
              initialData={formInitialData}
              selectedDate={selectedDate?.toISOString().split("T")[0]}
            />
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      {logs.length > 0 && !showForm && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Entries</p>
            <p className="text-2xl font-bold text-purple-700">{logs.length}</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Period Days</p>
            <p className="text-2xl font-bold text-pink-700">
              {logs.filter((log) => log.isOnPeriod).length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Avg Energy</p>
            <p className="text-2xl font-bold text-blue-700">
              {logs.filter((log) => log.energyLevel).length > 0
                ? (
                    logs.reduce((sum, log) => sum + (log.energyLevel || 0), 0) /
                    logs.filter((log) => log.energyLevel).length
                  ).toFixed(1)
                : "N/A"}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Avg Sleep</p>
            <p className="text-2xl font-bold text-green-700">
              {logs.filter((log) => log.sleepHours).length > 0
                ? (
                    logs.reduce((sum, log) => sum + (log.sleepHours || 0), 0) /
                    logs.filter((log) => log.sleepHours).length
                  ).toFixed(1) + "h"
                : "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Modal for viewing log details */}
      <DailyLogModal
        isOpen={showModal}
        onClose={handleCloseModal}
        date={selectedDate}
        log={selectedLog}
      />

      {/* Edit button in modal */}
      {showModal && selectedLog && (
        <div className="fixed bottom-20 right-8 z-50">
          <button
            onClick={handleEditLog}
            className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyLogPage;
