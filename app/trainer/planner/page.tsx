"use client";

import React, { useState } from "react";
import { TrainerPortalLayout } from "@/components/layout/TrainerPortalLayout";
import { useApolloStore, WorkoutPlan, ExerciseItem } from "@/lib/apollo-demo-store";
import {
  Utensils,
  Dumbbell,
  Moon,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  Flame,
  Apple,
  Clock,
  User,
  Copy,
  ChevronRight,
  Target,
  Sliders,
  Check,
  RotateCcw,
  BookOpen,
} from "lucide-react";

interface NutritionItem {
  id: string;
  meal: "Suhoor" | "Iftar" | "Post-Taraweeh" | "Standard Breakfast" | "Lunch" | "Dinner";
  food: string;
  portion: string;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  calories: number;
}

const STANDARD_DIET: NutritionItem[] = [
  { id: "d-1", meal: "Standard Breakfast", food: "2 Whole Anda Paratha (Desi Ghee lightly brushed) + 3 Boiled Egg Whites", portion: "Medium", proteinG: 34, carbsG: 45, fatsG: 18, calories: 480 },
  { id: "d-2", meal: "Lunch", food: "Chicken Karahi (Boneless Breast) + 2 Whole Wheat Rotis + Fresh Salad", portion: "250g Chicken", proteinG: 52, carbsG: 55, fatsG: 14, calories: 550 },
  { id: "d-3", meal: "Dinner", food: "Daal Chawal (Brown Rice + Chana Daal) + Grilled Fish Fillet", portion: "1 Bowl", proteinG: 40, carbsG: 68, fatsG: 10, calories: 520 },
];

const RAMADAN_DIET: NutritionItem[] = [
  { id: "r-1", meal: "Suhoor", food: "Oatmeal with Almond Milk + 2 Whole Eggs + 1 Glass Chilled Sattu Drink (Slow Digesting)", portion: "Pre-Dawn", proteinG: 38, carbsG: 65, fatsG: 16, calories: 560 },
  { id: "r-2", meal: "Iftar", food: "2 Khajoor (Medjool Dates) + 1 Glass Water + Grilled Chicken Boti Skewers (No Deep Frying)", portion: "Sunset Fast-Break", proteinG: 44, carbsG: 42, fatsG: 8, calories: 420 },
  { id: "r-3", meal: "Post-Taraweeh", food: "1 Scoop Whey Shake in Water + 1 Whole Wheat Roti + Beef Qeema (Lean)", portion: "10:30 PM Night Fuel", proteinG: 55, carbsG: 40, fatsG: 12, calories: 490 },
];

