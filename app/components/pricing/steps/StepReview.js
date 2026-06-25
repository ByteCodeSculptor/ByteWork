export default function StepReview({ state, summary }) {
  const { quote } = summary;

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900">Review &amp; send</h3>
      <p className="mt-1 text-sm text-gray-500">We&apos;ll open WhatsApp with this summary pre-filled.</p>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Service</dt>
          <dd className="font-semibold text-gray-900">{summary.service.shortName}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Deadline</dt>
          <dd className="font-semibold text-gray-900">{state.deadline || 'Flexible'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Urgency</dt>
          <dd className="font-semibold text-gray-900">{quote.tier ? quote.tier.label : '—'}</dd>
        </div>
        {summary.addOnLines.length > 0 && (
          <div>
            <dt className="text-gray-500">Add-ons</dt>
            <dd className="mt-1">
              <ul className="list-disc pl-5 text-gray-700">
                {summary.addOnLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
