import React from 'react';
import { UserProfile, ExposureMetric } from '../types';
import { Activity, ShieldCheck, Flame, Droplets, HeartPulse, TrendingDown, Sparkles, AlertTriangle } from 'lucide-react';

interface ExposureDashboardProps {
  user: UserProfile;
  exposureHistory: ExposureMetric[];
  onNavigateToInspect: (type: 'skin' | 'food') => void;
}

export const ExposureDashboard: React.FC<ExposureDashboardProps> = ({
  user,
  exposureHistory,
  onNavigateToInspect,
}) => {
  // Compute aggregated statistics
  const totalAvoided = exposureHistory.reduce((acc, curr) => acc + curr.irritantsAvoided, 0) || 24;
  const cleanSwapsDone = exposureHistory.reduce((acc, curr) => acc + curr.cleanSwapsCount, 0) || 7;
  const averageToxinScore = exposureHistory.length
    ? Math.round(exposureHistory.reduce((acc, curr) => acc + curr.toxinScore, 0) / exposureHistory.length)
    : 28; // lower is better

  // Mock weekly exposure data points for graph
  const timelineWeeks = [
    { week: 'Week 1', exposureScore: 84, cleanPercent: 25 },
    { week: 'Week 2', exposureScore: 68, cleanPercent: 45 },
    { week: 'Week 3', exposureScore: 52, cleanPercent: 65 },
    { week: 'Week 4 (Current)', exposureScore: 28, cleanPercent: 88 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Dashboard Header in White with Cherry Red Styling */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            Personal Exposure Level Telemetry
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
            {user.name}'s Clean Exposure Dashboard
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl">
            Tracking toxic burden, pore-clogging comedogenics, endocrine disruptors, and inflammatory food additives avoided over time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToInspect('skin')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Audit Skincare
          </button>
          <button
            onClick={() => onNavigateToInspect('food')}
            className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Audit Food Item
          </button>
        </div>
      </div>

      {/* Exposure Metrics 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Current Toxic Exposure Index */}
        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Toxic Burden Index
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-700">{averageToxinScore}</span>
            <span className="text-xs text-neutral-400 font-semibold">/ 100 Low Risk</span>
          </div>
          <p className="text-[11px] text-rose-800 font-medium mt-2 flex items-center gap-1">
            <span>↓ 56% lower</span> than typical consumer baseline
          </p>
        </div>

        {/* Metric 2: Red Flag Toxins Avoided */}
        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Red-Flags Avoided
            </span>
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-neutral-900">{totalAvoided}</span>
            <span className="text-xs text-neutral-400 font-semibold">Chemicals</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Includes fragrance allergens & BHT preservatives
          </p>
        </div>

        {/* Metric 3: Clean Swaps Executed */}
        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Clean Swaps Enacted
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-neutral-900">{cleanSwapsDone}</span>
            <span className="text-xs text-neutral-400 font-semibold">Products</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Replaced with certified hypoallergenic alternatives
          </p>
        </div>

        {/* Metric 4: Lipid Barrier Recovery */}
        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Skin Barrier Index
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-700">89%</span>
            <span className="text-xs text-neutral-400 font-semibold">Resilience</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Erythema & micro-inflammation reducing
          </p>
        </div>
      </div>

      {/* Visual Timeline of Personal Exposure Levels Over Time */}
      <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              Exposure Levels Over Time (Weekly Reduction Trend)
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Visualizes the drop in daily chemical exposure as toxic items are removed from diet and routine.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Progress Tracking Active
          </span>
        </div>

        {/* Custom Bar Visualization with Cherry Red Palette */}
        <div className="space-y-4 pt-2">
          {timelineWeeks.map((w, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800">{w.week}</span>
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500 text-[11px]">
                    Toxic Exposure: <strong className="text-rose-700 font-bold">{w.exposureScore} pts</strong>
                  </span>
                  <span className="text-neutral-500 text-[11px]">
                    Clean Rating: <strong className="text-emerald-700 font-bold">{w.cleanPercent}%</strong>
                  </span>
                </div>
              </div>

              {/* Stacked Progress Bar */}
              <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden flex border border-neutral-200">
                <div
                  style={{ width: `${w.cleanPercent}%` }}
                  className="bg-gradient-to-r from-rose-700 to-rose-500 transition-all duration-700"
                  title="Clean Ingredients Ratio"
                ></div>
                <div
                  style={{ width: `${100 - w.cleanPercent}%` }}
                  className="bg-neutral-200 transition-all duration-700"
                  title="Toxic Exposure Burden"
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between text-[11px] text-neutral-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>Clean Whole-Food & Hypoallergenic Products</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
            <span>Flagged Comedogenic & Toxic Exposure Burden</span>
          </div>
        </div>
      </div>

      {/* Detailed Specific Exposure Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <Flame className="w-4 h-4" />
            <span>Fragrance & Sensitizers</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">14 Compounds</p>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Eliminated limonene, linalool, and undisclosed synthetic parfum that cause contact dermatitis and barrier redness.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <HeartPulse className="w-4 h-4" />
            <span>Endocrine & Hormone Disruptors</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">8 Preservatives</p>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Avoided BHT in packaging, propylparabens, and synthetic phthalates linked to hormonal acne and estrogenic disruption.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <Droplets className="w-4 h-4" />
            <span>Trans Fats & Emulsifiers</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">35g Inflammatory Oils</p>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Swapped hydrogenated palm oils and polysorbate emulsifiers for clean cold-pressed olive & avocado oils.
          </p>
        </div>
      </div>
    </div>
  );
};
