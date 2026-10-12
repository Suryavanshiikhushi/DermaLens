export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  skinType?: string;
  dietaryPreference?: string;
  joinedAt: string;
}

export interface IngredientItem {
  name: string;
  purpose?: string;
  comedogenicRating?: number; // 0 to 5
  irritancyRating?: number; // 0 to 5
  isProblematic: boolean;
  severity: 'red' | 'yellow' | 'green';
  hazardCategory?: string;
  reason?: string;
  affectsCondition?: string;
  category?: string;
  healthRisk?: string;
}

export interface CleanAlternative {
  name: string;
  brand: string;
  category?: string;
  safetyScore?: number;
  keyBenefits?: string[];
  cleanBadges?: string[];
  whyItReplaces?: string;
  whyItIsBetter?: string;
  cleanAttributes?: string[];
  priceEstimate?: string;
  purchaseLink: string;
}

export interface SkinAnalysisResult {
  productName: string;
  brand: string;
  category: string;
  safetyScore: number;
  safetyRatingLabel: string;
  summary: string;
  skinTypeCompatibility: string;
  ingredients: IngredientItem[];
  problematicIngredientsHighlightedRed: string[];
  concernsDetected: string[];
  cleanerAlternatives: CleanAlternative[];
  scannedAt: string;
}

export interface ProductAuditItem {
  productName: string;
  brand?: string;
  category?: string;
  actionVerdict: 'REMOVE FROM ROUTINE' | 'USE WITH CAUTION' | 'SAFE TO KEEP';
  culpritIngredientsInRed: string[];
  biologicalHarmExplanation: string;
  suggestedCleanReplacement?: {
    name: string;
    brand: string;
    purchaseLink: string;
    whyBetter: string;
  };
}

export interface HolisticDiagnosisResult {
  diagnosisTitle: string;
  confidenceScore: number;
  clinicalSummary: string;
  skinBarrierHealthStatus: string;
  rootCauseCorrelation: string;
  productsAudit: ProductAuditItem[];
  dietaryTriggersIdentified: {
    foodTrigger: string;
    mechanism: string;
    skinImpact: string;
    action: string;
  }[];
  dietaryImprovementPlan: {
    foodsToIncorporate: { item: string; richIn: string; benefit: string }[];
    foodsToRemove: { item: string; reason: string; cleanerAlternative: string }[];
    dailyHabits: string[];
  };
  personalizedCleanSkincareRoutine: {
    step: string;
    productName: string;
    brand: string;
    keyActive: string;
    purchaseLink: string;
  }[];
  scannedAt: string;
}

export interface FoodProblemCategory {
  category: 'Acne & Skin Breakouts' | 'Hormonal Disruption' | 'Cholesterol & Heart' | 'Gut & Skin Sensitivity' | 'Metabolic Strain';
  severity: 'High' | 'Moderate' | 'Low';
  culpritCompounds: string[];
  explanation: string;
  cleanSwapSuggestion: string;
}

export interface FoodAnalysisResult {
  productName: string;
  brand: string;
  foodCategory: string;
  healthScore: number;
  safetyRatingLabel: string;
  summary: string;
  ingredients: IngredientItem[];
  problematicIngredientsHighlightedRed: string[];
  potentialHealthAndSkinProblems: FoodProblemCategory[];
  allergenWarnings: string[];
  cleanerWholeFoodAlternatives: CleanAlternative[];
  scannedAt: string;
}

export interface ExposureMetric {
  date: string;
  toxinScore: number; // lower is better
  irritantsAvoided: number;
  cleanSwapsCount: number;
  type: 'skin' | 'food';
  productName: string;
  redFlagsCount: number;
}

export interface CommunityTransparencyReport {
  id: string;
  author: string;
  productName: string;
  brand: string;
  category: 'Skin' | 'Food';
  deceptiveClaim: string; // e.g. "Labeled 'Natural & Gentle' but contains synthetic fragrance"
  culpritIngredients: string[];
  recommendedCleanSwap: string;
  likes: number;
  createdAt: string;
}

export const TARGET_SKIN_TYPES = [
  { value: '', label: '-- All Skin Types / General Tolerance (Optional) --' },
  { value: 'Sensitive & Reactive', label: 'Sensitive & Reactive (Stinging, burning, redness)' },
  { value: 'Compromised Lipid Barrier', label: 'Compromised Lipid Barrier (Peeling, tight, stripped acid mantle)' },
  { value: 'Acne-Prone & Oily', label: 'Acne-Prone & Oily (Clogged pores, active comedones, excess sebum)' },
  { value: 'Hormonal Cystic Acne', label: 'Hormonal Cystic Acne (Deep jawline, chin & cheek inflammatory nodules)' },
  { value: 'Fungal Acne (Malassezia Folliculitis)', label: 'Fungal Acne (Small itchy uniform bumps, yeast-sensitive)' },
  { value: 'Dry & Flaky / Dehydrated', label: 'Dry & Flaky / Dehydrated (Severe tightness, lack of lipid hydration)' },
  { value: 'Combination (Oily T-Zone, Dry Cheeks)', label: 'Combination (Oily forehead/nose, dry or normal cheeks)' },
  { value: 'Rosacea & Redness / Erythema-Prone', label: 'Rosacea & Redness / Erythema-Prone (Flushing, broken capillaries)' },
  { value: 'Eczema & Atopic Dermatitis', label: 'Eczema & Atopic Dermatitis (Severe itchy patches, hyper-reactive)' },
  { value: 'Hyperpigmented / Melasma & Dark Spots', label: 'Hyperpigmented / Melasma & Dark Spots (Post-inflammatory PIH/PIE)' },
  { value: 'Mature & Loss of Elasticity', label: 'Mature & Loss of Elasticity (Collagen depletion, fine lines)' },
  { value: 'Normal & Balanced', label: 'Normal & Balanced (Resilient acid mantle)' },
];
