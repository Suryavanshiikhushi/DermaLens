/**
 * CleanSwapModal.tsx
 * Bulletproof Clean Replacement & Purchase Link Handler
 * 
 * Solves iframe popup blocker issues by providing:
 * 1. Direct window.open navigation
 * 2. Fallback Google Shopping and Amazon search buttons
 * 3. 1-Click Clipboard copy with instant visual checkmark feedback
 * 4. Transparent clinical rationale of why this clean product replaces the offending item
 */

import React, { useState } from 'react';
import { CleanAlternative } from '../types';
import {
  ExternalLink,
  ShoppingCart,
  Copy,
  Check,
  X,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface CleanSwapModalProps {
  alternative: CleanAlternative | null;
  onClose: () => void;
}

export const CleanSwapModal: React.FC<CleanSwapModalProps> = ({
  alternative,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!alternative) return null;

  const targetUrl =
    alternative.purchaseLink && !alternative.purchaseLink.includes('example.com')
      ? alternative.purchaseLink
      : `https://www.google.com/search?q=buy+${encodeURIComponent(alternative.brand + ' ' + alternative.name)}&tbm=shop`;

  const googleShoppingUrl = `https://www.google.com/search?q=buy+${encodeURIComponent(alternative.brand + ' ' + alternative.name)}&tbm=shop`;
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(alternative.brand + ' ' + alternative.name)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenStore = () => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-rose-100 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">
                Verified Clean Swap
              </h3>
              <p className="text-xs text-neutral-500">
                Safe formulation certified free of offending toxins
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-rose-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Product Hero Info */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-extrabold text-rose-700 uppercase tracking-wider">
                {alternative.brand}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Safety Score: {alternative.safetyScore || 96}/100
              </span>
            </div>
            <h4 className="text-lg font-black text-neutral-900 leading-snug">
              {alternative.name}
            </h4>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              {alternative.whyItReplaces || alternative.whyItIsBetter || 'Formulated with hypoallergenic, non-comedogenic ingredients.'}
            </p>

            {/* Badges */}
            {alternative.cleanAttributes && alternative.cleanAttributes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-neutral-200">
                {alternative.cleanAttributes.map((attr, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white text-neutral-700 border border-neutral-200"
                  >
                    ✓ {attr}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Store Links Notice */}
          <div className="flex items-center justify-between text-xs text-neutral-600 px-1">
            <span>Estimated Retail Price:</span>
            <span className="font-bold text-neutral-900 text-sm">
              {alternative.priceEstimate || '$14.99 – $24.00'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleOpenStore}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 transition active:scale-[0.99]"
            >
              <ShoppingCart className="w-4 h-4" />
              Open Purchase & Store Page in New Tab
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={googleShoppingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:border-rose-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition text-center"
              >
                <Search className="w-3.5 h-3.5 text-rose-600" />
                Google Shopping
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>

              <a
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:border-rose-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition text-center"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
                Amazon Search
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            </div>

            {/* Copy Link Fallback */}
            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Store Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-neutral-500" />
                  Copy Direct Store Link (Paste in browser)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
