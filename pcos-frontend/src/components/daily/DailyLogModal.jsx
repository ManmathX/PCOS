import PropTypes from "prop-types";

const DailyLogModal = ({ isOpen, onClose, date, log }) => {
  if (!isOpen || !date) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {formatDate(date)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
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

        {/* Content */}
        <div className="px-6 py-4">
          {!log ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No log entry for this date
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Click &quot;Add Log&quot; to create an entry for this day
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Photo */}
              {log.photoUrl && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Daily Photo (Skin & Hair Tracking)
                  </h3>
                  <div className="relative rounded-lg overflow-hidden border-2 border-purple-200 shadow-md">
                    <img
                      src={log.photoUrl}
                      alt="Daily tracking photo"
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Photo Analysis Results */}
                  {log.acneSeverity !== null &&
                    log.acneSeverity !== undefined && (
                      <div className="mt-4 bg-white rounded-lg p-3 border border-purple-200">
                        <h4 className="text-xs font-semibold text-gray-600 mb-2">
                          AI Analysis Results
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-gray-500">
                              Acne Severity:
                            </span>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    log.acneSeverity > 7
                                      ? "bg-red-500"
                                      : log.acneSeverity > 4
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }`}
                                  style={{
                                    width: `${(log.acneSeverity / 10) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="font-medium text-gray-700">
                                {log.acneSeverity.toFixed(1)}/10
                              </span>
                            </div>
                          </div>

                          {log.facialHairScore !== null &&
                            log.facialHairScore !== undefined && (
                              <div>
                                <span className="text-gray-500">
                                  Facial Hair:
                                </span>
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        log.facialHairScore > 7
                                          ? "bg-red-500"
                                          : log.facialHairScore > 4
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                      }`}
                                      style={{
                                        width: `${
                                          (log.facialHairScore / 10) * 100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="font-medium text-gray-700">
                                    {log.facialHairScore.toFixed(1)}/10
                                  </span>
                                </div>
                              </div>
                            )}

                          {log.skinTexture !== null &&
                            log.skinTexture !== undefined && (
                              <div>
                                <span className="text-gray-500">
                                  Skin Quality:
                                </span>
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        log.skinTexture > 7
                                          ? "bg-green-500"
                                          : log.skinTexture > 4
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }`}
                                      style={{
                                        width: `${
                                          (log.skinTexture / 10) * 100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="font-medium text-gray-700">
                                    {log.skinTexture.toFixed(1)}/10
                                  </span>
                                </div>
                              </div>
                            )}

                          {log.acneCount !== null &&
                            log.acneCount !== undefined && (
                              <div>
                                <span className="text-gray-500">
                                  Detected Spots:
                                </span>
                                <span className="font-medium text-gray-700 ml-2">
                                  {log.acneCount}
                                </span>
                              </div>
                            )}
                        </div>
                        {log.analysisDate && (
                          <p className="text-[10px] text-gray-400 mt-2">
                            Analyzed:{" "}
                            {new Date(log.analysisDate).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                  <p className="text-xs text-gray-500 mt-2">
                    📊 Track changes in acne and facial hair growth over time
                  </p>
                </div>
              )}

              {/* Mood */}
              {log.mood && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Mood
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{getMoodEmoji(log.mood)}</span>
                    <span className="text-lg capitalize text-gray-800">
                      {log.mood}
                    </span>
                  </div>
                </div>
              )}

              {/* Period Information */}
              {log.isOnPeriod && (
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Period Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-pink-600">🔴</span>
                      <span className="text-gray-800">On period</span>
                    </div>
                    {log.flowIntensity && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Flow:</span>
                        <span className="capitalize text-gray-800 font-medium">
                          {log.flowIntensity}
                        </span>
                      </div>
                    )}
                    {log.cramps !== null && log.cramps !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cramps:</span>
                        <span className="text-gray-800 font-medium">
                          {log.cramps}/10
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Health Metrics */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Health Metrics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {log.energyLevel !== null &&
                    log.energyLevel !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600">Energy Level</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {log.energyLevel}/10
                        </p>
                      </div>
                    )}
                  {log.sleepQuality !== null &&
                    log.sleepQuality !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600">Sleep Quality</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {log.sleepQuality}/10
                        </p>
                      </div>
                    )}
                  {log.sleepHours !== null && log.sleepHours !== undefined && (
                    <div>
                      <p className="text-xs text-gray-600">Sleep Hours</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {log.sleepHours}h
                      </p>
                    </div>
                  )}
                  {log.stressLevel !== null &&
                    log.stressLevel !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600">Stress Level</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {log.stressLevel}/10
                        </p>
                      </div>
                    )}
                  {log.exerciseMinutes !== null &&
                    log.exerciseMinutes !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600">Exercise</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {log.exerciseMinutes} min
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* Symptoms */}
              {log.symptoms && log.symptoms.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Symptoms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {log.symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm capitalize"
                      >
                        {symptom.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {log.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {log.notes}
                  </p>
                </div>
              )}

              {/* Timestamp */}
              <div className="text-xs text-gray-400 text-right">
                Last updated: {new Date(log.updatedAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

DailyLogModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date),
  log: PropTypes.object,
};

export default DailyLogModal;
