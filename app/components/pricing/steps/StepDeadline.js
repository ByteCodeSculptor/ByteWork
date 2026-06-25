export default function StepDeadline({ state, dispatch, summary, minDate, invalid }) {
  const { tier } = summary.quote;

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900">When do you need it?</h3>
      <p className="mt-1 text-sm text-gray-500">Deadlines under 7 days add an express surcharge.</p>

      <input
        type="date"
        min={minDate}
        value={state.deadline}
        onChange={(e) => dispatch({ type: 'SET_DEADLINE', deadline: e.target.value })}
        className="mt-4 block w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:ring-indigo-500"
      />

      {invalid && <p className="mt-2 text-sm font-semibold text-red-600">Please choose a future date.</p>}

      {!invalid && state.deadline && tier && (
        <p
          className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-bold ${
            tier.id === 'standard' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {tier.label} tier {tier.surchargeLabel}
        </p>
      )}

      {!state.deadline && <p className="mt-3 text-sm text-gray-500">No deadline yet → standard pricing.</p>}
    </div>
  );
}