export default function TrainerPlannerPage() {
  const {
    members,
    trainers,
    workouts,
    generateAiWorkout,
    saveWorkout,
    assignWorkoutToClient,
    deleteWorkout,
  } = useApolloStore();

  const [activeTab, setActiveTab] = useState<"ai_generator" | "saved_workouts" | "desi_nutrition">("ai_generator");

  // AI Generator Form States
  const [goal, setGoal] = useState("Strength & Hypertrophy");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(["Chest", "Back", "Legs"]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([
    "Barbell",
    "Dumbbells",
    "Cables",
    "Squat Rack",
  ]);
  const [limitations, setLimitations] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || "");
  const [isGenerating, setIsGenerating] = useState(false);

  // Active / Draft Workout Plan
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(workouts[0] || null);
  const [notification, setNotification] = useState<{ type: "success" | "info"; message: string } | null>(null);

  // Nutrition State
  const [ramadanMode, setRamadanMode] = useState(true);
  const activeDiet = ramadanMode ? RAMADAN_DIET : STANDARD_DIET;
  const totalProtein = activeDiet.reduce((acc, i) => acc + i.proteinG, 0);
  const totalCarbs = activeDiet.reduce((acc, i) => acc + i.carbsG, 0);
  const totalFats = activeDiet.reduce((acc, i) => acc + i.fatsG, 0);
  const totalCalories = activeDiet.reduce((acc, i) => acc + i.calories, 0);

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleMuscle = (muscle: string) => {
    if (selectedMuscles.includes(muscle)) {
      if (selectedMuscles.length > 1) {
        setSelectedMuscles(selectedMuscles.filter((m) => m !== muscle));
      }
    } else {
      setSelectedMuscles([...selectedMuscles, muscle]);
    }
  };

  const handleToggleEquipment = (eq: string) => {
    if (selectedEquipment.includes(eq)) {
      if (selectedEquipment.length > 1) {
        setSelectedEquipment(selectedEquipment.filter((e) => e !== eq));
      }
    } else {
      setSelectedEquipment([...selectedEquipment, eq]);
    }
  };

  const handleTriggerAiGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateAiWorkout({
        goal,
        experienceLevel,
        durationMinutes,
        daysPerWeek,
        targetMuscleGroups: selectedMuscles,
        equipmentNeeded: selectedEquipment,
        limitations: limitations.trim() || undefined,
      });

      if (selectedMemberId) {
        generated.assignedMemberId = selectedMemberId;
      }

      setCurrentPlan(generated);
      setIsGenerating(false);
      showNotification("New AI Hypertrophy protocol synthesized successfully!");
    }, 600);
  };

  const handleSaveCurrentPlan = () => {
    if (!currentPlan) return;
    saveWorkout(currentPlan);
    showNotification(`Plan "${currentPlan.title}" saved to library.`);
  };

  const handleAssignToClient = (memberId: string) => {
    if (!currentPlan) return;
    assignWorkoutToClient(currentPlan.id, memberId);
    setCurrentPlan({ ...currentPlan, assignedMemberId: memberId });
    const targetMember = members.find((m) => m.id === memberId);
    showNotification(`Protocol assigned to ${targetMember?.name || "client"}! Synced to Mobile App.`);
  };

  const handleDuplicatePlan = () => {
    if (!currentPlan) return;
    const duplicated: WorkoutPlan = {
      ...currentPlan,
      id: `wkt-${Date.now()}`,
      title: `${currentPlan.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    saveWorkout(duplicated);
    setCurrentPlan(duplicated);
    showNotification("Routine duplicated and loaded into editor.");
  };

  const handleDeleteCurrentPlan = () => {
    if (!currentPlan) return;
    deleteWorkout(currentPlan.id);
    setCurrentPlan(workouts.find((w) => w.id !== currentPlan.id) || null);
    showNotification("Workout plan deleted from repository.", "info");
  };

  const handleAddExerciseToCurrent = () => {
    if (!currentPlan) return;
    const newEx: ExerciseItem = {
      name: "Dumbbell Incline Curl",
      sets: 3,
      reps: "10-12",
      restSeconds: 60,
      targetMuscle: "Biceps",
      difficulty: "Beginner",
      instructions: "Keep upper arms stationary, curl weights towards shoulders.",
    };
    const updated = {
      ...currentPlan,
      exercises: [...currentPlan.exercises, newEx],
    };
    setCurrentPlan(updated);
    saveWorkout(updated);
    showNotification("Added exercise to active protocol.");
  };

  const handleRemoveExercise = (idx: number) => {
    if (!currentPlan) return;
    const updatedExercises = currentPlan.exercises.filter((_, i) => i !== idx);
    const updated = { ...currentPlan, exercises: updatedExercises };
    setCurrentPlan(updated);
    saveWorkout(updated);
    showNotification("Exercise removed.", "info");
  };

  return (
    <TrainerPortalLayout activeItem="planner">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Interactive AI Workout & Nutrition Architect</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {workouts.length} Active Protocols
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Generate scientifically tailored periodized lifting splits and desi Ramadan macro protocols with one click
            </span>
          </div>

          {/* Navigation Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold shadow-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab("ai_generator")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "ai_generator"
                  ? "bg-amber-400 hover:bg-amber-300 dark:bg-[#FFD91C] text-slate-950 font-bold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Generator</span>
            </button>

            <button
              onClick={() => setActiveTab("saved_workouts")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "saved_workouts"
                  ? "bg-amber-400 hover:bg-amber-300 dark:bg-[#FFD91C] text-slate-950 font-bold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Saved Protocols ({workouts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("desi_nutrition")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "desi_nutrition"
                  ? "bg-amber-400 hover:bg-amber-300 dark:bg-[#FFD91C] text-slate-950 font-bold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>Desi Diet & Ramadan</span>
            </button>
          </div>
        </div>

        {/* Global Notification */}
        {notification && (
          <div
            className={`p-3.5 rounded-[14px] text-[12.5px] font-bold flex items-center gap-2 animate-in fade-in ${
              notification.type === "success"
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: AI WORKOUT GENERATOR */}
        {/* ========================================================================= */}
        {activeTab === "ai_generator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Form Column (5 Cols) */}
            <div className="lg:col-span-5 glass-panel p-5 rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-500 dark:text-[#FFD91C]" />
                  <h3 className="text-[15px] font-[800] text-slate-900 dark:text-white">
                    Protocol Synthesis Controls
                  </h3>
                </div>
                <span className="text-[10.5px] font-mono text-slate-500 dark:text-neutral-400">
                  v2.8 Neural Core
                </span>
              </div>

              {/* Goal */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold text-slate-700 dark:text-neutral-300">
                  Primary Fitness Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[12.5px] font-semibold"
                >
                  <option value="Strength & Hypertrophy">Strength & Hypertrophy (Muscle Gain)</option>
                  <option value="Fat Loss & Metabolic Conditioning">Fat Loss & Metabolic Conditioning</option>
                  <option value="Powerlifting & Peak Strength">Powerlifting & Peak Strength</option>
                  <option value="Athletic Mobility & Speed">Athletic Mobility & Speed</option>
                  <option value="Functional Longevity">Functional Longevity & Posture</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold text-slate-700 dark:text-neutral-300">
                  Experience Tier
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["Beginner", "Intermediate", "Advanced", "Elite"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`py-1.5 rounded-[8px] text-[11px] font-bold border transition-all ${
                        experienceLevel === lvl
                          ? "bg-amber-400 dark:bg-[#FFD91C] text-slate-950 border-transparent shadow-sm"
                          : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-400"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders: Duration & Days Per Week */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11.5px] font-bold">
                    <span className="text-slate-700 dark:text-neutral-300">Duration</span>
                    <span className="text-amber-600 dark:text-[#FFD91C] font-mono">{durationMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    step="15"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11.5px] font-bold">
                    <span className="text-slate-700 dark:text-neutral-300">Days / Week</span>
                    <span className="text-amber-600 dark:text-[#FFD91C] font-mono">{daysPerWeek} days</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="1"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* Target Muscle Groups */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold text-slate-700 dark:text-neutral-300">
                  Target Muscle Groups
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"].map((m) => {
                    const isSelected = selectedMuscles.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleToggleMuscle(m)}
                        className={`px-2.5 py-1 rounded-[8px] text-[11px] font-bold border transition-all ${
                          isSelected
                            ? "bg-amber-400/20 text-amber-700 dark:text-[#FFD91C] border-amber-400/50"
                            : "bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-white/10"
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Equipment Available */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold text-slate-700 dark:text-neutral-300">
                  Available Equipment
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Barbell", "Dumbbells", "Cables", "Squat Rack", "Kettlebells", "Machines", "Bodyweight"].map(
                    (eq) => {
                      const isSelected = selectedEquipment.includes(eq);
                      return (
                        <button
                          key={eq}
                          type="button"
                          onClick={() => handleToggleEquipment(eq)}
                          className={`px-2.5 py-1 rounded-[8px] text-[11px] font-bold border transition-all ${
                            isSelected
                              ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/40"
                              : "bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-white/10"
                          }`}
                        >
                          {eq}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Limitations / Injuries */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold text-slate-700 dark:text-neutral-300">
                  Limitations / Prior Injuries (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mild lumbar strain, rotator cuff impingement..."
                  value={limitations}
                  onChange={(e) => setLimitations(e.target.value)}
                  className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[12px]"
                />
              </div>

              {/* Target Client */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold text-slate-700 dark:text-neutral-300">
                  Assign directly to Member
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[12.5px] font-semibold"
                >
                  <option value="">-- No Direct Assignment --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.memberCode}) • {m.fitnessGoal}
                    </option>
                  ))}
                </select>
              </div>

              {/* Synthesis Button */}
              <button
                type="button"
                onClick={handleTriggerAiGeneration}
                disabled={isGenerating}
                className="w-full py-3 rounded-[12px] bg-amber-400 dark:bg-[#FFD91C] hover:bg-amber-300 dark:hover:bg-[#ffe34d] text-slate-950 font-black text-[13px] flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                <span>{isGenerating ? "Synthesizing Neural Protocol..." : "Generate AI Hypertrophy Protocol"}</span>
              </button>
            </div>

            {/* Editor Column (7 Cols) */}
            <div className="lg:col-span-7 glass-panel p-5 rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              {currentPlan ? (
                <>
                  {/* Top Bar of Active Plan */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          {currentPlan.isAiGenerated ? "AI Synthesized" : "Trainer Custom"}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                          {currentPlan.durationMinutes} min • {currentPlan.daysPerWeek} days/wk
                        </span>
                      </div>
                      <h3 className="text-[18px] font-[900] text-slate-900 dark:text-white">
                        {currentPlan.title}
                      </h3>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={handleSaveCurrentPlan}
                        className="px-3 py-1.5 rounded-[9px] bg-amber-400 dark:bg-[#FFD91C] hover:bg-amber-300 text-slate-950 font-bold text-[11.5px] flex items-center gap-1 shadow-sm"
                        title="Save to Protocol Library"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>

                      <button
                        onClick={handleDuplicatePlan}
                        className="px-2.5 py-1.5 rounded-[9px] bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-[11.5px] flex items-center gap-1"
                        title="Duplicate Routine"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Duplicate</span>
                      </button>

                      <button
                        onClick={handleDeleteCurrentPlan}
                        className="p-1.5 rounded-[9px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Assigned Client Info */}
                  <div className="p-3 rounded-[12px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-500 dark:text-[#FFD91C]" />
                      <span className="text-[12px] font-bold text-slate-800 dark:text-neutral-200">
                        Assigned To:{" "}
                        {currentPlan.assignedMemberId
                          ? members.find((m) => m.id === currentPlan.assignedMemberId)?.name || "Assigned Client"
                          : "Unassigned Template"}
                      </span>
                    </div>

                    <select
                      value={currentPlan.assignedMemberId || ""}
                      onChange={(e) => handleAssignToClient(e.target.value)}
                      className="px-2.5 py-1 rounded-[8px] bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-[11.5px] font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="">Reassign Client...</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Exercises List */}
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {currentPlan.exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-[14px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-700 dark:text-[#FFD91C] font-black text-[11px] flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-extrabold text-[13px] text-slate-900 dark:text-white">
                              {ex.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-neutral-300">
                              {ex.targetMuscle}
                            </span>
                            <button
                              onClick={() => handleRemoveExercise(idx)}
                              className="text-slate-400 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-[11.5px] font-bold">
                          <span className="text-amber-600 dark:text-[#FFD91C] font-mono">
                            {ex.sets} Sets × {ex.reps} Reps
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 dark:text-neutral-400">
                            {ex.restSeconds}s Rest Interval
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 text-[10.5px]">
                            {ex.difficulty}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 italic">
                          "{ex.instructions}"
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add Exercise Quick Button */}
                  <button
                    onClick={handleAddExerciseToCurrent}
                    className="w-full py-2.5 rounded-[12px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4 text-amber-500 dark:text-[#FFD91C]" />
                    <span>+ Add Custom Exercise Movement</span>
                  </button>
                </>
              ) : (
                <div className="py-20 text-center space-y-3">
                  <Dumbbell className="w-12 h-12 text-slate-400 mx-auto" />
                  <div className="text-[15px] font-bold text-slate-800 dark:text-neutral-200">
                    No Active Protocol Selected
                  </div>
                  <p className="text-[12.5px] text-slate-500 max-w-sm mx-auto">
                    Configure parameters on the left and click "Generate AI Hypertrophy Protocol" to synthesize a routine.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SAVED WORKOUTS REPOSITORY */}
        {/* ========================================================================= */}
        {activeTab === "saved_workouts" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workouts.map((w) => {
                const assignedClient = members.find((m) => m.id === w.assignedMemberId);
                return (
                  <div
                    key={w.id}
                    className="glass-panel p-5 rounded-[20px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400/20 text-amber-700 dark:text-[#FFD91C] border border-amber-400/40">
                          {w.goal}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {w.durationMinutes} min
                        </span>
                      </div>

                      <h4 className="text-[16px] font-[800] text-slate-900 dark:text-white">
                        {w.title}
                      </h4>

                      <div className="text-[11.5px] text-slate-500 dark:text-neutral-400 flex items-center gap-2">
                        <span>{w.exercises.length} Exercises</span>
                        <span>•</span>
                        <span>{w.daysPerWeek} Days/Wk</span>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {w.targetMuscleGroups.map((grp) => (
                          <span
                            key={grp}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-neutral-300 font-semibold"
                          >
                            {grp}
                          </span>
                        ))}
                      </div>

                      {assignedClient && (
                        <div className="text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Assigned to: {assignedClient.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setCurrentPlan(w);
                          setActiveTab("ai_generator");
                          showNotification(`Loaded "${w.title}" into Planner.`);
                        }}
                        className="px-3 py-1.5 rounded-[9px] bg-amber-400 dark:bg-[#FFD91C] text-slate-950 font-bold text-[11.5px]"
                      >
                        Open Editor
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const copy: WorkoutPlan = {
                              ...w,
                              id: `wkt-${Date.now()}`,
                              title: `${w.title} (Copy)`,
                            };
                            saveWorkout(copy);
                            showNotification("Routine duplicated.");
                          }}
                          className="p-1.5 rounded-[8px] bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-white"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            deleteWorkout(w.id);
                            showNotification("Deleted workout routine.", "info");
                          }}
                          className="p-1.5 rounded-[8px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DESI NUTRITION & RAMADAN FASTING SPLIT */}
        {/* ========================================================================= */}
        {activeTab === "desi_nutrition" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Fasting Split Config (5 cols) */}
            <div className="lg:col-span-5 glass-panel p-5 rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-amber-500 dark:text-[#FFD91C]" />
                  <h3 className="text-[15px] font-[800] text-slate-900 dark:text-white">
                    Diet Timetable & Fasting Engine
                  </h3>
                </div>
                <button
                  onClick={() => setRamadanMode(!ramadanMode)}
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition-all ${
                    ramadanMode
                      ? "bg-amber-400 dark:bg-[#FFD91C] text-slate-950 border-amber-400 shadow-sm"
                      : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-neutral-400 border-transparent"
                  }`}
                >
                  {ramadanMode ? "Ramadan Active" : "Standard Diet"}
                </button>
              </div>

              <p className="text-[12px] text-slate-500 dark:text-neutral-400">
                High-protein nutritional breakdowns optimized for South Asian diets with authentic Pakistani meals (Anda Paratha, Chicken Karahi, Sattu, Medjool Dates).
              </p>

              {/* Macro Summary Panel */}
              <div className="p-4 rounded-[16px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-neutral-400 font-bold">CALORIES</div>
                  <div className="text-[16px] font-[900] text-slate-900 dark:text-white font-mono">{totalCalories}</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">PROTEIN</div>
                  <div className="text-[16px] font-[900] text-emerald-600 dark:text-emerald-400 font-mono">{totalProtein}g</div>
                </div>
                <div>
                  <div className="text-[10px] text-amber-600 dark:text-[#FFD91C] font-bold">CARBS</div>
                  <div className="text-[16px] font-[900] text-amber-600 dark:text-[#FFD91C] font-mono">{totalCarbs}g</div>
                </div>
                <div>
                  <div className="text-[10px] text-blue-500 font-bold">FATS</div>
                  <div className="text-[16px] font-[900] text-blue-500 font-mono">{totalFats}g</div>
                </div>
              </div>

              <div className="p-3.5 rounded-[14px] bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-[#FFD91C] text-[12px] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Pakistani Fasting Optimization Tip</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Consume Sattu drink at Suhoor to maintain electrolyte and glycogen balance during prolonged fasting hours in hot climate.
                </p>
              </div>
            </div>

            {/* Right Column: Meals List (7 cols) */}
            <div className="lg:col-span-7 glass-panel p-5 rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
              <h3 className="text-[16px] font-[800] text-slate-900 dark:text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-500 dark:text-[#FFD91C]" />
                <span>{ramadanMode ? "Ramadan Fasting Split (PKT Timetable)" : "Standard Daily Routine"}</span>
              </h3>

              <div className="space-y-3">
                {activeDiet.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-[16px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10.5px] font-black uppercase bg-amber-400/20 text-amber-700 dark:text-[#FFD91C] border border-amber-400/40">
                        {item.meal}
                      </span>
                      <span className="text-[12.5px] font-mono font-extrabold text-slate-900 dark:text-white">
                        {item.calories} kcal
                      </span>
                    </div>

                    <div className="font-extrabold text-[13.5px] text-slate-900 dark:text-white">
                      {item.food}
                    </div>

                    <div className="flex items-center gap-4 text-[11.5px] text-slate-600 dark:text-neutral-400 font-semibold">
                      <span className="text-emerald-600 dark:text-emerald-400">Protein: {item.proteinG}g</span>
                      <span>•</span>
                      <span className="text-amber-600 dark:text-[#FFD91C]">Carbs: {item.carbsG}g</span>
                      <span>•</span>
                      <span className="text-blue-500">Fats: {item.fatsG}g</span>
                      <span>•</span>
                      <span className="text-slate-400 font-normal">Portion: {item.portion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </TrainerPortalLayout>
  );
}
