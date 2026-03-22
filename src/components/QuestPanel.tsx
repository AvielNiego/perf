'use client';

import { useState } from 'react';
import { Quest, Lesson } from '@/lib/levels/types';

interface QuestPanelProps {
  quest: Quest;
  isBoss: boolean;
  currentHint: Lesson | null;
  hintsUsed: number;
  maxHints: number;
  onUseHint: () => void;
  timeLimitSeconds?: number;
  elapsedSeconds: number;
  questStepIndex: number;
  onSubmitAnswer: (answer: string) => void;
  wrongAnswer?: boolean;
}

function getQuestionPrompt(
  validation: { type: string; question?: Lesson },
  stepInstruction?: Lesson
): { he: string; en: string } {
  // Use explicit question if provided
  if (validation.question) return validation.question;

  // Generate a generic prompt based on validation type
  switch (validation.type) {
    case 'command_run':
      return {
        he: 'הריצו את הפקודה והזינו את הפלט:',
        en: 'Run the command and enter the output:',
      };
    case 'output_contains':
      return {
        he: 'מה התוצאה? הזינו את התשובה:',
        en: 'What is the result? Enter the answer:',
      };
    case 'file_exists':
      return {
        he: 'מה שם הקובץ שיצרתם?',
        en: 'What is the name of the file you created?',
      };
    case 'answer_match':
    default:
      return {
        he: 'הזינו את התשובה:',
        en: 'Enter the answer:',
      };
  }
}

export default function QuestPanel({
  quest,
  isBoss,
  currentHint,
  hintsUsed,
  maxHints,
  onUseHint,
  timeLimitSeconds,
  elapsedSeconds,
  questStepIndex,
  onSubmitAnswer,
  wrongAnswer,
}: QuestPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const currentStep = quest.validation.steps?.[questStepIndex];
  const remainingTime = timeLimitSeconds ? timeLimitSeconds - elapsedSeconds : null;
  const isTimeWarning = remainingTime !== null && remainingTime < 60;

  const currentValidation = currentStep?.validation || quest.validation;
  const questionPrompt = getQuestionPrompt(currentValidation, currentStep?.instruction);

  const stepLabel = currentStep
    ? `${questStepIndex + 1}/${quest.validation.steps!.length}`
    : null;

  return (
    <div className="bg-[var(--bg-secondary)] border-b border-[var(--bg-tertiary)]">
      {/* Collapsed header — always visible, tap to toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs text-[var(--accent-blue)] shrink-0">
            {expanded ? '\u25BC' : '\u25B6'}
          </span>
          <span className="rtl-content text-sm font-medium truncate">
            {currentStep ? currentStep.instruction.he : quest.description.he}
          </span>
          {stepLabel && (
            <span className="text-xs text-[var(--accent-blue)] shrink-0 bg-[var(--accent-blue)]/10 px-1.5 py-0.5 rounded">
              {stepLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Timer inline */}
          {remainingTime !== null && (
            <span
              className={`text-xs font-mono font-bold ${
                isTimeWarning ? 'text-[var(--accent-red)]' : 'text-[var(--text-secondary)]'
              }`}
            >
              {Math.floor(remainingTime / 60)}:{String(Math.max(0, remainingTime) % 60).padStart(2, '0')}
            </span>
          )}
          {/* Hint button — small icon */}
          {!isBoss && hintsUsed < maxHints && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onUseHint();
              }}
              className="text-base cursor-pointer hover:scale-110 transition-transform"
              title={`Hint (${maxHints - hintsUsed} left)`}
            >
              &#x2753;
            </span>
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-2 space-y-2">
          {/* Quest description */}
          <div className="space-y-0.5">
            <div className="rtl-content text-sm leading-snug">{quest.description.he}</div>
            <div className="ltr-content text-xs text-[var(--text-secondary)] leading-snug">
              {quest.description.en}
            </div>
          </div>

          {/* Current step (for multi-step quests) */}
          {currentStep && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
              <div className="text-xs text-blue-400 mb-1">
                Step {questStepIndex + 1}/{quest.validation.steps!.length}
              </div>
              <div className="rtl-content text-sm">{currentStep.instruction.he}</div>
              <div className="ltr-content text-xs text-[var(--text-secondary)]">
                {currentStep.instruction.en}
              </div>
            </div>
          )}

          {/* Hint display */}
          {currentHint && (
            <div className="bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 rounded-lg p-2">
              <div className="text-xs text-[var(--accent-orange)] mb-1">Hint</div>
              <div className="rtl-content text-sm">{currentHint.he}</div>
              <div className="ltr-content text-xs text-[var(--text-secondary)]">
                {currentHint.en}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Answer input — ALWAYS visible regardless of collapsed/expanded */}
      <div className="px-3 pb-2">
        <div className="text-xs text-[var(--text-secondary)] mb-1 rtl-content">
          {questionPrompt.he}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.target as HTMLFormElement).elements.namedItem(
              'answer'
            ) as HTMLInputElement;
            if (input.value.trim()) {
              onSubmitAnswer(input.value);
              input.value = '';
            }
          }}
        >
          <input
            name="answer"
            type="text"
            placeholder={questionPrompt.en}
            className={`flex-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm
              border outline-none ltr-content transition-colors
              ${
                wrongAnswer
                  ? 'border-[var(--accent-red)] bg-[var(--accent-red)]/10'
                  : 'border-[var(--bg-tertiary)] focus:border-[var(--accent-blue)]'
              }`}
            dir="ltr"
            autoComplete="off"
          />
          <button
            type="submit"
            className="tap-target px-4 py-2 rounded-lg text-sm font-medium
              bg-[var(--accent-green)]/20 text-[var(--accent-green)] border border-[var(--accent-green)]/30
              active:scale-95 transition-all"
          >
            &#x2713;
          </button>
        </form>
        {wrongAnswer && (
          <div className="text-xs text-[var(--accent-red)] mt-1 rtl-content">
            &#x274C; תשובה שגויה, נסו שוב
          </div>
        )}
      </div>
    </div>
  );
}
