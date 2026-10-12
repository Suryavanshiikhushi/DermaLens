import React, { useState } from 'react';
import { UserProfile, SkinAnalysisResult, HolisticDiagnosisResult, TARGET_SKIN_TYPES } from '../types';
import { CameraCaptureModal } from './CameraCaptureModal';
import {
  Sparkles,
  Camera,
  Search,
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShoppingCart,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  HeartPulse,
  Droplets,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface SkinInspectionHubProps {
  user: UserProfile;
  initialSubTab?: 'inspection' | 'diagnosis';
  onAnalysisComplete: (result: any, type: 'skin') => void;
}

export const SkinInspectionHub: React.FC<SkinInspectionHubProps> = ({
  user,
  initialSubTab = 'inspection',
  onAnalysisComplete,
}) => {
  const [subTab, setSubTab] = useState<'inspection' | 'diagnosis'>(initialSubTab);

  // --- ITEM INSPECTION STATE ---
  const [productBrand, setProductBrand] = useState('Mamaearth');
  const [productName, setProductName] = useState('Tea Tree Face Wash');
  const [ingredientsText, setIngredientsText] = useState(
    'Aqua, Sodium Lauroyl Sarcosinate, Disodium Cocoamphodiacetate, Glycerin, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Azadirachta Indica (Neem) Leaf Extract, Salicylic Acid, Allantoin, D-Panthenol, Parfum (Fragrance), Limonene, Linalool, Phenoxyethanol, Ethylhexylglycerin'
  );
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [showOptionalItemIngredients, setShowOptionalItemIngredients] = useState(false);
  const [itemSkinType, setItemSkinType] = useState(user.skinType || 'Sensitive / Broken Barrier');
  const [itemConcerns, setItemConcerns] = useState('Active breakouts, barrier redness, sensitivity to fragrance');
  const [isItemAnalyzing, setIsItemAnalyzing] = useState(false);
  const [itemResult, setItemResult] = useState<SkinAnalysisResult | null>(null);
  const [missingIngredientsWarning, setMissingIngredientsWarning] = useState(false);
  const [copiedGoogleHelp, setCopiedGoogleHelp] = useState(false);

  // Helper to open Google search for ingredients
  const handleSearchGoogleForIngredients = () => {
    const query = `${productBrand ? productBrand + ' ' : ''}${productName || 'cosmetic product'} ingredients list`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
    setCopiedGoogleHelp(true);
    setTimeout(() => setCopiedGoogleHelp(false), 9000);
  };

  // Live count of ingredients entered
  const detectedIngredientCount = ingredientsText
    ? ingredientsText.split(/[,;\n]+/).map((s) => s.trim()).filter((s) => s.length > 1).length
    : 0;

  // --- SKIN DIAGNOSIS STATE ---
  const [diagStep, setDiagStep] = useState<1 | 2 | 3 | 4>(1); // 1: Camera Scan, 2: Dietary Quiz, 3: Current Products, 4: Results
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [diagSkinType, setDiagSkinType] = useState<string>(user.skinType || '');
  const [selectedProblems, setSelectedProblems] = useState<string[]>([
    'Deep cystic acne along jawline & chin',
    'Facial burning, redness & damaged moisture barrier',
  ]);
  const [dietQuiz, setDietQuiz] = useState({
    dairyFrequency: 'Daily (Milk in coffee, whey protein, cheese)',
    sugarFrequency: 'High (Sweet snacks, desserts, soda, refined carbs)',
    friedFoodFrequency: '2-4 times a week (Vegetable seed oils)',
    waterIntakeLiters: 'Under 1.5 Liters / day',
    gutHealthIssues: 'Frequent bloating & slow digestion',
  });
  const [currentRoutineProducts, setCurrentRoutineProducts] = useState<Array<{ name: string; brand: string; ingredients?: string }>>([
    {
      name: 'Tea Tree Face Wash with Neem & Salicylic Acid',
      brand: 'Mamaearth',
      ingredients: 'Aqua, Sodium Lauroyl Sarcosinate, Glycerin, Tea Tree Leaf Oil, Fragrance/Parfum, Limonene, Linalool',
    },
    {
      name: 'Walnut Exfoliating Facial Scrub',
      brand: 'St. Ives',
      ingredients: '', // Ingredients optional: DermaLens AI auto-resolves standard formulation
    },
    {
      name: 'Heavy Fragranced Night Moisturizer',
      brand: 'Botanical Bloom',
      ingredients: '', // Ingredients optional: DermaLens AI auto-resolves standard formulation
    }
  ]);
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdName, setNewProdName] = useState('');
  const [newProdIngredients, setNewProdIngredients] = useState('');
  const [showOptionalRoutineIngredients, setShowOptionalRoutineIngredients] = useState(false);
  const [isDiagAnalyzing, setIsDiagAnalyzing] = useState(false);
  const [diagResult, setDiagResult] = useState<HolisticDiagnosisResult | null>(null);

  // Camera modal control
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraGuideMode, setCameraGuideMode] = useState<'face' | 'label'>('label');

  // Handle Item Inspection
  const handleAnalyzeItem = async () => {
    // Mandate either ingredients list or photo
    if (!ingredientsText.trim() && !itemImage) {
      setMissingIngredientsWarning(true);
      return;
    }
    setMissingIngredientsWarning(false);
    setIsItemAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-skin-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          brand: productBrand,
          ingredientsText: ingredientsText.trim(),
          imageBase64: itemImage,
          userSkinType: itemSkinType,
          concerns: itemConcerns,
        }),
      });
      const data = await response.json();
      if (data.error === 'INGREDIENTS_OR_PHOTO_REQUIRED') {
        setMissingIngredientsWarning(true);
        return;
      }
      const enrichedResult = { ...data, scannedAt: new Date().toISOString() };
      setItemResult(enrichedResult);
      onAnalysisComplete(enrichedResult, 'skin');
    } catch (err) {
      console.error(err);
    } finally {
      setIsItemAnalyzing(false);
    }
  };

  // Preset loader for Item Inspection
  const loadPreset = (presetName: string) => {
    if (presetName === 'mamaearth') {
      setProductBrand('Mamaearth');
      setProductName('Tea Tree Face Wash');
      setIngredientsText('Aqua, Sodium Lauroyl Sarcosinate, Disodium Cocoamphodiacetate, Glycerin, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Salicylic Acid, Allantoin, Parfum (Synthetic Fragrance), Limonene, Linalool, Phenoxyethanol');
      setItemImage(null);
    } else if (presetName === 'harsh-scrub') {
      setProductBrand('St. Ives');
      setProductName('Botanical Apricot & Walnut Shell Scrub');
      setIngredientsText('Aqua, Juglans Regia (Walnut) Shell Powder, Glyceryl Stearate, Isopropyl Myristate, Sodium Laureth Sulfate (SLES), Fragrance (Parfum), DMDM Hydantoin, Methylparaben');
      setItemImage(null);
    } else if (presetName === 'clean-cleanser') {
      setProductBrand('CeraVe');
      setProductName('Hydrating Cleanser');
      setIngredientsText('Aqua, Glycerin, Cetearyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Hyaluronic Acid, Xanthan Gum, Phenoxyethanol');
      setItemImage(null);
    }
  };

  // Add Product to Routine in Diagnosis
  const handleAddProduct = () => {
    if (!newProdName.trim()) return;
    const resolvedBrand = newProdBrand.trim() || 'Skincare Brand';
    setCurrentRoutineProducts([
      ...currentRoutineProducts,
      {
        name: newProdName.trim(),
        brand: resolvedBrand,
        ingredients: newProdIngredients.trim() || '',
      },
    ]);
    setNewProdName('');
    setNewProdBrand('');
    setNewProdIngredients('');
    setShowOptionalRoutineIngredients(false);
  };

  const handleAddQuickProduct = (brand: string, name: string) => {
    setCurrentRoutineProducts([
      ...currentRoutineProducts,
      {
        name,
        brand,
        ingredients: '',
      },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    setCurrentRoutineProducts(currentRoutineProducts.filter((_, i) => i !== index));
  };

  // Run Holistic Diagnosis
  const handleRunDiagnosis = async () => {
    setIsDiagAnalyzing(true);
    try {
      const response = await fetch('/api/skin-diagnosis-holistic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selfieBase64: selfieImage,
          userSkinType: diagSkinType,
          skinSymptoms: selectedProblems,
          currentProducts: currentRoutineProducts,
          dietaryHabits: dietQuiz,
        }),
      });
      const data = await response.json();
      const enriched = { ...data, scannedAt: new Date().toISOString() };
      setDiagResult(enriched);
      setDiagStep(4);
      onAnalysisComplete(enriched, 'skin');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Navigation Sub-Tabs: Item Inspection vs Skin Diagnosis */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-3.5 rounded-2xl border border-rose-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
            <Sparkles className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h2 className="font-bold text-neutral-900 text-lg">Skin Ingredients Intelligence</h2>
            <p className="text-xs text-neutral-500">Forensic chemical inspection & holistic cross-analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-2 p-1 bg-rose-50/60 rounded-xl border border-rose-200 w-full sm:w-auto">
          <button
            onClick={() => setSubTab('inspection')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              subTab === 'inspection'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Item / Product Inspection
          </button>
          <button
            onClick={() => setSubTab('diagnosis')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              subTab === 'diagnosis'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Skin Diagnosis & Diet Quiz
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 1. SINGLE ITEM / PRODUCT INSPECTION VIEW                   */}
      {/* ========================================================== */}
      {subTab === 'inspection' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Input Card */}
          <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                  <span>Deep Cosmetic Ingredient Inspection</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                    RED Flagging Engine
                  </span>
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Upload packaging photo or type product ingredients to flag pore-clogging chemicals, allergens, and see hypoallergenic clean swaps.
                </p>
              </div>

              {/* Sample Quick Presets */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400 font-medium">Quick Test:</span>
                <button
                  type="button"
                  onClick={() => loadPreset('mamaearth')}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-rose-50 text-neutral-700 text-xs border border-neutral-200 hover:border-rose-200 transition"
                >
                  Mamaearth Face Wash
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('harsh-scrub')}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-rose-50 text-neutral-700 text-xs border border-neutral-200 hover:border-rose-200 transition"
                >
                  Harsh Walnut Scrub
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('clean-cleanser')}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-rose-50 text-neutral-700 text-xs border border-neutral-200 hover:border-rose-200 transition"
                >
                  CeraVe Hydrating
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
                      Ingredients List or Photo is Required to Proceed *
                    </strong>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-800 font-bold">
                      Full Forensic Scan
                    </span>
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed">
                    To perform an accurate toxicological audit of <strong>all ingredients</strong> and flag harmful chemicals in RED, you must provide either:
                    <span className="font-semibold"> (1) A photo of the ingredients on the bottle/box packaging</span>, OR <span className="font-semibold">(2) Copy & paste the ingredients list</span> from Google or the brand's official store.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSearchGoogleForIngredients}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Search className="w-3.5 h-3.5 text-rose-600" />
                      Search Google for {productBrand} {productName || 'Product'} Ingredients
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

            <div className="space-y-6">
              {/* Form Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Cosmetic Brand Name <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={productBrand}
                    onChange={(e) => {
                      setProductBrand(e.target.value);
                      setMissingIngredientsWarning(false);
                    }}
                    placeholder="e.g. Mamaearth, CeraVe, The Ordinary..."
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 transition"
                  />
                  {/* Quick Brand Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-neutral-400 font-medium">Quick Pick:</span>
                    {['Mamaearth', 'CeraVe', 'The Ordinary', 'Neutrogena', 'Minimalist', 'Cetaphil', 'St. Ives'].map((b) => (
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
                    Product Item Name <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      setMissingIngredientsWarning(false);
                    }}
                    placeholder="e.g. Tea Tree Face Wash, Niacinamide 10%, Hydro Boost..."
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 transition"
                  />
                  <p className="text-[10px] text-neutral-400 mt-2">
                    Identifies product to cross-examine formulation against cosmetic safety indexes.
                  </p>
                </div>
              </div>

              {/* Skin Sensitivity Dropdown & Concerns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Target Skin Types Dropdown (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-700">
                      Target Skin Type
                    </label>
                    <span className="text-[10px] text-neutral-400 font-medium">(Optional)</span>
                  </div>
                  <select
                    value={itemSkinType}
                    onChange={(e) => setItemSkinType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:bg-white focus:border-rose-600 transition"
                  >
                    {TARGET_SKIN_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Select your skin profile to evaluate tolerance, comedogenicity, and irritancy.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-700">
                      Specific Symptoms to Check
                    </label>
                    <span className="text-[10px] text-neutral-400 font-medium">(Optional)</span>
                  </div>
                  <input
                    type="text"
                    value={itemConcerns}
                    onChange={(e) => setItemConcerns(e.target.value)}
                    placeholder="e.g. Inflammatory acne, redness, pore congestion, fungal flares"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:bg-white focus:border-rose-600 transition"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['Active Acne', 'Barrier Burning', 'Clogged Pores', 'Fragrance Allergy'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setItemConcerns(c)}
                        className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-rose-700 transition"
                      >
                        + {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* MANDATORY INGREDIENTS SECTION: Paste Text OR Upload Photo */}
              <div className={`rounded-2xl border-2 p-5 transition space-y-4 ${
                missingIngredientsWarning
                  ? 'border-rose-600 bg-rose-50/40 shadow-md'
                  : (!ingredientsText.trim() && !itemImage)
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
                        Provide Ingredients List or Packaging Photo *
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      DermaLens analyzes <strong>every single ingredient</strong> in the formulation. One option is required to proceed.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {detectedIngredientCount > 0 && (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1">
                        <span>✓</span>
                        <span>{detectedIngredientCount} Ingredients Detected</span>
                      </span>
                    )}
                    {itemImage && (
                      <span className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold flex items-center gap-1">
                        <span>📷</span>
                        <span>Photo Attached</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Dual Input: Text Area & Photo Scanner */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Text Paste & Google Helper */}
                  <div className="lg:col-span-7 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                        <span>Option 1: Paste Full INCI Ingredients List</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSearchGoogleForIngredients}
                        className="text-[11px] text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 underline decoration-rose-300"
                        title="Search Google in new tab"
                      >
                        <Search className="w-3 h-3" />
                        Search Google for Ingredients
                      </button>
                    </div>

                    <textarea
                      rows={5}
                      value={ingredientsText}
                      onChange={(e) => {
                        setIngredientsText(e.target.value);
                        setMissingIngredientsWarning(false);
                      }}
                      placeholder="Paste the complete ingredients list here (e.g. Aqua, Sodium Lauroyl Sarcosinate, Glycerin, Salicylic Acid, Parfum, Limonene...)..."
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 font-mono transition"
                    />

                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span>Separate ingredients by commas, semicolons, or lines.</span>
                      <button
                        type="button"
                        onClick={handleSearchGoogleForIngredients}
                        className="text-rose-700 hover:underline font-semibold"
                      >
                        Don't have the bottle? Look up on Google →
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Packaging Photo Snapshot / Upload */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-neutral-800">
                        Option 2: Photo of Ingredients Label
                      </label>
                      <span className="text-[10px] text-neutral-400">Back of bottle / box</span>
                    </div>

                    {itemImage ? (
                      <div className="relative rounded-2xl overflow-hidden border border-rose-300 bg-neutral-100 h-36 flex items-center justify-center">
                        <img src={itemImage} alt="Scanned item packaging" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => {
                            setItemImage(null);
                          }}
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
                          Snap or Upload Ingredients Photo
                        </p>
                        <p className="text-[10px] text-neutral-400 mb-2">
                          AI reads every micro-text ingredient automatically
                        </p>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCameraGuideMode('label');
                              setIsCameraOpen(true);
                              setMissingIngredientsWarning(false);
                            }}
                            className="px-3 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 text-xs font-semibold transition flex items-center gap-1"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            Camera
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
                                    setItemImage(r.result as string);
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

              {/* Submit Inspection Button */}
              <button
                type="button"
                onClick={handleAnalyzeItem}
                disabled={isItemAnalyzing || !productName.trim()}
                className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-98 ${
                  !ingredientsText.trim() && !itemImage
                    ? 'bg-neutral-800 hover:bg-rose-700 text-white'
                    : 'bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-800 hover:to-rose-700 text-white shadow-rose-900/20'
                }`}
              >
                {isItemAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running Forensic Toxicological Scan for {productBrand} {productName}...
                  </>
                ) : !ingredientsText.trim() && !itemImage ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Provide Ingredients List or Photo to Inspect & Highlight Red Flags
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Inspect All Ingredients for {productBrand ? `${productBrand} ` : ''}{productName || 'Product'} & Highlight Red Flags
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ITEM INSPECTION RESULT REPORT */}
          {itemResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Header Score Card */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-rose-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase font-bold text-rose-700 tracking-wider">
                        {itemResult.brand || 'Cosmetic Brand'}
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-xs text-neutral-500">{itemResult.category || 'Skincare Product'}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                      {itemResult.productName}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-2 max-w-2xl leading-relaxed">
                      {itemResult.summary}
                    </p>
                  </div>

                  {/* Safety Score Meter */}
                  <div className="flex items-center gap-4 bg-rose-50/50 p-4 rounded-2xl border border-rose-100 shrink-0">
                    <div
                      className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-xl border ${
                        itemResult.safetyScore >= 80
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : itemResult.safetyScore >= 50
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300 glow-cherry'
                      }`}
                    >
                      <span>{itemResult.safetyScore}</span>
                      <span className="text-[9px] font-bold text-neutral-400 tracking-wider">/ 100</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                        Safety & Clean Rating
                      </span>
                      <span
                        className={`text-sm font-extrabold ${
                          itemResult.safetyScore >= 80
                            ? 'text-emerald-700'
                            : itemResult.safetyScore >= 50
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {itemResult.safetyRatingLabel}
                      </span>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {itemResult.skinTypeCompatibility}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RED HIGHLIGHTED CULPRIT COMPOUNDS SECTION */}
                <div className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                    <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                      Flagged Problematic Compounds (Highlighted in Red)
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {itemResult.problematicIngredientsHighlightedRed &&
                    itemResult.problematicIngredientsHighlightedRed.length > 0 ? (
                      itemResult.problematicIngredientsHighlightedRed.map((flag, idx) => (
                        <span
                          key={idx}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-800 border-2 border-rose-600 text-xs font-bold shadow-xs flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                          {flag}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                        No severe red-flag toxins detected!
                      </span>
                    )}
                  </div>

                  {/* Complete Ingredients Breakdown Table */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Complete Ingredients Toxicological Breakdown</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-extrabold">
                        All {itemResult.ingredients?.length || 0} Ingredients Audited
                      </span>
                    </h4>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      <strong className="text-rose-700">{itemResult.problematicIngredientsHighlightedRed?.length || 0}</strong> flagged in RED
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Ingredient</th>
                          <th className="py-3 px-4 font-semibold">Category / Hazard</th>
                          <th className="py-3 px-4 font-semibold text-center">Comedogenic</th>
                          <th className="py-3 px-4 font-semibold text-center">Irritancy</th>
                          <th className="py-3 px-4 font-semibold">Clinical Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {itemResult.ingredients?.map((ing, i) => (
                          <tr
                            key={i}
                            className={`transition ${
                              ing.severity === 'red'
                                ? 'bg-rose-50/70 text-rose-950 font-medium'
                                : ing.severity === 'yellow'
                                ? 'bg-amber-50/40 text-amber-950'
                                : 'hover:bg-neutral-50/50 text-neutral-700'
                            }`}
                          >
                            <td className="py-3 px-4 font-bold flex items-center gap-2">
                              {ing.severity === 'red' ? (
                                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
                              ) : ing.severity === 'yellow' ? (
                                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                              )}
                              <span className={ing.severity === 'red' ? 'text-rose-700 font-bold underline decoration-rose-300' : ''}>
                                {ing.name}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  ing.severity === 'red'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                    : ing.severity === 'yellow'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {ing.hazardCategory || ing.purpose || 'Active'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center font-bold">
                              {ing.comedogenicRating !== undefined ? (
                                <span className={ing.comedogenicRating >= 3 ? 'text-rose-700' : 'text-neutral-500'}>
                                  {ing.comedogenicRating} / 5
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="py-3 px-4 text-center font-bold">
                              {ing.irritancyRating !== undefined ? (
                                <span className={ing.irritancyRating >= 3 ? 'text-rose-700' : 'text-neutral-500'}>
                                  {ing.irritancyRating} / 5
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="py-3 px-4 text-neutral-600 max-w-xs">
                              {ing.reason || ing.affectsCondition || 'Safe standard ingredient'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* CLEANER HYPOALLERGENIC ALTERNATIVES WITH DIRECT PURCHASE LINKS */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-rose-700" />
                      <h4 className="text-xl font-bold text-neutral-900">
                        Recommended Cleaner Hypoallergenic Alternatives
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Gentler, certified clean brands to replace the flagged problematic components with direct purchase links.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                    Safe Replacements
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {itemResult.cleanerAlternatives?.map((alt, idx) => (
                    <div
                      key={idx}
                      className="bg-neutral-50/50 rounded-2xl border border-neutral-200 hover:border-rose-300 p-5 flex flex-col justify-between transition-all group hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                            {alt.brand}
                          </span>
                          <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800">
                            {alt.safetyScore ? `${alt.safetyScore}/100 Clean` : '98/100 Clean'}
                          </span>
                        </div>
                        <h5 className="font-bold text-neutral-900 text-base group-hover:text-rose-700 transition mb-2">
                          {alt.name}
                        </h5>
                        <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                          {alt.whyItReplaces || 'Formulated without synthetic fragrance, limonene sensitizers, or aggressive foaming agents.'}
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {(alt.cleanBadges || ['Fragrance-Free', 'Hypoallergenic', 'Non-Comedogenic']).map((b, bi) => (
                            <span
                              key={bi}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white text-neutral-700 border border-neutral-200"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                        {alt.priceEstimate && (
                          <span className="text-xs font-bold text-neutral-800">{alt.priceEstimate}</span>
                        )}
                        <a
                          href={alt.purchaseLink || `https://www.google.com/search?q=buy+${encodeURIComponent(alt.brand + ' ' + alt.name)}`}
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
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. HOLISTIC SKIN DIAGNOSIS & DIETARY CROSS-ANALYSIS VIEW  */}
      {/* ========================================================== */}
      {subTab === 'diagnosis' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Diagnostic Progress Stepper in White & Cherry Red */}
          <div className="bg-white rounded-2xl border border-rose-100 p-4 flex items-center justify-between shadow-xs">
            {[
              { num: 1, title: 'Skin Camera Scan' },
              { num: 2, title: 'Dietary Analysis Quiz' },
              { num: 3, title: 'Current Products Audit' },
              { num: 4, title: 'Holistic Diagnosis Report' },
            ].map((step) => (
              <div
                key={step.num}
                onClick={() => {
                  if (diagResult || step.num <= diagStep) setDiagStep(step.num as any);
                }}
                className={`flex items-center gap-2 cursor-pointer transition ${
                  diagStep === step.num
                    ? 'text-rose-700 font-bold'
                    : diagStep > step.num
                    ? 'text-rose-600'
                    : 'text-neutral-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                    diagStep === step.num
                      ? 'bg-rose-700 text-white border-rose-700 shadow-sm'
                      : diagStep > step.num
                      ? 'bg-rose-100 text-rose-700 border-rose-300'
                      : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                  }`}
                >
                  {diagStep > step.num ? '✓' : step.num}
                </div>
                <span className="hidden sm:inline text-xs">{step.title}</span>
              </div>
            ))}
          </div>

          {/* STEP 1: SKIN DIAGNOSTIC CAMERA SCAN & SYMPTOMS */}
          {diagStep === 1 && (
            <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-md space-y-6">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-rose-600" />
                  Step 1: Skin Diagnostic Camera Scan & Symptoms
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Take a facial selfie or upload a skin close-up to detect erythema, barrier flaking, and pore inflammation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Photo Viewfinder */}
                <div>
                  {selfieImage ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-rose-500 bg-neutral-950 aspect-square max-w-sm mx-auto shadow-md">
                      <img src={selfieImage} alt="Skin Selfie Scan" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setSelfieImage(null)}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-neutral-900/80 hover:bg-rose-600 text-white transition"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur border border-rose-200 text-rose-800 text-xs font-semibold text-center shadow-xs">
                        Face Scan Captured & Ready for Diagnostic AI
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/20 p-8 text-center flex flex-col items-center justify-center max-w-sm mx-auto aspect-square">
                      <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center mb-4">
                        <Camera className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-neutral-900 text-sm mb-1">Live Skin Diagnostic Camera</h4>
                      <p className="text-xs text-neutral-500 mb-6 max-w-xs">
                        Positions face in oval for barrier redness, pore congestion, and acne detection
                      </p>

                      <div className="flex flex-col w-full gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setCameraGuideMode('face');
                            setIsCameraOpen(true);
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 active:scale-95 transition"
                        >
                          <Camera className="w-4 h-4" />
                          Launch Live Face Scan Camera
                        </button>
                        <label className="cursor-pointer w-full py-2 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 text-xs font-semibold text-center transition">
                          Upload Existing Selfie Photo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const r = new FileReader();
                                r.onload = () => setSelfieImage(r.result as string);
                                r.readAsDataURL(f);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Specific Problems & Target Skin Type Selector */}
                <div className="space-y-4">
                  {/* Target Skin Type Dropdown (Optional) */}
                  <div className="p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-neutral-800">
                        Target Skin Type
                      </label>
                      <span className="text-[10px] text-neutral-400 font-medium">(Optional)</span>
                    </div>
                    <select
                      value={diagSkinType}
                      onChange={(e) => setDiagSkinType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 transition"
                    >
                      {TARGET_SKIN_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Helps the AI cross-examine your lipid barrier resilience against your current products.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm mb-1">
                      What skin problems are currently troubling you?
                    </h4>
                    <p className="text-xs text-neutral-500 mb-3">
                      Select all that apply so AI can trace the biological root cause in your diet and skincare products:
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      'Deep cystic acne along jawline & chin',
                      'Facial burning, redness & damaged moisture barrier',
                      'Small bumpy itchy fungal acne (Malassezia)',
                      'Pore congestion & stubborn blackheads',
                      'Rosacea flushing & visible capillary erythema',
                      'Flaky dry patches with rebound oiliness',
                      'Post-inflammatory hyperpigmentation (dark marks)',
                    ].map((problem) => {
                      const isSelected = selectedProblems.includes(problem);
                      return (
                        <div
                          key={problem}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedProblems(selectedProblems.filter((p) => p !== problem));
                            } else {
                              setSelectedProblems([...selectedProblems, problem]);
                            }
                          }}
                          className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 text-xs ${
                            isSelected
                              ? 'bg-rose-50 border-rose-500 text-neutral-900 font-semibold'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                              isSelected
                                ? 'bg-rose-700 border-rose-700 text-white font-bold text-[10px]'
                                : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isSelected ? '✓' : ''}
                          </div>
                          <span>{problem}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setDiagStep(2)}
                    className="w-full py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition mt-4"
                  >
                    Continue to Dietary Analysis Quiz
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DIETARY ANALYSIS QUIZ */}
          {diagStep === 2 && (
            <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-md space-y-6">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-rose-600" />
                  Step 2: Dietary Analysis Quiz
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Your gut-skin axis determines skin sebum thickness, hormonal androgen spikes, and systemic cytokine inflammation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">
                    1. Dairy Intake (Whey protein, milk, cheese, yogurt)
                  </label>
                  <select
                    value={dietQuiz.dairyFrequency}
                    onChange={(e) => setDietQuiz({ ...dietQuiz, dairyFrequency: e.target.value })}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
                  >
                    <option value="Daily (Milk in coffee, whey protein, cheese)">Daily (Milk in coffee, whey protein shakes, cheese)</option>
                    <option value="Moderate (2-3 times weekly)">Moderate (2-3 times weekly)</option>
                    <option value="Low (Occasional cheese)">Low (Occasional cheese only)</option>
                    <option value="100% Dairy-Free">100% Dairy-Free (Plant milks only)</option>
                  </select>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Dairy whey elevates insulin-like growth factor-1 (IGF-1), leading to jawline cystic acne.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">
                    2. Sugar & High-Glycemic Refined Carbs
                  </label>
                  <select
                    value={dietQuiz.sugarFrequency}
                    onChange={(e) => setDietQuiz({ ...dietQuiz, sugarFrequency: e.target.value })}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
                  >
                    <option value="High (Sweet snacks, desserts, soda, white flour)">High (Sweet snacks, desserts, soda, refined flour)</option>
                    <option value="Moderate (1 sweet treat daily)">Moderate (1 sweet treat / dessert daily)</option>
                    <option value="Low (Only natural fruits)">Low (Only whole fruits, rarely added sugars)</option>
                    <option value="Strict Ketogenic / Zero Refined Sugar">Strict Ketogenic / Zero Refined Sugar</option>
                  </select>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Insulin spikes cause epidermal hyperkeratinization and sticky pore-clogging sebum.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">
                    3. Fried Foods & Industrial Seed Oils (Canola, Soybean)
                  </label>
                  <select
                    value={dietQuiz.friedFoodFrequency}
                    onChange={(e) => setDietQuiz({ ...dietQuiz, friedFoodFrequency: e.target.value })}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
                  >
                    <option value="2-4 times a week (Vegetable seed oils)">2-4 times a week (Vegetable seed oils, restaurant takeout)</option>
                    <option value="Almost daily">Almost daily (Deep fried items, chips, commercial dressing)</option>
                    <option value="Rarely (1x a month)">Rarely (Cook with olive/avocado oil at home)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">
                    4. Daily Hydration & Gut Function
                  </label>
                  <select
                    value={dietQuiz.waterIntakeLiters}
                    onChange={(e) => setDietQuiz({ ...dietQuiz, waterIntakeLiters: e.target.value })}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
                  >
                    <option value="Under 1.5 Liters / day">Under 1.5 Liters / day (Chronic dehydration)</option>
                    <option value="1.5 to 2.5 Liters / day">1.5 to 2.5 Liters / day (Moderate)</option>
                    <option value="3+ Liters / day">3+ Liters / day with electrolytes</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setDiagStep(1)}
                  className="px-4 py-2 text-xs text-neutral-600 hover:text-neutral-900"
                >
                  ← Back to Camera Scan
                </button>
                <button
                  type="button"
                  onClick={() => setDiagStep(3)}
                  className="py-3 px-6 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition"
                >
                  Proceed to Current Products Audit
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CURRENT PRODUCTS AUDIT */}
          {diagStep === 3 && (
            <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-md space-y-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-rose-600" />
                    Step 3: Skincare Routine Inventory
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                    Ingredients Optional
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  List all products currently applied to your skin (cleansers, exfoliants, oils, serums). DermaLens will inspect all ingredients to highlight in <span className="text-rose-700 font-bold bg-rose-50 px-1 py-0.5 rounded">RED</span> which ones aggravate inflammation and issue a "REMOVE FROM ROUTINE" verdict.
                </p>
              </div>

              {/* Informational Callout */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center gap-3 text-xs text-rose-900">
                <span className="w-5 h-5 rounded-full bg-rose-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0">✓</span>
                <span>
                  <strong>Ingredients Uploading is Optional:</strong> Only the <strong>Product Name from which Brand</strong> is enough! DermaLens AI cross-references verified laboratory and brand formulation records automatically to flag culprit ingredients in RED.
                </span>
              </div>

              {/* Quick 1-Click Preset Adders */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                  1-Click Add Common Products to Test:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { brand: 'Mamaearth', name: 'Tea Tree Face Wash' },
                    { brand: 'The Ordinary', name: 'Niacinamide 10% + Zinc 1%' },
                    { brand: 'CeraVe', name: 'Foaming Facial Cleanser' },
                    { brand: 'Neutrogena', name: 'Hydro Boost Water Gel' },
                    { brand: 'St. Ives', name: 'Fresh Skin Apricot Scrub' },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddQuickProduct(p.brand, p.name)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-neutral-700 hover:text-rose-800 text-xs border border-neutral-200 hover:border-rose-300 font-medium transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3 h-3 text-rose-600" />
                      <span className="font-bold text-rose-700">{p.brand}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Inventory Products List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Your Current Skincare Inventory ({currentRoutineProducts.length} items)
                  </span>
                  {currentRoutineProducts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentRoutineProducts([])}
                      className="text-[11px] text-neutral-400 hover:text-rose-600 transition"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {currentRoutineProducts.length === 0 ? (
                  <div className="p-6 rounded-2xl border-2 border-dashed border-neutral-200 text-center text-xs text-neutral-400">
                    No products added yet. Use the form below to add products you currently use.
                  </div>
                ) : (
                  currentRoutineProducts.map((prod, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-neutral-50 hover:bg-rose-50/20 border border-neutral-200 hover:border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-extrabold uppercase tracking-wide">
                            {prod.brand || 'Skincare Brand'}
                          </span>
                          <h4 className="font-bold text-neutral-900 text-sm">{prod.name}</h4>
                        </div>
                        {prod.ingredients ? (
                          <p className="text-[11px] text-neutral-500 line-clamp-1 font-mono">
                            <span className="text-neutral-400">Custom INCI:</span> {prod.ingredients}
                          </p>
                        ) : (
                          <p className="text-[11px] text-rose-700 font-medium flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-rose-600" />
                            <span>Ingredients: Auto-resolved from official <strong>{prod.brand}</strong> formulation by DermaLens AI</span>
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(index)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition self-end sm:self-auto shrink-0"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Product Box */}
              <div className="p-5 rounded-2xl bg-white border-2 border-rose-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-rose-900 block">
                      + Add a Product to Your Current Routine
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Only product name & brand is required. Ingredients uploading is optional!
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    Fast AI Lookup Enabled
                  </span>
                </div>

                {/* Popular Brand Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-neutral-400 font-medium">Quick Brands:</span>
                  {['Mamaearth', 'CeraVe', 'The Ordinary', 'Neutrogena', 'Minimalist', 'La Roche-Posay', 'Cetaphil', 'St. Ives'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setNewProdBrand(b)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                        newProdBrand === b
                          ? 'bg-rose-700 text-white border-rose-700 font-bold'
                          : 'bg-neutral-100 hover:bg-rose-50 text-neutral-600 border-neutral-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                {/* Brand + Product Name Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Brand Name <span className="text-rose-600 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={newProdBrand}
                      onChange={(e) => setNewProdBrand(e.target.value)}
                      placeholder="e.g. Mamaearth, CeraVe, The Ordinary..."
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:bg-white focus:border-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Product Name <span className="text-rose-600 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Tea Tree Face Wash, Niacinamide Serum..."
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:bg-white focus:border-rose-600"
                    />
                  </div>
                </div>

                {/* Optional Ingredients Accordion */}
                <div className="border border-neutral-200 rounded-xl bg-neutral-50/50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowOptionalRoutineIngredients(!showOptionalRoutineIngredients)}
                    className="w-full p-2.5 px-3 flex items-center justify-between text-left hover:bg-neutral-100/70 transition"
                  >
                    <span className="text-[11px] font-semibold text-neutral-700 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700 text-[9px] font-bold uppercase">Optional</span>
                      Upload packaging photo or paste ingredients list
                    </span>
                    <span className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
                      {showOptionalRoutineIngredients ? (
                        <>
                          <span>Hide</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>+ Add Ingredients</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </span>
                  </button>

                  {showOptionalRoutineIngredients && (
                    <div className="p-3 pt-0 border-t border-neutral-200 space-y-2 mt-2 animate-in fade-in">
                      <textarea
                        rows={2}
                        value={newProdIngredients}
                        onChange={(e) => setNewProdIngredients(e.target.value)}
                        placeholder="Paste ingredients if you have the bottle handy (otherwise DermaLens AI looks it up automatically)..."
                        className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 font-mono"
                      />
                      <p className="text-[10px] text-neutral-400">
                        Leave blank to let DermaLens AI auto-resolve the formulation from the official brand records.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={!newProdName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Add Product to Routine
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setDiagStep(2)}
                  className="px-4 py-2 text-xs text-neutral-600 hover:text-neutral-900"
                >
                  ← Back to Diet Quiz
                </button>
                <button
                  type="button"
                  onClick={handleRunDiagnosis}
                  disabled={isDiagAnalyzing}
                  className="py-3 px-8 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-800 hover:to-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-900/15 active:scale-95 transition disabled:opacity-50"
                >
                  {isDiagAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Synthesizing Cross-Correlation Diagnosis...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Run Forensic Skin & Diet Diagnosis ({currentRoutineProducts.length} Products)
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: HOLISTIC DIAGNOSIS RESULTS */}
          {diagStep === 4 && diagResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Diagnosis Header */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-100">
                  <div>
                    <span className="text-xs uppercase font-bold text-rose-700 tracking-wider">
                      Dermatological & Nutritional Diagnosis
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                      {diagResult.diagnosisTitle}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-2 max-w-3xl leading-relaxed">
                      {diagResult.clinicalSummary}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 shrink-0 text-center">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Barrier Health Status
                    </span>
                    <span className="text-sm font-black text-rose-700 block mt-0.5">
                      {diagResult.skinBarrierHealthStatus}
                    </span>
                    <span className="text-[10px] text-neutral-500 mt-1 block">
                      {diagResult.confidenceScore}% Diagnostic Confidence
                    </span>
                  </div>
                </div>

                {/* Root Cause Correlation */}
                <div className="pt-6">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-rose-600" />
                    How Diet & Skincare Products Are Synergistically Triggering Your Condition
                  </h4>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 leading-relaxed">
                    {diagResult.rootCauseCorrelation}
                  </div>
                </div>
              </div>

              {/* PRODUCTS AUDIT: WHICH PRODUCTS TO REMOVE & CULPRIT INGREDIENTS IN RED */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                      Skincare Products Audit & "REMOVE FROM ROUTINE" Verdicts
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1">
                      Highlighting culprit chemicals in <span className="text-rose-700 font-bold bg-rose-50 px-1 py-0.5 rounded">RED</span> that aggravate inflammation or trigger breakouts.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {diagResult.productsAudit?.map((prod, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-rose-300 transition space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                            {prod.brand || 'Current Product'}
                          </span>
                          <h5 className="font-bold text-neutral-900 text-base">{prod.productName}</h5>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-black border ${
                            prod.actionVerdict === 'REMOVE FROM ROUTINE'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {prod.actionVerdict}
                        </span>
                      </div>

                      {/* Culprits in RED */}
                      <div>
                        <span className="text-[11px] font-bold text-neutral-600 block mb-1">
                          Culprit Ingredients Causing Harm (Highlighted in RED):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {prod.culpritIngredientsInRed?.map((ing, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 border-2 border-rose-600 text-rose-900 text-xs font-bold"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed">
                        <strong className="text-neutral-900">Biological Harm:</strong> {prod.biologicalHarmExplanation}
                      </p>

                      {/* Clean Replacement Recommendation */}
                      {prod.suggestedCleanReplacement && (
                        <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white p-3 rounded-xl border border-rose-100">
                          <div>
                            <span className="text-rose-700 font-bold block text-[11px]">
                              Recommended Clean Replacement:
                            </span>
                            <span className="font-bold text-neutral-900">
                              {prod.suggestedCleanReplacement.name} ({prod.suggestedCleanReplacement.brand})
                            </span>
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              {prod.suggestedCleanReplacement.whyBetter}
                            </p>
                          </div>
                          <a
                            href={prod.suggestedCleanReplacement.purchaseLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Purchase Link
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* DIETARY IMPROVEMENT PLAN: FOODS TO INCLUDE / REMOVE */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-rose-600" />
                    Personalized Dietary Improvement Plan
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    Foods to eliminate and functional nutrients to incorporate to calm systemic inflammation and sebum hyperkeratinization.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Foods to Remove */}
                  <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-3">
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                      Foods to Immediately Remove / Reduce
                    </span>
                    <div className="space-y-2.5">
                      {diagResult.dietaryImprovementPlan?.foodsToRemove?.map((item, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white border border-rose-200 text-xs">
                          <span className="font-bold text-rose-900 block">{item.item}</span>
                          <p className="text-neutral-600 text-[11px] mt-0.5">
                            <strong className="text-neutral-800">Trigger:</strong> {item.reason}
                          </p>
                          <p className="text-rose-700 text-[11px] font-semibold mt-1">
                            Swap with: {item.cleanerAlternative}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Foods to Incorporate */}
                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                    <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                      Foods & Nutrients to Incorporate
                    </span>
                    <div className="space-y-2.5">
                      {diagResult.dietaryImprovementPlan?.foodsToIncorporate?.map((item, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white border border-neutral-200 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-neutral-900">{item.item}</span>
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              {item.richIn}
                            </span>
                          </div>
                          <p className="text-neutral-600 text-[11px] mt-1">{item.benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Daily Habits */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <span className="text-xs font-bold text-neutral-900 block mb-2">
                    Daily Dermatological & Nutritional Habits:
                  </span>
                  <ul className="space-y-1 text-xs text-neutral-600">
                    {diagResult.dietaryImprovementPlan?.dailyHabits?.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* PERSONALIZED CLEAN SKINCARE ROUTINE WITH DIRECT PURCHASE LINKS */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-rose-700" />
                      Your 4-Step Barrier-Repair Skincare Regimen
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1">
                      100% hypoallergenic, fragrance-free certified clean alternatives with direct purchase links.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {diagResult.personalizedCleanSkincareRoutine?.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-rose-300 flex flex-col justify-between transition group hover:shadow-xs"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-1">
                          {step.step}
                        </span>
                        <h5 className="font-bold text-neutral-900 text-sm group-hover:text-rose-700 transition">
                          {step.productName}
                        </h5>
                        <span className="text-[11px] text-neutral-500 block mb-2">{step.brand}</span>
                        <p className="text-[11px] text-neutral-600 mb-4">
                          <strong className="text-neutral-700">Active:</strong> {step.keyActive}
                        </p>
                      </div>

                      <a
                        href={step.purchaseLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 mt-2"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Purchase Link
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        guideMode={cameraGuideMode}
        title={cameraGuideMode === 'face' ? 'Skin Diagnostic Camera Scan' : 'Bottle Label Scanner'}
        subtitle={
          cameraGuideMode === 'face'
            ? 'Align face within oval for erythema & barrier scan'
            : 'Align ingredient text in frame'
        }
        onCapture={(base64) => {
          if (cameraGuideMode === 'face') {
            setSelfieImage(base64);
          } else {
            setItemImage(base64);
          }
        }}
      />
    </div>
  );
};
