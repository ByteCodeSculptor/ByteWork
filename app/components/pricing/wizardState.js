import { services, addOns, pricingTiers, currency } from '@/config/site';
import { daysBetween, calculateQuote } from '@/lib/pricing';

/** Ordered wizard steps. */
export const STEPS = ['service', 'deadline', 'addons', 'review'];

export const initialState = {
  step: 0,
  serviceId: services[0].id,
  deadline: '',
  addOns: {}, // { [addOnId]: quantity }  (toggles use 0/1)
};

const clamp = (n, lo, hi) => Math.max(lo, Math.min(n, hi));

/** Pure reducer driving the multi-step wizard. */
export function wizardReducer(state, action) {
  switch (action.type) {
    case 'NEXT':
      return { ...state, step: clamp(state.step + 1, 0, STEPS.length - 1) };
    case 'BACK':
      return { ...state, step: clamp(state.step - 1, 0, STEPS.length - 1) };
    case 'GOTO':
      return { ...state, step: clamp(action.step, 0, STEPS.length - 1) };
    case 'SET_SERVICE':
      return { ...state, serviceId: action.serviceId };
    case 'SET_DEADLINE':
      return { ...state, deadline: action.deadline };
    case 'SET_ADDON':
      return { ...state, addOns: { ...state.addOns, [action.id]: action.quantity } };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

/**
 * Derive everything the UI / WhatsApp message needs from wizard state.
 * `today` is injectable for deterministic tests.
 */
export function summarizeWizard(state, today = new Date()) {
  const service = services.find((s) => s.id === state.serviceId) ?? services[0];
  const diffDays = state.deadline
    ? daysBetween(today, new Date(`${state.deadline}T00:00:00`))
    : null;

  let addOnTotal = 0;
  const addOnLines = [];
  for (const def of addOns) {
    const qty = state.addOns[def.id] || 0;
    if (!qty) continue;
    if (def.price == null) {
      addOnLines.push(`${def.label} (on request)`);
    } else if (def.type === 'quantity') {
      const line = def.price * qty;
      addOnTotal += line;
      addOnLines.push(`${def.label} ×${qty} (${currency.symbol}${line})`);
    } else {
      addOnTotal += def.price;
      addOnLines.push(`${def.label} (from ${currency.symbol}${def.price})`);
    }
  }

  const quote = calculateQuote({ basePrice: service.basePrice, diffDays, addOnTotal, tiers: pricingTiers });
  return { service, diffDays, quote, addOnTotal, addOnLines };
}
