import React, { useState } from 'react';
import { UserProfile, CommunityTransparencyReport } from '../types';
import { Share2, ShieldCheck, Heart, Plus, Sparkles, Check, ExternalLink } from 'lucide-react';

interface CommunityTransparencyProps {
  user: UserProfile;
}

export const CommunityTransparency: React.FC<CommunityTransparencyProps> = ({ user }) => {
  const [reports, setReports] = useState<CommunityTransparencyReport[]>([
    {
      id: 'rep-1',
      author: 'Maya Lin, Skincare Chemist',
      productName: 'Mamaearth Tea Tree Face Wash',
      brand: 'Mamaearth',
      category: 'Skin',
      deceptiveClaim: 'Marketed as "100% Toxin-Free & Natural", but loaded with synthetic parfum, limonene sensitizers, and stripping sarcosinates that aggravate cystic acne.',
      culpritIngredients: ['Parfum / Synthetic Fragrance', 'Limonene & Linalool', 'Sodium Lauroyl Sarcosinate'],
      recommendedCleanSwap: 'Vanicream Gentle Facial Cleanser or CeraVe Hydrating',
      likes: 142,
      createdAt: '2 hours ago',
    },
    {
      id: 'rep-2',
      author: 'Dr. Ryan Keller, Nutritionist',
      productName: 'Choco-Crisp Morning Cereal',
      brand: 'SweetGrain Co.',
      category: 'Food',
      deceptiveClaim: 'Front of pack says "Whole Grain Energy", but 2nd and 3rd ingredients are High Fructose Corn Syrup & Partially Hydrogenated Palm Oil with BHT.',
      culpritIngredients: ['High Fructose Corn Syrup', 'Partially Hydrogenated Palm Oil', 'BHT Preservative', 'Red 40 Dye'],
      recommendedCleanSwap: 'Organic Rolled Oats with Ceylon Cinnamon & Raw Almonds',
      likes: 98,
      createdAt: 'Yesterday',
    },
    {
      id: 'rep-3',
      author: 'Elena Rostova, Esthetician',
      productName: 'Botanical Walnut Facial Polish',
      brand: 'NaturaLuxe',
      category: 'Skin',
      deceptiveClaim: 'Claims "Gentle Daily Polish", but physical walnut shell jagged edges cause micro-tears and flare up perioral dermatitis.',
      culpritIngredients: ['Crushed Walnut Shell Powder', 'Synthetic Fragrance', 'Isopropyl Myristate (Rating 5 Comedogenic)'],
      recommendedCleanSwap: 'Paula\'s Choice 2% BHA Salicylic Liquid Exfoliant',
      likes: 215,
      createdAt: '3 days ago',
    },
  ]);

  const [isPublishing, setIsPublishing] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newCategory, setNewCategory] = useState<'Skin' | 'Food'>('Skin');
  const [newDeceptiveClaim, setNewDeceptiveClaim] = useState('');
  const [newCulprits, setNewCulprits] = useState('');
  const [newCleanSwap, setNewCleanSwap] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleLike = (id: string) => {
    setReports(
      reports.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.trim() || !newDeceptiveClaim.trim()) return;

    const newRep: CommunityTransparencyReport = {
      id: `rep-${Date.now()}`,
      author: `${user.name}`,
      productName: newProduct,
      brand: newBrand || 'Commercial Brand',
      category: newCategory,
      deceptiveClaim: newDeceptiveClaim,
      culpritIngredients: newCulprits
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      recommendedCleanSwap: newCleanSwap || 'Certified Hypoallergenic Whole Food / Skincare Alternative',
      likes: 1,
      createdAt: 'Just now',
    };

    setReports([newRep, ...reports]);
    setIsPublishing(false);
    setNewBrand('');
    setNewProduct('');
    setNewDeceptiveClaim('');
    setNewCulprits('');
    setNewCleanSwap('');
  };

  const handleShare = async (report: CommunityTransparencyReport) => {
    const text = `🚨 DermaLens Transparency Alert: ${report.brand} ${report.productName} was flagged for deceptive clean claims! Culprit ingredients: ${report.culpritIngredients.join(', ')}. Clean alternative: ${report.recommendedCleanSwap}. Look Beyond the Label at DermaLens.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `DermaLens Report: ${report.productName}`,
          text,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(text);
    setCopiedId(report.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Share2 className="w-3.5 h-3.5" />
            Community-Driven Transparency
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
            Transparency Reports & Social Warnings
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl">
            Exposing greenwashed claims, hidden chemical allergens, and misleading healthy food labels. Shareable verified cards to protect our community.
          </p>
        </div>

        <button
          onClick={() => setIsPublishing(!isPublishing)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-800 hover:to-rose-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Publish Transparency Alert
        </button>
      </div>

      {/* Publish Form (Collapsible) */}
      {isPublishing && (
        <form
          onSubmit={handlePublish}
          className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-lg space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              Submit Product Transparency Report
            </h3>
            <span className="text-xs text-neutral-500">Published by {user.name}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                placeholder="e.g. Mamaearth Face Wash"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                required
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="e.g. Mamaearth"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
              >
                <option value="Skin">Skincare & Cosmetics</option>
                <option value="Food">Packaged Food & Snacks</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Deceptive Claim or Hidden Issue Exposed
            </label>
            <textarea
              required
              rows={2}
              value={newDeceptiveClaim}
              onChange={(e) => setNewDeceptiveClaim(e.target.value)}
              placeholder="Explain what the product claims (e.g. '100% natural') vs what is actually inside..."
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Problematic Culprit Ingredients (Comma-separated)
              </label>
              <input
                type="text"
                value={newCulprits}
                onChange={(e) => setNewCulprits(e.target.value)}
                placeholder="Synthetic Fragrance, Limonene, BHT, Red 40..."
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Recommended Cleaner Alternative
              </label>
              <input
                type="text"
                value={newCleanSwap}
                onChange={(e) => setNewCleanSwap(e.target.value)}
                placeholder="e.g. CeraVe Hydrating Cleanser / Organic Raw Almond Bar"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsPublishing(false)}
              className="px-4 py-2 rounded-xl text-xs text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-sm transition"
            >
              Publish Report To Community
            </button>
          </div>
        </form>
      )}

      {/* Reports Feed */}
      <div className="space-y-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-rose-100 hover:border-rose-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-800">{report.author}</span>
                <span className="text-neutral-300">•</span>
                <span className="text-[11px] text-neutral-400">{report.createdAt}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    report.category === 'Skin'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {report.category === 'Skin' ? 'Cosmetic Alert' : 'Food Alert'}
                </span>
              </div>

              {/* Share & Like actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLike(report.id)}
                  className="px-3 py-1 rounded-xl bg-neutral-50 hover:bg-rose-50 text-neutral-700 text-xs font-medium border border-neutral-200 flex items-center gap-1.5 transition active:scale-95"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600/20" />
                  <span>{report.likes}</span>
                </button>

                <button
                  onClick={() => handleShare(report)}
                  className="px-3 py-1 rounded-xl bg-neutral-50 hover:bg-rose-50 text-neutral-700 text-xs font-medium border border-neutral-200 flex items-center gap-1.5 transition active:scale-95"
                  title="Share transparency report"
                >
                  {copiedId === report.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-rose-700" />
                      <span className="text-rose-700 text-[11px] font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="text-xs">Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                {report.brand}
              </span>
              <h4 className="text-xl font-bold text-neutral-900 mt-0.5">{report.productName}</h4>
            </div>

            {/* Deceptive Claim Expose */}
            <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 text-xs text-neutral-700 leading-relaxed">
              <span className="text-rose-700 font-bold block mb-1">Deceptive Claim Exposed:</span>
              {report.deceptiveClaim}
            </div>

            {/* Culprit Ingredients in Red */}
            <div>
              <span className="text-[11px] font-bold text-neutral-500 block mb-1.5 uppercase tracking-wide">
                Culprit Problematic Compounds:
              </span>
              <div className="flex flex-wrap gap-2">
                {report.culpritIngredients.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Clean Alternative */}
            <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-neutral-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-rose-700 shrink-0" />
                <span>
                  Clean Swap Recommendation: <strong className="text-rose-700 font-bold">{report.recommendedCleanSwap}</strong>
                </span>
              </div>
              <a
                href={`https://www.google.com/search?q=buy+${encodeURIComponent(report.recommendedCleanSwap)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 transition underline decoration-rose-300 underline-offset-2"
              >
                Find Purchase Link
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
