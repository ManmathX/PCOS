import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const DailyLogCalendar = ({
  logs,
  onDateClick,
  currentMonth,
  onMonthChange,
}) => {
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth, logs]);

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    setCalendarDays(days);
  };

  const getLogForDate = (date) => {
    if (!date) return null;
    const dateStr = date.toISOString().split("T")[0];
    return logs.find((log) => {
      const logDate = new Date(log.date).toISOString().split("T")[0];
      return logDate === dateStr;
    });
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: "😊",
      sad: "😢",
      anxious: "😰",
      energetic: "⚡",
      tired: "😴",
      calm: "😌",
      irritable: "😠",
      neutral: "😐",
    };
    return moodEmojis[mood] || "📝";
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isFutureDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    const today = new Date();

    // Don't allow navigating to future months
    if (
      newMonth.getMonth() <= today.getMonth() ||
      newMonth.getFullYear() < today.getFullYear()
    ) {
      onMonthChange(newMonth);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const log = getLogForDate(date);
          const hasLog = !!log;
          const future = isFutureDate(date);
          const today = isToday(date);

          return (
            <div key={index} className="aspect-square">
              {date ? (
                <button
                  onClick={() => !future && onDateClick(date, log)}
                  disabled={future}
                  className={`w-full h-full p-1 rounded-md text-sm transition-all ${
                    future
                      ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                      : hasLog
                      ? "bg-purple-100 hover:bg-purple-200 border-2 border-purple-400"
                      : today
                      ? "bg-blue-50 hover:bg-blue-100 border-2 border-blue-400"
                      : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span
                      className={`font-medium ${
                        hasLog ? "text-purple-800" : "text-gray-700"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {hasLog && (
                      <span className="text-lg mt-1" title={log.mood}>
                        {getMoodEmoji(log.mood)}
                      </span>
                    )}
                    <div className="flex gap-0.5">
                      {log?.isOnPeriod && <span className="text-xs">🔴</span>}
                      {log?.photoUrl && <span className="text-xs">📸</span>}
                    </div>
                  </div>
                </button>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-50 border-2 border-blue-400 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-purple-100 border-2 border-purple-400 rounded"></div>
          <span>Has Log</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🔴</span>
          <span>Period</span>
        </div>
        <div className="flex items-center gap-1">
          <span>📸</span>
          <span>Photo</span>
        </div>
      </div>
    </div>
  );
};

DailyLogCalendar.propTypes = {
  logs: PropTypes.array.isRequired,
  onDateClick: PropTypes.func.isRequired,
  currentMonth: PropTypes.instanceOf(Date).isRequired,
  onMonthChange: PropTypes.func.isRequired,
};

export default DailyLogCalendar;
