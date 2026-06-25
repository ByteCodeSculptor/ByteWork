import { addOns } from '@/config/site';
import { formatINR } from '@/lib/format';

export default function StepAddOns({ state, dispatch }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900">Optional add-ons</h3>
      <p className="mt-1 text-sm text-gray-500">The standard package is already included — these are extras.</p>

      <div className="mt-4 space-y-3">
        {addOns.map((a) => {
          const qty = state.addOns[a.id] || 0;
          const priceLabel = a.price == null ? 'On request' : `${formatINR(a.price)}/${a.unit}`;

          if (a.type === 'quantity') {
            return (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                <span className="pr-3">
                  <span className="block font-semibold text-gray-900">{a.label}</span>
                  <span className="block text-xs text-gray-500">{a.description} · {priceLabel}</span>
                </span>
                <input
                  type="number"
                  min="0"
                  value={qty}
                  onChange={(e) =>
                    dispatch({ type: 'SET_ADDON', id: a.id, quantity: Math.max(0, parseInt(e.target.value, 10) || 0) })
                  }
                  className="w-20 rounded-lg border border-gray-300 p-2 text-center"
                  aria-label={`${a.label} quantity`}
                />
              </div>
            );
          }

          const on = qty > 0;
          return (
            <label key={a.id} className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4">
              <span className="pr-3">
                <span className="block font-semibold text-gray-900">{a.label}</span>
                <span className="block text-xs text-gray-500">{a.description} · {priceLabel}</span>
              </span>
              <input
                type="checkbox"
                checked={on}
                onChange={(e) => dispatch({ type: 'SET_ADDON', id: a.id, quantity: e.target.checked ? 1 : 0 })}
                className="h-5 w-5"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
