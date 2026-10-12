import React, { useState } from 'react';
import { UserProfile, FoodAnalysisResult } from '../types';
import { CameraCaptureModal } from './CameraCaptureModal';
import {
  Apple,
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Flame,
  HeartPulse,
  Droplets,
  ExternalLink,
  ShoppingCart,
  XCircle,
  Activity,
  ChevronDown,
  ChevronUp,
  Search,
  AlertTriangle
} from 'lucide-react';

interface FoodInspectionHubProps {
  user: UserProfile;
  onAnalysisComplete: (result: any, type: 'food') => void;
}

export const FoodInspectionHub: React.FC<FoodInspectionHubProps> = ({
  user,
  onAnalysisComplete,
}) => {
  const [productBrand, setProductBrand] = useState('Kellogg\'s');
  const [productName, setProductName] = useState('Frosted Breakfast Puffs with Chocolate');
  const [ingredientsText, setIngredientsText] = useState(
    'Milled Corn, Sugar, High Fructose Corn Syrup, Partially Hydrogenated Palm Kernel Oil, Cocoa Processed with Alkali, Salt, Artificial Flavor, BHT (added to packaging to preserve freshness), Red 40, Yellow 5, Blue 1, Soy Lecithin'
  );
  const [foodImage, setFoodImage] = useState<string | null>(null);
  const [showOptionalIngredients, setShowOptionalIngredients] = useState(false);
  const [dietaryGoals, setDietaryGoals] = useState(
    user.dietaryPreference || 'Clean Whole Food / Anti-inflammatory / Hormone Balance'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [missingIngredientsWarning, setMissingIngredientsWarning] = useState(false);
  const [copiedGoogleHelp, setCopiedGoogleHelp] = useState(false);

  const handleSearchGoogleForIngredients = () => {
    const query = `${productBrand ? productBrand + ' ' : ''}${productName || 'food product'} ingredients list nutrition facts`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
    setCopiedGoogleHelp(true);
    setTimeout(() => setCopiedGoogleHelp(false), 9000);
  };

  const detectedIngredientCount = ingredientsText
    ? ingredientsText.split(/[,;\n]+/).map((s) => s.trim()).filter((s) => s.length > 1).length
    : 0;

  const handleAnalyzeFood = async () => {
    if (!ingredientsText.trim() && !foodImage) {
      setMissingIngredientsWarning(true);
      return;
    }
    setMissingIngredientsWarning(false);
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-food-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          brand: productBrand,
          ingredientsText: ingredientsText.trim(),
          imageBase64: foodImage,
          dietaryPreferences: dietaryGoals,
        }),
      });
      const data = await response.json();
      if (data.error === 'INGREDIENTS_OR_PHOTO_REQUIRED') {
        setMissingIngredientsWarning(true);
        return;
      }
      const enrichedResult = { ...data, scannedAt: new Date().toISOString() };
      setResult(enrichedResult);
      onAnalysisComplete(enrichedResult, 'food');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPreset = (preset: string) => {
    if (preset === 'cereal') {
      setProductBrand('Kellogg\'s');
      setProductName('Frosted Flakes Cereal');
      setIngredientsText(
        'Milled Corn, Sugar, High Fructose Corn Syrup, Partially Hydrogenated Palm Kernel Oil, Cocoa, Salt, Artificial Flavor, BHT Preservative, Red 40, Yellow 5, Blue 1'
      );
      setFoodImage(null);
    } else if (preset === 'energy-drink') {
      setProductBrand('Monster / Red Bull');
      setProductName('Mega Energy Blast Citrus Punch');
      setIngredientsText(
        'Carbonated Water, High Fructose Corn Syrup, Citric Acid, Taurine, Sodium Benzoate, Potassium Sorbate, Sucralose, Acesulfame Potassium, Yellow 5, Red 40, Artificial Flavor'
      );
      setFoodImage(null);
    } else if (preset === 'clean-bar') {
      setProductBrand('RXBAR');
      setProductName('Organic Almond & Date Whole Food Bar');
      setIngredientsText(
        'Organic Medjool Dates, Organic Raw Almonds, Organic Unsweetened Apples, Organic Ceylon Cinnamon, Pink Himalayan Sea Salt'
      );
      setFoodImage(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <Apple className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-neutral-900">Food Ingredients Inspection</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold uppercase tracking-wider">
                  Health & Skin Impact
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Scan packaged food or beverages to identify hidden toxins, trans fats, hormonal disruptors, and cholesterol stressors.
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400 font-medium">Quick Test:</span>
            <button
              onClick={() => loadPreset('cereal')}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-rose-50 text-neutral-700 text-xs border border-neutral-200 hover:border-rose-200 transition"
            >
              Sugary Cereal
            </button>
            <button
              onClick={() => loadPreset('energy-drink')}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-rose-50 text-neutral-700 text-xs border border-neutral-200 hover:border-rose-200 transition"
            >
              Energy Drink
            </button>
            <button
              onClick={() => loadPreset('clean-bar')}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-rose-50 text-neutral-700 text-xs border border-neutral-200 hover:border-rose-200 transition"
            >
              Whole Food Bar
            </button>
          </div>
        </div>

        {/* Information Notice: Ingredients list or photo is mandatory */}
        <div className={`mb-6 p-4 rounded-2xl border transition ${
          missingIngredientsWarning
            ? 'bg-rose-100/90 border-2 border-rose-600 shadow-md animate-bounce'
            : 'bg-rose-50/70 border-rose-200/80'
        }`}>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-rose-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              !
            </span>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-xs text-rose-950 font-bold uppercase tracking-wide">
                  Ingredients List or Nutrition Label Photo Required *
                </strong>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-800 font-bold">
                  Forensic Health & Skin Scan
                </span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed">
                To detect hidden high-fructose syrups, trans fats, emulsifiers, and carcinogenic artificial dyes, please provide either:
                <span className="font-semibold"> (1) A photo of the nutrition label</span>, OR <span className="font-semibold">(2) Copy-paste the ingredients list</span> from Google or the grocery store.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSearchGoogleForIngredients}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Search className="w-3.5 h-3.5 text-rose-600" />
                  Search Google for {productBrand} {productName || 'Food Item'} Ingredients
                  <ExternalLink className="w-3 h-3 text-rose-400" />
                </button>
                {copiedGoogleHelp && (
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ✓ Google search opened in new tab. Copy ingredients and paste below!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Food / Grocery Brand <span className="text-rose-600 font-bold">*</span>
              </label>
              <input
                type="text"
                value={productBrand}
                onChange={(e) => {
                  setProductBrand(e.target.value);
                  setMissingIngredientsWarning(false);
                }}
                placeholder="e.g. Kellogg's, Nestlé, PepsiCo, Lay's, Oreo..."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 transition"
              />
              {/* Quick Brand Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-neutral-400 font-medium">Popular Brands:</span>
                {['Kellogg\'s', 'Nestlé', 'Lay\'s', 'Coca-Cola', 'Oreo', 'Ferrero / Nutella', 'Kraft Heinz'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setProductBrand(b);
                      setMissingIngredientsWarning(false);
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                      productBrand === b
                        ? 'bg-rose-700 text-white border-rose-700 font-bold'
                        : 'bg-neutral-100 hover:bg-rose-50 text-neutral-600 border-neutral-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Food / Beverage Product Name <span className="text-rose-600 font-bold">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  setMissingIngredientsWarning(false);
                }}
                placeholder="e.g. Frosted Breakfast Flakes, Doritos Nacho Cheese, Nutella Spread..."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 transition"
              />
              <p className="text-[10px] text-neutral-400 mt-2">
                Identifies product to verify authentic nutritional formulation.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Your Dietary Focus & Health Concerns
              </label>
              <span className="text-[10px] text-neutral-400 font-medium">(Optional)</span>
            </div>
            <input
              type="text"
              value={dietaryGoals}
              onChange={(e) => setDietaryGoals(e.target.value)}
              placeholder="e.g. Avoid hormonal acne, lower bad LDL cholesterol, gut barrier repair..."
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:bg-white focus:border-rose-600 transition"
            />
          </div>

          {/* MANDATORY INGREDIENTS SECTION */}
          <div className={`rounded-2xl border-2 p-5 transition space-y-4 ${
            missingIngredientsWarning
              ? 'border-rose-600 bg-rose-50/40 shadow-md'
              : (!ingredientsText.trim() && !foodImage)
              ? 'border-amber-300 bg-amber-50/20'
              : 'border-rose-200 bg-neutral-50/40'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-rose-700 text-white text-[10px] font-extrabold uppercase tracking-wider">
                    Mandatory
                  </span>
                  <h4 className="text-sm font-bold text-neutral-900">
                    Provide Nutrition Ingredients or Packaging Photo *
                  </h4>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  DermaLens analyzes <strong>every single food additive & nutrient</strong>. One option is required to proceed.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {detectedIngredientCount > 0 && (
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1">
                    <span>✓</span>
                    <span>{detectedIngredientCount} Ingredients Detected</span>
                  </span>
                )}
                {foodImage && (
                  <span className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold flex items-center gap-1">
                    <span>📷</span>
                    <span>Label Attached</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Option 1: Paste Text */}
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    Option 1: Paste Nutrition Label Ingredients Text
                  </label>
                  <button
                    type="button"
                    onClick={handleSearchGoogleForIngredients}
                    className="text-[11px] text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 underline decoration-rose-300"
                    title="Search Google in new tab"
                  >
                    <Search className="w-3 h-3" />
                    Search Google
                  </button>
                </div>

                <textarea
                  rows={5}
                  value={ingredientsText}
                  onChange={(e) => {
                    setIngredientsText(e.target.value);
                    setMissingIngredientsWarning(false);
                  }}
                  placeholder="Paste the ingredients list from the food packaging (e.g. Milled Corn, Sugar, High Fructose Corn Syrup, Palm Oil, Red 40, BHT...)..."
                  className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 font-mono transition"
                />

                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Separate ingredients by commas or new lines.</span>
                  <button
                    type="button"
                    onClick={handleSearchGoogleForIngredients}
                    className="text-rose-700 hover:underline font-semibold"
                  >
                    Don't have the label? Google it in 1-click →
                  </button>
                </div>
              </div>

              {/* Option 2: Image Upload */}
              <div className="lg:col-span-5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800">
                    Option 2: Photo of Nutrition Label
                  </label>
                  <span className="text-[10px] text-neutral-400">Back of box / bag</span>
                </div>

                {foodImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-rose-300 bg-neutral-100 h-36 flex items-center justify-center">
                    <img src={foodImage} alt="Food label" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setFoodImage(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-neutral-900/80 hover:bg-rose-600 text-white transition"
                      title="Remove photo"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-2xl p-4 text-center bg-white transition flex flex-col items-center justify-center h-36">
                    <div className="p-2 rounded-full bg-rose-50 text-rose-700 mb-1.5">
                      <Camera className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-neutral-800 font-semibold mb-0.5">
                      Snap or Upload Nutrition Label
                    </p>
                    <p className="text-[10px] text-neutral-400 mb-2">
                      AI scans ingredients and chemical additives
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCameraOpen(true);
                          setMissingIngredientsWarning(false);
                        }}
                        className="px-3 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 text-xs font-semibold transition flex items-center gap-1"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Live Camera
                      </button>
                      <label className="cursor-pointer px-3 py-1 rounded-lg bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold transition border border-neutral-200">
                        Upload File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const r = new FileReader();
                              r.onload = () => {
                                setFoodImage(r.result as string);
                                setMissingIngredientsWarning(false);
                              };
                              r.readAsDataURL(f);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAnalyzeFood}
            disabled={isAnalyzing || !productName.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-98 ${
              !ingredientsText.trim() && !foodImage
                ? 'bg-neutral-800 hover:bg-rose-700 text-white'
                : 'bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-800 hover:to-rose-700 text-white shadow-rose-900/20'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Forensic Food Toxicity Scan for {productBrand} {productName}...
              </>
            ) : !ingredientsText.trim() && !foodImage ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Provide Ingredients List or Photo to Scan & Trace Health Problems
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Scan All Ingredients for {productBrand ? `${productBrand} ` : ''}{productName || 'Food Item'} & Trace Health Problems
              </>
            )}
          </button>
        </div>
      </div>

      {/* ANALYSIS RESULTS */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          {/* Health Score Overview */}
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-rose-100">
              <div>
                <span className="text-xs uppercase font-bold text-rose-700 tracking-wider">
                  {result.brand || 'Packaged Grocery'} • {result.foodCategory || 'Snack'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                  {result.productName}
                </h3>
                <p className="text-xs text-neutral-600 mt-2 max-w-2xl leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Health Score Meter */}
              <div className="flex items-center gap-4 bg-rose-50/50 p-4 rounded-2xl border border-rose-100 shrink-0">
                <div
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-xl border ${
                    result.healthScore >= 75
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : result.healthScore >= 45
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-rose-100 text-rose-800 border-rose-300 glow-cherry'
                  }`}
                >
                  <span>{result.healthScore}</span>
                  <span className="text-[9px] font-bold text-neutral-400 tracking-wider">/ 100</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                    Clean Food Score
                  </span>
                  <span
                    className={`text-sm font-extrabold ${
                      result.healthScore >= 75
                        ? 'text-emerald-700'
                        : result.healthScore >= 45
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {result.safetyRatingLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* RED-HIGHLIGHTED INGREDIENTS */}
            <div className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  Flagged Problematic Food Compounds (Highlighted in Red)
                </h4>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {result.problematicIngredientsHighlightedRed?.map((flag, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-900 border-2 border-rose-600 text-xs font-bold shadow-xs flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                    {flag}
                  </span>
                ))}
              </div>

              {/* Allergen Warnings */}
              {result.allergenWarnings && result.allergenWarnings.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-6">
                  <span className="text-xs font-bold text-amber-800 block mb-1">
                    Hidden Allergens & Sensitivities:
                  </span>
                  <ul className="space-y-1 text-xs text-amber-900">
                    {result.allergenWarnings.map((al, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {al}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* HEALTH & SKIN PROBLEMS CAUSED BY THIS PRODUCT */}
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <h4 className="text-xl font-bold text-neutral-900">
                Health & Skin Consequences Triggered by This Product
              </h4>
            </div>
            <p className="text-xs text-neutral-500 mb-6">
              Forensic assessment of how these specific chemical additives, trans fats, and sweeteners trigger systemic and cutaneous disorders.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.potentialHealthAndSkinProblems?.map((prob, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-rose-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                        {prob.category === 'Acne & Skin Breakouts' && <Flame className="w-4 h-4 text-orange-600" />}
                        {prob.category === 'Hormonal Disruption' && <HeartPulse className="w-4 h-4 text-rose-600" />}
                        {prob.category === 'Cholesterol & Heart' && <Activity className="w-4 h-4 text-rose-700" />}
                        {prob.category === 'Gut & Skin Sensitivity' && <Droplets className="w-4 h-4 text-blue-600" />}
                        {prob.category}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          prob.severity === 'High'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {prob.severity} Risk
                      </span>
                    </div>

                    {/* Culprits in this category */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {prob.culpritCompounds?.map((c, ci) => (
                        <span
                          key={ci}
                          className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-900 border border-rose-300"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                      {prob.explanation}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 text-xs text-rose-800">
                    <span className="font-bold text-neutral-500 block mb-0.5 text-[10px] uppercase">
                      Recommended Smart Action:
                    </span>
                    {prob.cleanSwapSuggestion}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HEALTHIER WHOLE-FOOD CLEAN ALTERNATIVES WITH DIRECT PURCHASE LINKS */}
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-700" />
                  <h4 className="text-xl font-bold text-neutral-900">
                    Healthier Whole-Food Alternatives Available for Purchase
                  </h4>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Guiding smarter, cleaner consumer choices without artificial additives, trans fats, or chemical dyes.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                100% Clean Food Swaps
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.cleanerWholeFoodAlternatives?.map((alt, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-50 rounded-2xl border border-neutral-200 hover:border-rose-300 p-5 flex flex-col justify-between transition group hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                        {alt.brand}
                      </span>
                      <span className="text-[10px] font-bold text-rose-900 px-2 py-0.5 rounded-lg bg-rose-100">
                        Whole-Food Certified
                      </span>
                    </div>
                    <h5 className="font-bold text-neutral-900 text-base group-hover:text-rose-700 transition mb-2">
                      {alt.name}
                    </h5>
                    <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                      {alt.whyItIsBetter}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {alt.cleanAttributes?.map((attr, ai) => (
                        <span
                          key={ai}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white text-neutral-700 border border-neutral-200"
                        >
                          {attr}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                    {alt.priceEstimate && (
                      <span className="text-xs font-bold text-neutral-800">{alt.priceEstimate}</span>
                    )}
                    <a
                      href={alt.purchaseLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Direct Purchase Link
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        guideMode="label"
        title="Nutrition Label Scanner"
        subtitle="Align printed nutrition facts & ingredient list in frame"
        onCapture={(base64) => setFoodImage(base64)}
      />
    </div>
  );
};
