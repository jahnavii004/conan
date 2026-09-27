import React, { useState } from 'react';
import type { Risk, RiskBand, ObligationOut } from '../types/api';

interface ObligationRiskSectionProps {
  risk: Risk;
  obligationMap?: Map<string, ObligationOut>;
}

function getRiskBadgeClass(band: RiskBand): string {
  switch (band) {
    case 'critical':
      return 'bg-rose-950/80 text-rose-300 border-rose-800';
    case 'high':
      return 'bg-amber-950/80 text-amber-300 border-amber-800';
    case 'medium':
      return 'bg-yellow-950/80 text-yellow-300 border-yellow-800';
    case 'low':
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}

function getProvenanceBadgeClass(provenance: string): string {
  switch (provenance) {
    case 'extracted':
      return 'bg-indigo-950/60 text-indigo-300 border-indigo-800/80';
    case 'user':
      return 'bg-purple-950/60 text-purple-300 border-purple-800/80';
    case 'computed':
    default:
      return 'bg-slate-800 text-slate-400 border-slate-700';
  }
}

export const ObligationRiskSection: React.FC<ObligationRiskSectionProps> = ({
  risk,
  obligationMap,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!risk) return null;

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Risk Assessment
          </h3>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${getRiskBadgeClass(
              risk.band
            )}`}
          >
            {risk.band} ({risk.score}/100)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] text-slate-400 hover:text-slate-200"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Risk attention priority label */}
      {risk.label && (
        <p className="text-[11px] text-slate-400 italic">
          {risk.label}
        </p>
      )}

      {isExpanded && (
        <div className="space-y-2.5">
          {/* Risk Score Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Attention Priority Score</span>
              <span className="font-semibold text-slate-200">{risk.score}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  risk.band === 'critical'
                    ? 'bg-rose-500'
                    : risk.band === 'high'
                    ? 'bg-amber-500'
                    : risk.band === 'medium'
                    ? 'bg-yellow-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, risk.score))}%` }}
              />
            </div>
          </div>

          {/* Risk Factors Breakdown */}
          <div className="space-y-2 pt-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              Contributing Factors ({risk.factors?.length ?? 0})
            </p>

            {(!risk.factors || risk.factors.length === 0) ? (
              <p className="text-xs text-slate-500 italic p-3 rounded-lg border border-slate-800 bg-slate-900/40">
                No specific risk factors flagged for this obligation.
              </p>
            ) : (
              <div className="space-y-2">
                {risk.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-800/90 bg-slate-900/60 space-y-2 text-xs"
                  >
                    {/* Top Row: Factor Name + Points + Provenance */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Point badge */}
                        <span
                          className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] border ${
                            factor.points >= 25
                              ? 'bg-rose-950/70 text-rose-300 border-rose-800'
                              : factor.points >= 15
                              ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                              : factor.points >= 8
                              ? 'bg-yellow-950/70 text-yellow-300 border-yellow-800'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          +{factor.points} pts
                        </span>

                        {/* Factor description */}
                        <span className="font-semibold text-slate-200">
                          {factor.factor}
                        </span>
                      </div>

                      {/* Provenance badge */}
                      {factor.provenance && (
                        <span
                          className={`px-1.5 py-0.2 rounded font-mono text-[9px] uppercase border shrink-0 ${getProvenanceBadgeClass(
                            factor.provenance
                          )}`}
                          title={`Source provenance: ${factor.provenance}`}
                        >
                          {factor.provenance}
                        </span>
                      )}
                    </div>

                    {/* Detail explanation when available */}
                    {factor.detail && (
                      <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-850 leading-relaxed">
                        {factor.detail}
                      </p>
                    )}

                    {/* Dependency Propagation Path when present */}
                    {factor.path && factor.path.length > 0 && (
                      <div className="pt-1.5 pl-2.5 border-l-2 border-indigo-700/60 space-y-2">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-300/90 font-medium">
                          Propagation Chain ({factor.path.length} step{factor.path.length === 1 ? '' : 's'}):
                        </p>

                        <div className="space-y-1.5">
                          {factor.path.map((step, stepIdx) => {
                            const upstreamOb = obligationMap?.get(step.upstream_id);
                            const downstreamOb = obligationMap?.get(step.downstream_id);

                            return (
                              <div
                                key={stepIdx}
                                className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] space-y-1"
                              >
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-semibold text-indigo-300">
                                    {upstreamOb ? upstreamOb.actor : step.upstream_id}
                                  </span>
                                  <span className="font-mono text-amber-400 font-bold text-[10px]">
                                    &rarr; {step.relation.replace(/_/g, ' ')} &rarr;
                                  </span>
                                  <span className="font-semibold text-sky-300">
                                    {downstreamOb ? downstreamOb.actor : step.downstream_id}
                                  </span>

                                  {step.page != null && (
                                    <span className="text-[10px] font-mono text-slate-500 ml-auto">
                                      p. {step.page}
                                    </span>
                                  )}
                                </div>

                                {step.quote && (
                                  <p className="text-[10px] text-slate-400 italic line-clamp-2">
                                    &ldquo;{step.quote}&rdquo;
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ObligationRiskSection;
