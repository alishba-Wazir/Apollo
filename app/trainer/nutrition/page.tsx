"use client";

import React, { useState, useMemo } from "react";
import { TrainerPortalLayout } from "@/components/layout/TrainerPortalLayout";
import { useApolloStore } from "@/lib/apollo-demo-store";
import {
  Utensils,
  Moon,
  Flame,
  Scale,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Download,
  Share2,
  Clock,
  Apple,
  Zap,
  Sliders,
  ChevronRight,
  User,
  Coffee,
  Check,
  Building2,
} from "lucide-react";

interface MealItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  desiOptimized?: boolean;
}

interface MealBlock {
  title: string;
  time: string;
  notes: string;
  items: MealItem[];
}

export default function TrainerNutritionPage() {
  const { members } = useApolloStore();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    members[0]?.id || "mem-1"
  );
  const [protocolType, setProtocolType] = useState<
    "DESI_MACRO" | "RAMADAN_FASTING" | "HYPERTROPHY" | "LEAN_SHRED"
  >("DESI_MACRO");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Macro Targets State
  const [dailyCalories, setDailyCalories] = useState<number>(2350);
  const [proteinGrams, setProteinGrams] = useState<number>(175);
  const [carbsGrams, setCarbsGrams] = useState<number>(240);
  const [fatsGrams, setFatsGrams] = useState<number>(65);

  const notify = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3800);
  };

  const selectedMember = useMemo(() => {
    return members.find((m) => m.id === selectedMemberId) || members[0];
  }, [members, selectedMemberId]);

  // Protocol specific meal presets
  const mealPlans: Record<string, MealBlock[]> = {
    DESI_MACRO: [
      {
        title: "Meal 1: High-Protein Desi Breakfast",
        time: "08:30 AM",
        notes: "Whole eggs + egg whites with whole-wheat brown roti (zero ghee) and fresh mint raita.",
        items: [
          { id: "m1-1", name: "Egg White Omelette with green chilies & tomatoes", portion: "4 whites + 1 whole egg", calories: 210, protein: 28, carbs: 4, fat: 6, desiOptimized: true },
          { id: "m1-2", name: "Whole-Wheat Desi Roti (Dry, 45g)", portion: "1 roti", calories: 120, protein: 4, carbs: 24, fat: 1, desiOptimized: true },
          { id: "m1-3", name: "Low-Fat Dahi (Curd / Yogurt)", portion: "150g", calories: 95, protein: 9, carbs: 10, fat: 2 },
        ],
      },
      {
        title: "Meal 2: Pre-Workout Lunch Fuel",
        time: "01:30 PM",
        notes: "Air-fried or grilled chicken breast seasoned with Shan Shan/Tikka spice mix and basmati rice.",
        items: [
          { id: "m2-1", name: "Tandoori Chicken Breast (Skinless, Lean)", portion: "200g cooked", calories: 260, protein: 48, carbs: 2, fat: 4, desiOptimized: true },
          { id: "m2-2", name: "Boiled Fragrant Basmati Rice", portion: "180g cooked", calories: 230, protein: 5, carbs: 50, fat: 1 },
          { id: "m2-3", name: "Kachumber Salad (Cucumber, tomato, onion)", portion: "1 bowl", calories: 35, protein: 1, carbs: 7, fat: 0 },
        ],
      },
      {
        title: "Meal 3: Post-Workout Evening Recovery",
        time: "06:00 PM",
        notes: "Quick hydrolysed isolate shake with banana and dates for glycogen replenishment.",
        items: [
          { id: "m3-1", name: "Whey Protein Isolate", portion: "1 scoop (30g)", calories: 120, protein: 25, carbs: 2, fat: 1 },
          { id: "m3-2", name: "Pakistani Aseel Dates", portion: "2 pcs (35g)", calories: 95, protein: 1, carbs: 24, fat: 0, desiOptimized: true },
        ],
      },
      {
        title: "Meal 4: Lean Desi Dinner",
        time: "08:45 PM",
        notes: "Slow-cooked Beef fillet tikka or Yellow Daal Tadka (cooked with olive oil spray).",
        items: [
          { id: "m4-1", name: "Beef Fillet Seekh Kababs (Air-fry, 95% lean)", portion: "180g", calories: 290, protein: 42, carbs: 4, fat: 10, desiOptimized: true },
          { id: "m4-2", name: "Daal Chana / Moong (Light olive oil spray)", portion: "150g", calories: 165, protein: 11, carbs: 24, fat: 3, desiOptimized: true },
          { id: "m4-3", name: "Steamed Broccoli & Carrots", portion: "100g", calories: 45, protein: 3, carbs: 8, fat: 0 },
        ],
      },
    ],
    RAMADAN_FASTING: [
      {
        title: "Suhoor: Sustained Energy & Hydration",
        time: "04:15 AM (Pre-Fajr)",
        notes: "Slow-digesting complex carbs, micellar casein/eggs, electrolytes to avoid dehydration.",
        items: [
          { id: "r1-1", name: "Rolled Oats with Almond Milk & Chia Seeds", portion: "80g dry oats", calories: 340, protein: 14, carbs: 58, fat: 7 },
          { id: "r1-2", name: "Boiled Eggs + Egg Whites", portion: "3 whites + 2 whole", calories: 240, protein: 26, carbs: 2, fat: 11 },
          { id: "r1-3", name: "Coconut Water or Electrolyte Saline", portion: "400 ml", calories: 75, protein: 1, carbs: 18, fat: 0 },
        ],
      },
      {
        title: "Iftar: Rapid Rehydration & Glycogen",
        time: "06:15 PM (Maghrib)",
        notes: "Break fast with water, dates and light clear chicken broth. Avoid deep fried samosas/pakoras.",
        items: [
          { id: "r2-1", name: "Medjool / Aseel Dates", portion: "2 pcs", calories: 110, protein: 1, carbs: 28, fat: 0, desiOptimized: true },
          { id: "r2-2", name: "Desi Yakhni (Clear Chicken Broth)", portion: "300 ml", calories: 85, protein: 14, carbs: 2, fat: 2, desiOptimized: true },
          { id: "r2-3", name: "Fresh Chana Chaat (Boiled chick peas, no oil)", portion: "150g", calories: 180, protein: 9, carbs: 30, fat: 2, desiOptimized: true },
        ],
      },
      {
        title: "Post-Taraweeh Dinner & Hypertrophy",
        time: "09:30 PM",
        notes: "Heavy protein meal post night training or Taraweeh prayers.",
        items: [
          { id: "r3-1", name: "Grilled Chicken Malai Boti (Low-fat yogurt marinade)", portion: "220g", calories: 320, protein: 50, carbs: 5, fat: 9, desiOptimized: true },
          { id: "r3-2", name: "Brown Rice or Whole Wheat Roti", portion: "150g", calories: 195, protein: 4, carbs: 42, fat: 1 },
          { id: "r3-3", name: "Micellar Casein Protein with Almond Milk", portion: "1 scoop", calories: 140, protein: 26, carbs: 3, fat: 1 },
        ],
      },
    ],
    HYPERTROPHY: [
      {
        title: "Meal 1: Anabolic Breakfast",
        time: "07:30 AM",
        notes: "High biological value protein with moderate carbs for early morning metabolic stimulation.",
        items: [
          { id: "h1-1", name: "Scrambled Eggs with Avocado & Toast", portion: "4 eggs + 2 slices", calories: 480, protein: 32, carbs: 38, fat: 22 },
          { id: "h1-2", name: "Greek Yogurt with Blueberries", portion: "200g", calories: 170, protein: 20, carbs: 18, fat: 2 },
        ],
      },
      {
        title: "Meal 2: Power Lunch",
        time: "12:30 PM",
        notes: "Heavy complex carbs and lean red meat for intramuscular creatine saturation.",
        items: [
          { id: "h2-1", name: "Lean Minced Beef (Keema, 90/10)", portion: "220g cooked", calories: 380, protein: 52, carbs: 0, fat: 18, desiOptimized: true },
          { id: "h2-2", name: "Sweet Potato Mash", portion: "250g", calories: 230, protein: 4, carbs: 54, fat: 0 },
        ],
      },
      {
        title: "Meal 3: Dinner Hypertrophy Stack",
        time: "07:30 PM",
        notes: "Salmon / white fish with quinoa and olive oil drizzle.",
        items: [
          { id: "h3-1", name: "Grilled Atlantic Salmon Fillet", portion: "200g", calories: 410, protein: 44, carbs: 0, fat: 24 },
          { id: "h3-2", name: "Steamed Quinoa & Asparagus", portion: "180g", calories: 210, protein: 8, carbs: 38, fat: 3 },
        ],
      },
    ],
    LEAN_SHRED: [
      {
        title: "Meal 1: Fasted Breakdown",
        time: "11:00 AM",
        notes: "First meal breaking intermittent fast. High satiety fiber and lean poultry.",
        items: [
          { id: "s1-1", name: "Grilled Herb Chicken Breast Salad", portion: "220g chicken", calories: 310, protein: 52, carbs: 8, fat: 6 },
          { id: "s1-2", name: "Hard Boiled Egg Whites", portion: "4 whites", calories: 70, protein: 16, carbs: 0, fat: 0 },
        ],
      },
      {
        title: "Meal 2: Post-Workout Fuel",
        time: "04:30 PM",
        notes: "Controlled low-glycemic carb allocation.",
        items: [
          { id: "s2-1", name: "White Fish (Sole / Tilapia Fillet)", portion: "250g", calories: 240, protein: 48, carbs: 0, fat: 3 },
          { id: "s2-2", name: "Steamed Green Beans & Broccoli", portion: "200g", calories: 75, protein: 5, carbs: 14, fat: 0 },
        ],
      },
    ],
  };

  const currentMeals = mealPlans[protocolType] || mealPlans.DESI_MACRO;

  // Calculate totals from meal blocks
  const calculatedTotals = useMemo(() => {
    let cal = 0;
    let prot = 0;
    let carb = 0;
    let fat = 0;
    currentMeals.forEach((block) => {
      block.items.forEach((item) => {
        cal += item.calories;
        prot += item.protein;
        carb += item.carbs;
        fat += item.fat;
      });
    });
    return { cal, prot, carb, fat };
  }, [currentMeals]);

  return (
    <TrainerPortalLayout activeItem="nutrition">
      <div className="space-y-6">
        {/* Toast Notification */}
        {actionNotice && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#050505] dark:bg-white text-white dark:text-[#050505] font-semibold text-xs shadow-2xl border border-[#FFD91C] animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#FFD91C] shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E8E5] dark:border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-wider uppercase text-text-muted">
                Dietetics & Macro Engineering
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-[11px] font-bold text-[#FFD91C] bg-[#FFD91C]/10 dark:bg-[#FFD91C]/20 px-2 py-0.5 rounded-full">
                Desi & Ramadan Protocols
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-text tracking-tight">
              Nutrition Planner & Fasting Engine
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Design tailored culturally-adapted nutrition plans, configure Ramadan intermittent fasting schedules, and calculate athlete macronutrient splits.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => notify(`Nutrition plan exported as PDF for ${selectedMember?.name}`)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-text text-xs font-bold transition-all border border-[#E8E8E5] dark:border-white/10"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF Guide</span>
            </button>
            <button
              onClick={() => notify(`Diet plan assigned to ${selectedMember?.name}'s Apollo mobile app.`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFD91C] text-[#050505] text-xs font-bold hover:brightness-105 active:scale-95 transition-all shadow-sm"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Assign Plan to Client</span>
            </button>
          </div>
        </div>

        {/* Athlete & Protocol Selector Toolbar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-[#FFD91C]/20 text-[#050505] dark:text-[#FFD91C] flex items-center justify-center font-black text-sm shrink-0">
              <Utensils className="w-5 h-5 text-[#FFD91C]" />
            </div>
            <div>
              <div className="text-xs text-text-muted">Target Client</div>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="font-bold text-sm text-text bg-transparent focus:outline-none cursor-pointer"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id} className="text-text bg-white dark:bg-[#0D0D0B]">
                    {m.name} ({m.memberCode}) — Goal: {m.fitnessGoal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Protocol Type Selector */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
            {[
              { id: "DESI_MACRO", label: "Desi Macro Optimizer", icon: Flame },
              { id: "RAMADAN_FASTING", label: "Ramadan Fasting", icon: Moon },
              { id: "HYPERTROPHY", label: "Mass Hypertrophy", icon: Zap },
              { id: "LEAN_SHRED", label: "Lean Shred (16:8)", icon: Scale },
            ].map((p) => {
              const Icon = p.icon;
              const isActive = protocolType === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setProtocolType(p.id as any);
                    notify(`Switched to ${p.label} protocol.`);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#050505] dark:bg-white text-white dark:text-[#050505] shadow-sm"
                      : "bg-[#F7F7F5] dark:bg-[#181816] text-text-muted hover:text-text border border-[#E8E8E5] dark:border-white/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Macro Energy Breakdown (4 Balanced Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col justify-between h-[136px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Daily Caloric Target
              </span>
              <span className="p-2 rounded-xl bg-[#FFD91C]/10 text-text">
                <Flame className="w-4 h-4 text-[#FFD91C]" />
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-text tracking-tight">
                {calculatedTotals.cal} kcal
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">Budgeted for optimal recovery</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col justify-between h-[136px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Protein Intake
              </span>
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Zap className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-text tracking-tight">
                {calculatedTotals.prot}g
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">2.2g per kg lean mass</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col justify-between h-[136px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Clean Carbohydrates
              </span>
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Apple className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-text tracking-tight">
                {calculatedTotals.carb}g
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">Basmati, oats, dates & roti</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 shadow-sm flex flex-col justify-between h-[136px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Essential Dietary Fats
              </span>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Scale className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-text tracking-tight">
                {calculatedTotals.fat}g
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">Almonds, yolk & olive oil</p>
            </div>
          </div>
        </div>

        {/* Meal Blocks Container */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD91C]" />
              <h3 className="text-sm font-bold text-text">Assigned Daily Meal Architecture</h3>
            </div>
            <span className="text-xs text-text-muted font-medium">
              {currentMeals.length} Scheduled Windows
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentMeals.map((meal, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#0D0D0B] border border-[#E8E8E5] dark:border-white/10 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E8E5] dark:border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#FFD91C]/20 text-text font-bold text-[10.5px]">
                        {meal.time}
                      </span>
                      <h4 className="font-bold text-text text-sm sm:text-base">{meal.title}</h4>
                    </div>
                    <p className="text-xs text-text-muted mt-1">{meal.notes}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-text-muted font-mono">
                    <span>
                      {meal.items.reduce((s, i) => s + i.calories, 0)} kcal •{" "}
                      {meal.items.reduce((s, i) => s + i.protein, 0)}g P •{" "}
                      {meal.items.reduce((s, i) => s + i.carbs, 0)}g C •{" "}
                      {meal.items.reduce((s, i) => s + i.fat, 0)}g F
                    </span>
                  </div>
                </div>

                {/* Items Table inside meal block */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E8E8E5] dark:border-white/10 text-text-muted font-semibold text-[10.5px]">
                        <th className="py-2 px-3">Food Item & Preparation</th>
                        <th className="py-2 px-3">Portion Size</th>
                        <th className="py-2 px-3">Calories</th>
                        <th className="py-2 px-3">Protein</th>
                        <th className="py-2 px-3">Carbs</th>
                        <th className="py-2 px-3">Fat</th>
                        <th className="py-2 px-3 text-right">Badge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E8E5] dark:divide-white/10">
                      {meal.items.map((item) => (
                        <tr key={item.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 font-semibold text-text">{item.name}</td>
                          <td className="py-2.5 px-3 text-text-muted">{item.portion}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-text">{item.calories}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-500">{item.protein}g</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-500">{item.carbs}g</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-500">{item.fat}g</td>
                          <td className="py-2.5 px-3 text-right">
                            {item.desiOptimized ? (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFD91C]/15 text-text font-bold text-[10px] border border-[#FFD91C]/30">
                                Desi Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-text-muted text-[10px]">
                                Standard
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Culture & Fasting Advisory Note */}
        <div className="p-4 rounded-2xl bg-[#FFD91C]/10 border border-[#FFD91C]/30 flex items-start gap-3 text-xs">
          <Sparkles className="w-5 h-5 text-text shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-extrabold text-text">
              Coach Advisory: Cultural Nutrition Compliance
            </div>
            <p className="text-text-muted leading-relaxed">
              All recipes are adapted for Pakistani dining habits (Karahi, Biryani, Roti, Daal) by utilizing zero-ghee spray, lean breast/fillet cuts, and whole-wheat dry rotis. For Ramadan fasting protocols, fluid retention is protected via Himalayan pink salt and electrolyte mineral replenishment at Suhoor.
            </p>
          </div>
        </div>
      </div>
    </TrainerPortalLayout>
  );
}
