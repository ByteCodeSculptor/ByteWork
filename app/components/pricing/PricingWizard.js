'use client';

import { useReducer, useState } from 'react';
import { quoteLink } from '@/lib/whatsapp';
import { wizardReducer, initialState, STEPS, summarizeWizard } from './wizardState';
import PriceSummary from './PriceSummary';
import StepService from './steps/StepService';
import StepDeadline from './steps/StepDeadline';
import StepAddOns from './steps/StepAddOns';
import StepReview from './steps/StepReview';

const STEP_LABELS = ['Service', 'Timeline', 'Add-ons', 'Review'];

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function PricingWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  // Capture "now" once so render stays deterministic across re-renders.
  const [today] = useState(() => new Date());

  const summary = summarizeWizard(state, today);
  const stepKey = STEPS[state.step];
  const isLast = state.step === STEPS.length - 1;
  const minDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  // Block "Continue" only when a deadline is set but invalid (past date).
  const deadlineInvalid = Boolean(state.deadline) && !summary.quote.valid;

  const handleSend = () => {
    const link = quoteLink({
      serviceName: summary.service.shortName,
      deadline: state.deadline || 'Flexible',
      tierLabel: summary.quote.tier ? summary.quote.tier.label : 'Standard',
      price: summary.quote.total,
      addOnLines: summary.addOnLines,
    });
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
      <ol className="flex border-b border-gray-100 bg-gray-50 text-sm">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex-1">
            <button
              type="button"
              onClick={() => dispatch({ type: 'GOTO', step: i })}
              aria-current={i === state.step ? 'step' : undefined}
              className={`w-full px-2 py-3 font-semibold transition ${
                i === state.step ? 'bg-white text-indigo-700' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="hidden sm:inline">{i + 1}. </span>
              {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 p-6 md:grid-cols-5 md:p-8">
        <div className="md:col-span-3">
          {stepKey === 'service' && <StepService state={state} dispatch={dispatch} />}
          {stepKey === 'deadline' && (
            <StepDeadline state={state} dispatch={dispatch} summary={summary} minDate={minDate} invalid={deadlineInvalid} />
          )}
          {stepKey === 'addons' && <StepAddOns state={state} dispatch={dispatch} />}
          {stepKey === 'review' && <StepReview state={state} summary={summary} />}
        </div>
        <div className="md:col-span-2">
          <PriceSummary summary={summary} />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 p-6">
        <button
          type="button"
          onClick={() => dispatch({ type: 'BACK' })}
          disabled={state.step === 0}
          className="rounded-lg px-5 py-2.5 font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={handleSend}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-green-700"
          >
            <span aria-hidden="true">💬</span> Send via WhatsApp
          </button>
        ) : (
          <button
            type="button"
            onClick={() => dispatch({ type: 'NEXT' })}
            disabled={deadlineInvalid}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
