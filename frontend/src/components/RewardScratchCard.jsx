import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const RewardScratchCard = ({ amount, onRedeem, onSkip }) => {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Fill with a nice gradient pattern
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#8b5cf6'); // violet-500
    gradient.addColorStop(1, '#6366f1'); // indigo-500
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some "texture" dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Text on top of scratch area
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2 + 10);
  }, []);

  const handleScratch = (e) => {
    if (isDone) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Get mouse or touch position
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Check percentage scratched
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparentCount++;
    }
    
    const percentage = (transparentCount / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 50 && !isDone) {
      setIsDone(true);
      // Auto reveal everything after 50%
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsScratched(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center group animate-scaleIn">
        
        {/* The Reward Text (Inside) */}
        <div className="text-center p-4">
          <Sparkles className="mx-auto text-white mb-1 animate-bounce" size={24} />
          <h4 className="text-white text-xs font-bold uppercase tracking-widest opacity-80">Reward Unlocked</h4>
          <p className="text-4xl font-black text-white drop-shadow-md">₹{amount}</p>
          <p className="text-white/90 text-sm font-semibold">Discount Applied!</p>
        </div>

        {/* The Scratch Layer */}
        <canvas
          ref={canvasRef}
          width={256}
          height={160}
          onMouseMove={(e) => e.buttons === 1 && handleScratch(e)}
          onTouchMove={handleScratch}
          className={`absolute inset-0 cursor-crosshair transition-opacity duration-500 ${isDone ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />
      </div>

      <div className="mt-8 w-full space-y-3">
        <button
          onClick={onRedeem}
          disabled={!isScratched}
          className={`w-full py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
            isScratched 
              ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98]' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isScratched ? <><CheckCircle2 size={18} /> Redeem Now</> : 'Scratch to Reveal'}
        </button>
        
        <button
          onClick={onSkip}
          className="w-full py-2 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
        >
          No thanks, maybe later
        </button>
      </div>
      
      {!isScratched && (
        <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-tighter animate-pulse">
          Scratch 50% of the surface to reveal
        </p>
      )}
    </div>
  );
};

export default RewardScratchCard;
