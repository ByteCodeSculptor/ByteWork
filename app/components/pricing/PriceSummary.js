import { formatINR } from '@/lib/format';

/** Live quote breakdown shown alongside the wizard steps. */
export default function PriceSummary({ summary }) {
  const { quote, service } = summary;
  const invalid = !quote.valid;

  return (
    <div className="sticky top-20 rounded-xl border border-gray-100 bg-gray-50 p-6">
      <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500">Estimated Quote</h4>
      <p className="mt-2 text-4xl font-extrabold text-gray-900">{invalid ? '—' : formatINR(quote.total)}</p>

      <dl className="mt-4 space-y-1 text-sm text-gray-600">
        <div className="flex justify-between">
          <dt>{service.shortName}</dt>
          <dd>{formatINR(service.basePrice)}</dd>
        </div>
        {quote.valid && quote.surcharge > 0 && (
          <div className="flex justify-between text-red-600">
            <dt>{quote.tier.label} {quote.tier.surchargeLabel}</dt>
            <dd>+{formatINR(quote.surcharge)}</dd>
          </div>
        )}
        {summary.addOnTotal > 0 && (
          <div className="flex justify-between">
            <dt>Add-ons</dt>
            <dd>+{formatINR(summary.addOnTotal)}</dd>
          </div>
        )}
      </dl>

      {invalid && <p className="mt-3 text-xs font-semibold text-red-600">Choose a future deadline to see your quote.</p>}
    </div>
  );
}
