import React, { useState, useEffect } from "react";
import axios from "axios";

const MOODS = [
  {
    label: "Great",
    emoji: "😄",
    score: 5,
    color: "bg-green-100 border-green-200",
  },
  {
    label: "Good",
    emoji: "🙂",
    score: 4,
    color: "bg-blue-100 border-blue-200",
  },
  {
    label: "Okay",
    emoji: "😐",
    score: 3,
    color: "bg-yellow-100 border-yellow-200",
  },
  {
    label: "Low",
    emoji: "😔",
    score: 2,
    color: "bg-orange-100 border-orange-200",
  },
  { label: "Bad", emoji: "😫", score: 1, color: "bg-red-100 border-red-200" },
];

const EMOTIONS = [
  "Anxious",
  "Calm",
  "Irritable",
  "Happy",
  "Tired",
  "Energetic",
  "Stressed",
  "Hopeful",
];

export default function MoodTracker() {
  const [logs, setLogs] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [journal, setJournal] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/mood");
      setLogs(res.data.moods);
    } catch (error) {
      console.error("Failed to fetch moods", error);
    }
  };

  const toggleEmotion = (emotion) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    try {
      await axios.post("http://localhost:5000/api/mood", {
        date: new Date(),
        mood: selectedMood.label,
        moodScore: selectedMood.score,
        emotions: selectedEmotions,
        journalEntry: journal,
      });
      setSubmitted(true);
      fetchMoods();
      // Reset form
      setTimeout(() => {
        setSubmitted(false);
        setSelectedMood(null);
        setSelectedEmotions([]);
        setJournal("");
      }, 2000);
    } catch (error) {
      console.error("Failed to log mood", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        🧠 Mood & Mental Health
      </h2>

      {!submitted ? (
        <div className="space-y-6">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How are you feeling today?
            </label>
            <div className="flex justify-between gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMood(m)}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                    selectedMood?.label === m.label
                      ? `${m.color} scale-105 shadow-md`
                      : "bg-white border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="text-3xl mb-1">{m.emoji}</div>
                  <div className="text-xs font-semibold text-gray-600">
                    {m.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Emotions Chips */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Which emotions describe it best?
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => toggleEmotion(e)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    selectedEmotions.includes(e)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Journal Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Journal (Optional)
            </label>
            <textarea
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="3"
              placeholder="What's on your mind?..."
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedMood}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Log Mood
          </button>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">✨</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Logged Successfully!
          </h3>
          <p className="text-gray-500">
            Tracking your mood helps identify patterns over time.
          </p>
        </div>
      )}

      {/* Recent History (Mini) */}
      {logs.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">
            Recent History
          </h4>
          <div className="space-y-3">
            {logs.slice(0, 3).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl pt-1">
                  {MOODS.find((m) => m.label === log.mood)?.emoji || "😐"}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">
                      {log.mood}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.date).toLocaleDateString()}
                    </span>
                  </div>
                  {log.emotions.length > 0 && (
                    <div className="flex gap-1 mb-1">
                      {log.emotions.map((e) => (
                        <span
                          key={e}
                          className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  )}
                  {log.journalEntry && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      "{log.journalEntry}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
