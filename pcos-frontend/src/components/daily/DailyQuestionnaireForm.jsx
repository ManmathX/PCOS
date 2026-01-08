import { useState } from "react";
import PropTypes from "prop-types";
import PhotoCapture from "./PhotoCapture";

const DailyQuestionnaireForm = ({
  onSubmit,
  initialData = null,
  selectedDate = null,
}) => {
  const [formData, setFormData] = useState({
    date:
      selectedDate ||
      initialData?.date ||
      new Date().toISOString().split("T")[0],
    mood: initialData?.mood || "",
    isOnPeriod: initialData?.isOnPeriod || false,
    flowIntensity: initialData?.flowIntensity || "",
    cramps: initialData?.cramps || "",
    energyLevel: initialData?.energyLevel || "",
    sleepQuality: initialData?.sleepQuality || "",
    sleepHours: initialData?.sleepHours || "",
    stressLevel: initialData?.stressLevel || "",
    exerciseMinutes: initialData?.exerciseMinutes || "",
    symptoms: initialData?.symptoms || [],
    notes: initialData?.notes || "",
    photoUrl: initialData?.photoUrl || null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodOptions = [
    "happy",
    "sad",
    "anxious",
    "energetic",
    "tired",
    "calm",
    "irritable",
    "neutral",
  ];
  const flowOptions = ["light", "moderate", "heavy"];
  const symptomOptions = [
    "headache",
    "bloating",
    "acne",
    "hair_fall",
    "mood_swings",
    "fatigue",
    "breast_tenderness",
    "back_pain",
    "nausea",
    "food_cravings",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSymptomToggle = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handlePhotoCapture = (photoData) => {
    setFormData((prev) => ({
      ...prev,
      photoUrl: photoData,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.mood) {
      alert("Please select your mood");
      return;
    }

    // Validate numeric fields are within range
    if (formData.cramps && (formData.cramps < 0 || formData.cramps > 10)) {
      alert("Cramps severity must be between 0 and 10");
      return;
    }
    if (
      formData.energyLevel &&
      (formData.energyLevel < 0 || formData.energyLevel > 10)
    ) {
      alert("Energy level must be between 0 and 10");
      return;
    }
    if (
      formData.sleepQuality &&
      (formData.sleepQuality < 0 || formData.sleepQuality > 10)
    ) {
      alert("Sleep quality must be between 0 and 10");
      return;
    }
    if (
      formData.stressLevel &&
      (formData.stressLevel < 0 || formData.stressLevel > 10)
    ) {
      alert("Stress level must be between 0 and 10");
      return;
    }
    if (
      formData.sleepHours &&
      (formData.sleepHours < 0 || formData.sleepHours > 24)
    ) {
      alert("Sleep hours must be between 0 and 24");
      return;
    }
    if (formData.exerciseMinutes && formData.exerciseMinutes < 0) {
      alert("Exercise minutes cannot be negative");
      return;
    }

    // Validate period flow is selected if on period
    if (formData.isOnPeriod && !formData.flowIntensity) {
      alert("Please select flow intensity");
      return;
    }

    setIsSubmitting(true);

    // Convert empty strings to null for numeric fields
    const cleanedData = {
      ...formData,
      cramps: formData.cramps === "" ? null : parseInt(formData.cramps),
      energyLevel:
        formData.energyLevel === "" ? null : parseInt(formData.energyLevel),
      sleepQuality:
        formData.sleepQuality === "" ? null : parseInt(formData.sleepQuality),
      sleepHours:
        formData.sleepHours === "" ? null : parseFloat(formData.sleepHours),
      stressLevel:
        formData.stressLevel === "" ? null : parseInt(formData.stressLevel),
      exerciseMinutes:
        formData.exerciseMinutes === ""
          ? null
          : parseInt(formData.exerciseMinutes),
      flowIntensity: formData.isOnPeriod ? formData.flowIntensity : null,
    };

    try {
      await onSubmit(cleanedData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Daily Health Check-in
      </h2>

      {/* Date */}
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={new Date().toISOString().split("T")[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      {/* Mood */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How are you feeling today? <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Select the mood that best describes how you&apos;re feeling
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {moodOptions.map((mood) => (
            <button
              key={mood}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, mood }))}
              className={`px-4 py-2 rounded-md capitalize transition-colors ${
                formData.mood === mood
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Period Tracking */}
      <div className="space-y-3 border-t pt-4">
        <h3 className="font-semibold text-gray-800">Period Information</h3>
        <p className="text-xs text-gray-500">
          Track your menstrual cycle to help us understand patterns
        </p>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isOnPeriod"
            name="isOnPeriod"
            checked={formData.isOnPeriod}
            onChange={handleChange}
            className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="isOnPeriod" className="ml-2 text-sm text-gray-700">
            I&apos;m on my period today
          </label>
        </div>

        {formData.isOnPeriod && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flow Intensity <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {flowOptions.map((flow) => (
                  <button
                    key={flow}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, flowIntensity: flow }))
                    }
                    className={`px-4 py-2 rounded-md capitalize flex-1 ${
                      formData.flowIntensity === flow
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {flow}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="cramps"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cramps Severity (0-10)
              </label>
              <p className="text-xs text-gray-500 mb-1">
                0 = No pain, 10 = Severe pain
              </p>
              <input
                type="number"
                id="cramps"
                name="cramps"
                min="0"
                max="10"
                value={formData.cramps}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </>
        )}
      </div>

      {/* General Health */}
      <div className="space-y-3 border-t pt-4">
        <h3 className="font-semibold text-gray-800">General Health</h3>
        <p className="text-xs text-gray-500">
          Help us understand your daily wellness patterns
        </p>

        <div>
          <label
            htmlFor="energyLevel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Energy Level (1-10): {formData.energyLevel || 5}
          </label>
          <input
            type="range"
            id="energyLevel"
            name="energyLevel"
            min="1"
            max="10"
            value={formData.energyLevel || 5}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low</span>
            <span className="font-medium text-gray-700">
              {formData.energyLevel || 5}
            </span>
            <span>High</span>
          </div>
        </div>

        <div>
          <label
            htmlFor="sleepQuality"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sleep Quality (1-10)
          </label>
          <input
            type="range"
            id="sleepQuality"
            name="sleepQuality"
            min="1"
            max="10"
            value={formData.sleepQuality || 5}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Poor</span>
            <span className="font-medium text-gray-700">
              {formData.sleepQuality || 5}
            </span>
            <span>Excellent</span>
          </div>
        </div>

        <div>
          <label
            htmlFor="sleepHours"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Hours of Sleep
          </label>
          <input
            type="number"
            id="sleepHours"
            name="sleepHours"
            min="0"
            max="24"
            step="0.5"
            value={formData.sleepHours}
            onChange={handleChange}
            placeholder="e.g., 7.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label
            htmlFor="stressLevel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Stress Level (1-10)
          </label>
          <input
            type="range"
            id="stressLevel"
            name="stressLevel"
            min="1"
            max="10"
            value={formData.stressLevel || 5}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Relaxed</span>
            <span className="font-medium text-gray-700">
              {formData.stressLevel || 5}
            </span>
            <span>Very Stressed</span>
          </div>
        </div>

        <div>
          <label
            htmlFor="exerciseMinutes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Exercise (minutes)
          </label>
          <input
            type="number"
            id="exerciseMinutes"
            name="exerciseMinutes"
            min="0"
            value={formData.exerciseMinutes}
            onChange={handleChange}
            placeholder="e.g., 30"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Symptoms */}
      <div className="space-y-3 border-t pt-4">
        <h3 className="font-semibold text-gray-800">Symptoms</h3>
        <p className="text-xs text-gray-500">
          Select any symptoms you&apos;re experiencing today
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {symptomOptions.map((symptom) => (
            <button
              key={symptom}
              type="button"
              onClick={() => handleSymptomToggle(symptom)}
              className={`px-3 py-2 rounded-md text-sm capitalize transition-colors ${
                formData.symptoms.includes(symptom)
                  ? "bg-red-100 text-red-800 border-2 border-red-500"
                  : "bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {symptom.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Additional Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Any additional information about your day..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Photo Capture */}
      <div className="border-t pt-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-800">
            Daily Photo (Optional)
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Take a daily photo to track skin changes over time. Our AI will
            analyze acne, facial hair, and skin texture to help monitor PCOS
            symptoms.
          </p>
        </div>
        <PhotoCapture
          onPhotoCapture={handlePhotoCapture}
          initialPhoto={formData.photoUrl}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting ? "Saving..." : "Save Daily Log"}
      </button>

      <p className="text-xs text-gray-500 text-center">* Required fields</p>
    </form>
  );
};

DailyQuestionnaireForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  selectedDate: PropTypes.string,
};

export default DailyQuestionnaireForm;
