import React from "react";
import MedicationTracker from "../../components/health/MedicationTracker";
import NutritionTracker from "../../components/health/NutritionTracker";
import BodyMetrics from "../../components/health/BodyMetrics";
import LabResults from "../../components/health/LabResults";
import MoodTracker from "../../components/health/MoodTracker";
import ExerciseLogger from "../../components/health/ExerciseLogger";
import SleepTracker from "../../components/health/SleepTracker";
import UserCommunity from "../../components/health/UserCommunity";
import SkinHairTracker from "../../components/health/SkinHairTracker";
import FertilityPlanner from "../../components/health/FertilityPlanner";

export default function ComprehensiveHealthPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Comprehensive Health Tracker
        </h1>
        <p className="text-gray-600">
          All your PCOS health metrics in one place.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Column 1: Core Health */}
        <div className="space-y-8">
          <MedicationTracker />
          <NutritionTracker />
          <ExerciseLogger />
          <SleepTracker />
        </div>

        {/* Column 2: Specific PCOS Tracking */}
        <div className="space-y-8">
          <BodyMetrics />
          <MoodTracker />
          <SkinHairTracker />
          <FertilityPlanner />
          <LabResults />
        </div>
      </div>

      {/* Full Width Community */}
      <UserCommunity />
    </div>
  );
}
