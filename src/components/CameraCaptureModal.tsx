import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Upload, Sparkles, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  title?: string;
  subtitle?: string;
  guideMode?: 'face' | 'label';
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Live Camera Scanner',
  subtitle = 'Position within frame for high-accuracy AI ingredient analysis',
  guideMode = 'label',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsLoading(true);
    setCameraError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: guideMode === 'face' ? 'user' : facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access unavailable or blocked. You can upload a photo directly instead.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      onCapture(base64);
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        stopCamera();
        onCapture(reader.result);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-rose-100 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">{title}</h3>
              <p className="text-xs text-neutral-500">{subtitle}</p>
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

        {/* Viewport Area */}
        <div className="relative bg-neutral-950 h-80 sm:h-96 flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-md bg-white rounded-2xl m-4 border border-rose-200 shadow-lg">
              <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
              <p className="text-sm text-neutral-700 mb-4">{cameraError}</p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-medium text-sm transition shadow-md shadow-rose-900/20">
                <Upload className="w-4 h-4" />
                Select Photo From Device
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Overlays with Cherry Red styling */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                {guideMode === 'face' ? (
                  <div className="relative w-64 h-80 rounded-[50%] border-2 border-dashed border-rose-500 shadow-[0_0_50px_rgba(225,29,72,0.35)] flex items-center justify-center">
                    <div className="absolute -top-7 px-3 py-1 rounded-full bg-white/95 border border-rose-300 text-[11px] font-bold text-rose-700 shadow-xs">
                      Align Face in Oval
                    </div>
                    <div className="w-full h-0.5 bg-rose-500 shadow-md absolute animate-scan-cherry"></div>
                  </div>
                ) : (
                  <div className="relative w-full max-w-xs h-64 rounded-2xl border-2 border-rose-500 shadow-[0_0_40px_rgba(225,29,72,0.35)] flex items-center justify-center">
                    <div className="absolute -top-7 px-3 py-1 rounded-full bg-white/95 border border-rose-300 text-[11px] font-bold text-rose-700 shadow-xs">
                      Align Ingredients Label
                    </div>
                    <div className="w-full h-0.5 bg-rose-500 shadow-md absolute animate-scan-cherry"></div>
                    {/* Corner marks in Cherry Red */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-rose-500"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-rose-500"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-rose-500"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-rose-500"></div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="px-6 py-4 bg-white flex items-center justify-between gap-4 border-t border-rose-100">
          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-rose-50 text-neutral-700 text-xs font-semibold transition border border-neutral-200 hover:border-rose-200">
            <Upload className="w-4 h-4 text-rose-600" />
            Upload File
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {!cameraError && (
            <button
              onClick={takeSnapshot}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-800 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 flex items-center gap-2 active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              Capture & Analyze
            </button>
          )}

          {!cameraError && guideMode !== 'face' && (
            <button
              onClick={() =>
                setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
              }
              className="p-2.5 rounded-xl bg-neutral-100 hover:bg-rose-50 text-neutral-700 border border-neutral-200 transition"
              title="Flip camera"
            >
              <RefreshCw className="w-4 h-4 text-rose-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
