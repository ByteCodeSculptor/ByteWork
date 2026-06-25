import { services } from '@/config/site';
import { formatINR } from '@/lib/format';

export default function StepService({ state, dispatch }) {
  return (
    <fieldset>
      <legend className="text-lg font-bold text-gray-900">Choose your domain</legend>
      <p className="mt-1 text-sm text-gray-500">Pick the service you need built.</p>

      <div className="mt-4 space-y-3">
        {services.map((s) => {
          const selected = state.serviceId === s.id;
          return (
            <label
              key={s.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                selected
                  ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="service"
                value={s.id}
                checked={selected}
                onChange={() => dispatch({ type: 'SET_SERVICE', serviceId: s.id })}
                className="sr-only"
              />
              <span className="text-2xl" aria-hidden="true">{s.icon}</span>
              <span className="flex-1">
                <span className="block font-semibold text-gray-900">{s.shortName}</span>
                <span className="block text-xs text-gray-500">{s.tech}</span>
              </span>
              <span className="font-bold text-gray-900">{formatINR(s.basePrice)}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
