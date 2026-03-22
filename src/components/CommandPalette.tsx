'use client';

import { useState } from 'react';

interface CommandPaletteProps {
  commands: string[];
  onInsertText: (text: string) => void;
}

const SPECIAL_CHARS = ['|', '>', '>>', '-', '--', '/', '.', '~', '*', ' ', '\t'];

export default function CommandPalette({
  commands,
  onInsertText,
}: CommandPaletteProps) {
  const [showSpecial, setShowSpecial] = useState(false);

  return (
    <div className="bg-[var(--bg-secondary)] border-t border-[var(--bg-tertiary)] px-2 py-1.5 space-y-1.5">
      {/* Command buttons — single horizontal scrollable row */}
      <div className="flex gap-1.5 overflow-x-auto flex-nowrap scrollbar-hide">
        {commands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => onInsertText(cmd + ' ')}
            className="shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium
              bg-[var(--bg-tertiary)] text-[var(--accent-green)] border border-[var(--bg-tertiary)]
              hover:border-[var(--accent-green)]/50 active:scale-95 transition-all"
          >
            {cmd}
          </button>
        ))}

        {/* Toggle special chars */}
        <button
          onClick={() => setShowSpecial(!showSpecial)}
          className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium
            border transition-all active:scale-95
            ${
              showSpecial
                ? 'bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] border-[var(--accent-purple)]/50'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--bg-tertiary)]'
            }`}
        >
          #!@
        </button>
      </div>

      {/* Special characters row — also horizontal scroll */}
      {showSpecial && (
        <div className="flex gap-1.5 overflow-x-auto flex-nowrap scrollbar-hide">
          {SPECIAL_CHARS.map((char) => (
            <button
              key={char}
              onClick={() => onInsertText(char)}
              className="shrink-0 min-w-[36px] px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold
                bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30
                active:scale-95 transition-all"
            >
              {char === ' ' ? '\u2423' : char === '\t' ? 'TAB' : char}
            </button>
          ))}

          {/* Enter key */}
          <button
            onClick={() => onInsertText('\r')}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold
              bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/30
              active:scale-95 transition-all"
          >
            ENTER
          </button>

          {/* Ctrl+C */}
          <button
            onClick={() => onInsertText('\x03')}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold
              bg-[var(--accent-red)]/10 text-[var(--accent-red)] border border-[var(--accent-red)]/30
              active:scale-95 transition-all"
          >
            Ctrl+C
          </button>
        </div>
      )}
    </div>
  );
}
