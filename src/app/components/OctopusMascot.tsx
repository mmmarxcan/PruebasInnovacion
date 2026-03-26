export function OctopusMascot({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
      {/* Pulpo Morado SVG */}
      <div className="relative animate-in zoom-in duration-700">
        <svg
          width="140"
          height="160"
          viewBox="0 0 120 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl hover:scale-105 transition-transform duration-300"
        >
          {/* Cabeza del pulpo */}
          <ellipse cx="60" cy="50" rx="45" ry="40" fill="#7c3aed" />

          {/* Ojos */}
          <circle cx="48" cy="45" r="8" fill="white" />
          <circle cx="72" cy="45" r="8" fill="white" />
          <circle cx="50" cy="45" r="5" fill="#1e293b" />
          <circle cx="74" cy="45" r="5" fill="#1e293b" />

          {/* Brillo en los ojos */}
          <circle cx="51" cy="43" r="2" fill="white" />
          <circle cx="75" cy="43" r="2" fill="white" />

          {/* Sonrisa */}
          <path
            d="M 45 60 Q 60 68 75 60"
            stroke="#1e293b"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tentáculos */}
          {/* Tentáculo 1 */}
          <path
            d="M 30 80 Q 20 100 25 120"
            stroke="#7c3aed"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tentáculo 2 */}
          <path
            d="M 40 85 Q 35 105 40 125"
            stroke="#7c3aed"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tentáculo 3 */}
          <path
            d="M 50 88 Q 50 108 48 130"
            stroke="#8b5cf6"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tentáculo 4 */}
          <path
            d="M 60 88 Q 60 108 62 130"
            stroke="#8b5cf6"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tentáculo 5 */}
          <path
            d="M 70 88 Q 70 108 72 130"
            stroke="#6d28d9"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tentáculo 6 */}
          <path
            d="M 80 85 Q 85 105 80 125"
            stroke="#6d28d9"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tentáculo 7 */}
          <path
            d="M 90 80 Q 100 100 95 120"
            stroke="#6d28d9"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Manchas decorativas */}
          <circle cx="40" cy="35" r="4" fill="#a78bfa" opacity="0.6" />
          <circle cx="80" cy="38" r="3" fill="#a78bfa" opacity="0.6" />
          <circle cx="60" cy="30" r="3" fill="#a78bfa" opacity="0.6" />
        </svg>
      </div>

      {/* Mensaje del pulpo */}
      {message && (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl px-6 py-4 shadow-xl max-w-[280px] relative border-2 border-purple-100 animate-in slide-in-from-top duration-500">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-l-transparent border-r-transparent border-b-white"></div>
          <p className="text-slate-800 text-center leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
}
