import React from 'react';
import { ArrowRight, Apple, Camera, Barcode, CheckCircle2, Eye, ShieldAlert, Sparkles } from 'lucide-react';

interface BrandHeroProps {
  onSelectSkin: (mode?: 'diagnosis' | 'inspection') => void;
  onSelectFood: () => void;
  onOpenBarcode: () => void;
}

export const BrandHero: React.FC<BrandHeroProps> = ({
  onSelectSkin,
  onSelectFood,
  onOpenBarcode,
}) => {
  return (
    <div className="relative overflow-hidden py-10 sm:py-16 bg-neutral-50/50">
      {/* Decorative ambient subtle cherry glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-100/40 via-rose-50/20 to-transparent pointer-events-none rounded-3xl blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Brand Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold tracking-wide uppercase mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            AI Toxicologist & Ingredient Intelligence
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-700 via-rose-600 to-rose-800 flex items-center justify-center text-white shadow-lg shadow-rose-700/20">
              <Eye className="w-7 h-7" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Derma<span className="text-rose-600">Lens</span>
            </h1>
          </div>

          <p className="text-xl sm:text-2xl font-serif italic text-rose-800 font-semibold tracking-wide mb-3">
            — Look Beyond the Label
          </p>

          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate deceptive greenwashed claims. Uncover pore-clogging comedogenics, endocrine disruptors, allergens, and inflammatory food additives with instant <span className="text-rose-700 font-bold underline decoration-rose-400">RED-flagged</span> ingredient identification and certified clean alternatives.
          </p>

          {/* In-Store Barcode Quick Banner */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-2 bg-white border border-rose-200/80 rounded-2xl shadow-sm shadow-rose-900/5">
            <div className="flex items-center gap-2 text-xs text-neutral-700 px-3 py-1 font-medium">
              <Barcode className="w-4 h-4 text-rose-600" />
              <span>Shopping in-store right now?</span>
            </div>
            <button
              onClick={onOpenBarcode}
              className="px-4 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              Open In-Store Barcode Scanner
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* TWO PRIMARY COLUMNS: WHITE CARDS WITH CHERRY RED ACCENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* COLUMN 1: SKIN INGREDIENTS INSPECTION */}
          <div className="relative group rounded-3xl bg-white border border-rose-100 hover:border-rose-300 p-8 shadow-md hover:shadow-xl shadow-rose-900/5 transition-all duration-300 flex flex-col justify-between">
            {/* Top Header */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                  Cosmetic & Skincare
                </span>
              </div>

              <h2 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-rose-700 transition-colors">
                Skin Ingredients Inspection & Diagnosis
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                Audit every serum, cleanser, or cream. Highlight in <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">RED</span> all pore-clogging comedogenics, essential oil sensitizers, sulfates, and toxic fragrance allergens. 
                Perform a holistic <strong>camera skin scan</strong> paired with dietary cross-analysis to cure stubborn breakouts.
              </p>

              {/* Feature bullets */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-neutral-900 font-bold">Red Flag Alert:</strong> Comedogenic (ratings 3-5), fragrance allergens, and barrier-stripping sulfates.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-neutral-900 font-bold">Holistic Skin Scan & Diet Quiz:</strong> Pinpoint exact food and product triggers behind cystic acne or broken barriers.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-neutral-900 font-bold">Cleaner Brand Alternatives:</strong> Swap harsh brands (like Mamaearth) with certified hypoallergenic replacements with purchase links.
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 border-t border-rose-100">
              <button
                onClick={() => onSelectSkin('inspection')}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-rose-50 text-neutral-800 font-semibold text-xs transition border border-rose-200 flex items-center justify-center gap-2 group/btn"
              >
                Inspect Skincare Item
                <ArrowRight className="w-3.5 h-3.5 text-rose-600 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onSelectSkin('diagnosis')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-800 hover:to-rose-700 text-white font-bold text-xs transition shadow-md shadow-rose-900/15 flex items-center justify-center gap-2 active:scale-95"
              >
                <Camera className="w-4 h-4" />
                Skin Diagnosis & Diet
              </button>
            </div>
          </div>

          {/* COLUMN 2: FOOD INGREDIENTS INSPECTION */}
          <div className="relative group rounded-3xl bg-white border border-rose-100 hover:border-rose-300 p-8 shadow-md hover:shadow-xl shadow-rose-900/5 transition-all duration-300 flex flex-col justify-between">
            {/* Top Header */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shadow-xs">
                  <Apple className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                  Nutritional & Packaged Foods
                </span>
              </div>

              <h2 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-rose-700 transition-colors">
                Food Ingredients Inspection
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                Snap or upload ingredient labels on packaged foods and snacks. AI detects hidden sugars, artificial dyes, MSG, and endocrine disruptors. 
                Pinpoints real risks: <span className="text-rose-700 font-semibold">acne breakouts, hormonal disruption, cholesterol, and long-term skin sensitivity</span>.
              </p>

              {/* Feature bullets */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-neutral-900 font-bold">Forensic Health Impact:</strong> Directly connects food additives to breakouts, cholesterol, and endocrine strain.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-neutral-900 font-bold">Red Ingredient Highlighting:</strong> BHT, Red 40, Yellow 5, hydrogenated trans fats, and hidden chemical numbers.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-neutral-900 font-bold">Whole-Food Clean Swaps:</strong> Healthier, minimally processed alternatives available for direct purchase.
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-5 border-t border-rose-100">
              <button
                onClick={onSelectFood}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-800 hover:to-rose-700 text-white font-bold text-sm transition shadow-md shadow-rose-900/20 flex items-center justify-center gap-2 active:scale-95 group/btn"
              >
                <Apple className="w-4 h-4" />
                Inspect Food Ingredients & Health Impact
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
