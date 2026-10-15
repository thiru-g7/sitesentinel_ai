import React, { useState, useEffect } from 'react';

interface SiteSentinelLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showWordmark?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  subtitle?: string;
  className?: string;
  interactive?: boolean;
  onCustomizeClick?: () => void;
}

export const SiteSentinelLogo: React.FC<SiteSentinelLogoProps> = ({
  size = 'md',
  showWordmark = false,
  showBadge = false,
  badgeText = 'AI OS',
  subtitle,
  className = '',
  interactive = false,
  onCustomizeClick,
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sitesentinel_custom_logo');
      if (stored) {
        setCustomLogoUrl(stored);
      }
    } catch {
      // localStorage may fail in restricted sandboxes
    }

    const handleLogoUpdate = () => {
      try {
        const stored = localStorage.getItem('sitesentinel_custom_logo');
        setCustomLogoUrl(stored || null);
      } catch {}
    };

    window.addEventListener('sitesentinel_logo_change', handleLogoUpdate);
    return () => window.removeEventListener('sitesentinel_logo_change', handleLogoUpdate);
  }, []);

  const sizeDimensions = {
    xs: { icon: 'w-5 h-5', px: 20, text: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 'w-7 h-7', px: 28, text: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 'w-9 h-9', px: 36, text: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 'w-11 h-11', px: 44, text: 'text-lg', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14', px: 56, text: 'text-xl', sub: 'text-xs' },
    '2xl': { icon: 'w-20 h-20', px: 80, text: 'text-2xl', sub: 'text-sm' },
  }[size];

  return (
    <div 
      className={`inline-flex items-center space-x-2.5 select-none ${className}`}
      onClick={onCustomizeClick}
      role={interactive || onCustomizeClick ? 'button' : undefined}
    >
      {/* Emblem Icon / Logo Mark */}
      <div 
        className={`relative ${sizeDimensions.icon} flex-shrink-0 transition-all duration-300 group`}
        title="SiteSentinel AI Logo"
      >
        {customLogoUrl ? (
          <div className="w-full h-full rounded-xl overflow-hidden border border-[#00FF9D]/40 shadow-[0_0_15px_rgba(0,255,157,0.3)] bg-[#04120c] flex items-center justify-center p-1">
            <img 
              src={customLogoUrl} 
              alt="SiteSentinel Custom Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(0,255,157,0.4)]">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <defs>
                {/* Cyber Green Shield Gradient */}
                <linearGradient id="ssGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00FF9D" />
                  <stop offset="45%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>

                {/* Dark Obsidian Tech Body */}
                <linearGradient id="ssShieldDark" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#08281d" />
                  <stop offset="100%" stopColor="#03150e" />
                </linearGradient>

                {/* Eye Aperture Radial Beam */}
                <radialGradient id="ssEyeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="40%" stopColor="#00FF9D" />
                  <stop offset="75%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#04271c" stopOpacity="0" />
                </radialGradient>

                {/* Subtle outer neon filter */}
                <filter id="ssNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Outer Hexagonal Shield Protective Armor */}
              <path
                d="M50 4L88 18V48C88 71.5 71.5 90.5 50 97C28.5 90.5 12 71.5 12 48V18L50 4Z"
                fill="url(#ssShieldDark)"
                stroke="url(#ssGreenGrad)"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Inner White Precision Bevel Lines */}
              <path
                d="M50 11L82 23V47C82 67.5 68 84.5 50 90C32 84.5 18 67.5 18 47V23L50 11Z"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.45"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Horizontal Sentinel Grid Scanline */}
              <line x1="22" y1="48" x2="78" y2="48" stroke="#10B981" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />
              <line x1="50" y1="20" x2="50" y2="76" stroke="#10B981" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />

              {/* Computer Vision Aperture / Radar Sentinel Rings */}
              <circle
                cx="50"
                cy="48"
                r="22"
                stroke="url(#ssGreenGrad)"
                strokeWidth="2.5"
                strokeDasharray="14 5"
              />
              <circle
                cx="50"
                cy="48"
                r="15"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeOpacity="0.8"
              />

              {/* Center AI Optical Core Sensor (White & Neon Green Glow) */}
              <circle cx="50" cy="48" r="8" fill="url(#ssEyeGlow)" filter="url(#ssNeonGlow)" />
              <circle cx="50" cy="48" r="4" fill="#FFFFFF" />

              {/* 4 Precision HUD Targeting Brackets in White & Neon Green */}
              {/* Top-Left */}
              <path d="M42 35H38V39" stroke="#00FF9D" strokeWidth="2" strokeLinecap="round" />
              {/* Top-Right */}
              <path d="M58 35H62V39" stroke="#00FF9D" strokeWidth="2" strokeLinecap="round" />
              {/* Bottom-Left */}
              <path d="M42 61H38V57" stroke="#00FF9D" strokeWidth="2" strokeLinecap="round" />
              {/* Bottom-Right */}
              <path d="M58 61H62V57" stroke="#00FF9D" strokeWidth="2" strokeLinecap="round" />

              {/* Construction Safety Chevron at Shield Crown */}
              <path
                d="M44 16L50 11L56 16"
                stroke="#00FF9D"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M44 21L50 16L56 21"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Optional Wordmark and Typography */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 leading-none">
            <span className={`font-heading font-extrabold tracking-tight text-white ${sizeDimensions.text}`}>
              SiteSentinel <span className="text-[#00FF9D]">AI</span>
            </span>
            {showBadge && (
              <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#00FF9D] border border-[#10B981]/40 font-bold tracking-wider">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <span className={`text-[#A7F3D0] font-sans font-medium mt-0.5 ${sizeDimensions.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export interface LogoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoManagerModal: React.FC<LogoManagerModalProps> = ({ isOpen, onClose }) => {
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem('sitesentinel_custom_logo');
        setCurrentLogo(stored || null);
      } catch {}
      setUrlInput('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 2MB limit. Please select a smaller logo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      try {
        localStorage.setItem('sitesentinel_custom_logo', dataUrl);
        setCurrentLogo(dataUrl);
        window.dispatchEvent(new Event('sitesentinel_logo_change'));
        setErrorMsg('');
      } catch {
        setErrorMsg('Failed to save to local storage.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUrl = () => {
    if (!urlInput.trim()) {
      setErrorMsg('Please enter a valid image URL');
      return;
    }
    try {
      localStorage.setItem('sitesentinel_custom_logo', urlInput.trim());
      setCurrentLogo(urlInput.trim());
      window.dispatchEvent(new Event('sitesentinel_logo_change'));
      setUrlInput('');
      setErrorMsg('');
    } catch {
      setErrorMsg('Failed to store custom logo.');
    }
  };

  const handleResetToDefault = () => {
    try {
      localStorage.removeItem('sitesentinel_custom_logo');
      setCurrentLogo(null);
      window.dispatchEvent(new Event('sitesentinel_logo_change'));
      setErrorMsg('');
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#071f16] border border-[#10B981]/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/20 mb-4">
          <div className="flex items-center space-x-2">
            <SiteSentinelLogo size="sm" />
            <h3 className="font-heading font-bold text-base text-white">Logo Customizer</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#04120c] border border-[#10B981]/30 text-slate-300 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Current Active Logo Preview */}
        <div className="bg-[#04120c] rounded-xl p-4 border border-[#10B981]/25 flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <SiteSentinelLogo size="lg" />
            <div>
              <div className="text-xs font-semibold text-white">
                {currentLogo ? 'Custom User Logo Active' : 'Official SiteSentinel Vector Logo'}
              </div>
              <div className="text-[10px] text-[#A7F3D0]">
                {currentLogo ? 'Applied across entire system' : 'High-tech green and white vector shield'}
              </div>
            </div>
          </div>
          {currentLogo && (
            <button
              onClick={handleResetToDefault}
              className="px-2.5 py-1 text-[11px] rounded bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] hover:bg-[#EF4444]/30 font-medium transition-colors"
            >
              Reset Default
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-lg bg-[#EF4444]/20 border border-[#EF4444]/40 text-xs text-[#EF4444]">
            {errorMsg}
          </div>
        )}

        {/* Upload Custom File */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1.5">
              Upload Custom Logo (PNG, JPG, SVG, WebP)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#10B981] file:text-[#04120c] hover:file:bg-[#00FF9D] cursor-pointer bg-[#04120c] rounded-lg border border-[#10B981]/30 p-1"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-[#A7F3D0]">
            <div className="flex-1 h-px bg-[#10B981]/20"></div>
            <span>OR ENTER URL</span>
            <div className="flex-1 h-px bg-[#10B981]/20"></div>
          </div>

          {/* Enter Logo URL */}
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1.5">
              Logo Image URL
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="https://example.com/logo.png"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-[#04120c] border border-[#10B981]/30 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF9D]"
              />
              <button
                onClick={handleSaveUrl}
                className="px-3 py-1.5 rounded-lg bg-[#10B981] text-[#04120c] text-xs font-bold hover:bg-[#00FF9D] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0a291e] border border-[#10B981]/40 text-xs font-semibold text-white hover:bg-[#10B981]/30 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
