import React, { useState, useEffect, useRef } from 'react';
import { Barcode, X, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInspectProduct: (productName: string, type: 'skin' | 'food') => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onInspectProduct,
}) => {
  const [barcodeInput, setBarcodeInput] = useState('8906087771234');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScannedResult(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.warn('Camera error for barcode:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const handleLookup = async (codeToLookup?: string) => {
    const code = codeToLookup || barcodeInput;
    if (!code) return;
    setIsScanning(true);
    try {
      const res = await fetch('/api/barcode-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: code }),
      });
      const data = await res.json();
      setScannedResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-rose-100 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">In-Store Barcode Scanner</h3>
              <p className="text-xs text-neutral-500">Instant safety ratings while shopping in aisles</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-rose-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative bg-neutral-950 h-64 sm:h-72 flex items-center justify-center overflow-hidden">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

          {/* Barcode Targeting Reticle in Cherry Red */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
            <div className="relative w-72 h-36 rounded-2xl border-2 border-rose-500 shadow-[0_0_50px_rgba(225,29,72,0.4)] flex items-center justify-center">
              <div className="w-full h-0.5 bg-rose-600 shadow-[0_0_12px_rgba(225,29,72,1)] absolute animate-scan-cherry"></div>
              <span className="absolute -top-7 px-3 py-1 rounded-full bg-white/95 border border-rose-300 text-[10px] font-bold text-rose-700 uppercase tracking-wider shadow-xs">
                Align UPC / EAN Barcode
              </span>
            </div>
          </div>
        </div>

        {/* Manual Barcode Input & Presets */}
        <div className="p-6 bg-white space-y-4 border-t border-rose-100">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Enter or Select Store Barcode:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="e.g. 8906087771234"
                className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-xs font-mono focus:outline-none focus:border-rose-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => handleLookup()}
                disabled={isScanning}
                className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-sm active:scale-95 transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Scan Now
              </button>
            </div>
          </div>

          {/* Quick Barcode Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-neutral-500 font-semibold mr-1">Aisle Samples:</span>
            {[
              { label: 'Mamaearth Face Wash', code: '8906087771234' },
              { label: 'Sugary Flakes Cereal', code: '011110853245' },
              { label: 'L\'Oreal HA Serum', code: '3600523821034' },
              { label: 'Ancient Grain Bar', code: '8901030383838' },
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setBarcodeInput(p.code);
                  handleLookup(p.code);
                }}
                className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-rose-50 text-[11px] text-neutral-700 border border-neutral-200 hover:border-rose-200 transition"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Result card if scanned */}
          {scannedResult && (
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 animate-in fade-in space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-700 block tracking-wider">
                    {scannedResult.brand} • {scannedResult.category}
                  </span>
                  <h4 className="font-bold text-neutral-900 text-sm">{scannedResult.productName}</h4>
                </div>

                <div
                  className={`px-3 py-1 rounded-xl text-xs font-black border ${
                    scannedResult.safetyScore >= 75
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : scannedResult.safetyScore >= 50
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                  }`}
                >
                  {scannedResult.safetyScore}/100 Rating
                </div>
              </div>

              {/* Red flags */}
              {scannedResult.redFlags && scannedResult.redFlags.length > 0 && (
                <div>
                  <span className="text-[11px] text-rose-700 font-bold block mb-1">
                    Red-Flagged Ingredients Detected:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {scannedResult.redFlags.map((rf: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-rose-100 border border-rose-300 text-rose-800 text-[10px] font-bold"
                      >
                        {rf}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  stopCamera();
                  onClose();
                  onInspectProduct(scannedResult.productName, scannedResult.type || 'skin');
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-800 hover:to-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                Inspect Full Formulation & View Clean Swaps
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
