import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContractAnalysis } from '../hooks/useContract';
import type {
  ObligationOut,
  Party,
  RiskBand,
  ObligationStatus,
  ReviewState,
  Modality,
} from '../types/api';

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getRiskBadgeClass(band: RiskBand): string {
  switch (band) {
    case 'critical':
      return 'bg-rose-950/70 text-rose-300 border-rose-800';
    case 'high':
      return 'bg-amber-950/70 text-amber-300 border-amber-800';
    case 'medium':
      return 'bg-yellow-950/70 text-yellow-300 border-yellow-800';
    case 'low':
      return 'bg-emerald-950/70 text-emerald-300 border-emerald-800';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}

function getReviewStateBadgeClass(state: ReviewState): string {
  switch (state) {
    case 'confirmed':
      return 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
    case 'edited':
      return 'bg-sky-950/60 text-sky-300 border-sky-800';
    case 'rejected':
      return 'bg-rose-950/60 text-rose-300 border-rose-800';
    case 'proposed':
    default:
      return 'bg-slate-800 text-slate-400 border-slate-700';
  }
}

function getStatusBadgeClass(status: ObligationStatus): string {
  switch (status) {
    case 'done':
      return 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
    case 'blocked':
      return 'bg-rose-950/60 text-rose-300 border-rose-800';
    case 'waived':
      return 'bg-slate-800 text-slate-400 border-slate-700';
    case 'open':
    default:
      return 'bg-blue-950/60 text-blue-300 border-blue-800';
  }
}

function getModalityBadgeClass(modality: Modality): string {
  switch (modality) {
    case 'must':
      return 'bg-sky-950/60 text-sky-300 border-sky-800';
    case 'must_not':
      return 'bg-rose-950/60 text-rose-300 border-rose-800';
    case 'may':
      return 'bg-slate-800 text-slate-400 border-slate-700';
  }
}

export const ContractDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const contractId = id?.trim();

  const {
    data: analysis,
    isLoading,
    isError,
    error,
    refetch,
  } = useContractAnalysis(contractId);

  // Table filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskBandFilter, setRiskBandFilter] = useState('ALL');
  const [reviewStateFilter, setReviewStateFilter] = useState('ALL');

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setRiskBandFilter('ALL');
    setReviewStateFilter('ALL');
  };

  const isFilterActive =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    riskBandFilter !== 'ALL' ||
    reviewStateFilter !== 'ALL';

  // Derived filter options from actual obligations returned by the backend
  const availableCategories = useMemo(() => {
    if (!analysis?.obligations) return [];
    const set = new Set<string>();
    analysis.obligations.forEach((o) => {
      if (o.category) set.add(o.category);
    });
    return Array.from(set).sort();
  }, [analysis?.obligations]);

  const availableStatuses = useMemo(() => {
    if (!analysis?.obligations) return [];
    const set = new Set<string>();
    analysis.obligations.forEach((o) => {
      if (o.status) set.add(o.status);
    });
    return Array.from(set).sort();
  }, [analysis?.obligations]);

  const availableRiskBands = useMemo(() => {
    if (!analysis?.obligations) return [];
    const set = new Set<string>();
    analysis.obligations.forEach((o) => {
      if (o.risk?.band) set.add(o.risk.band);
    });
    const order: Record<string, number> = {
      critical: 1,
      high: 2,
      medium: 3,
      low: 4,
    };
    return Array.from(set).sort((a, b) => (order[a] ?? 99) - (order[b] ?? 99));
  }, [analysis?.obligations]);

  const availableReviewStates = useMemo(() => {
    if (!analysis?.obligations) return [];
    const set = new Set<string>();
    analysis.obligations.forEach((o) => {
      if (o.review_state) set.add(o.review_state);
    });
    return Array.from(set).sort();
  }, [analysis?.obligations]);

  // Frontend-only filtered obligations
  const filteredObligations = useMemo(() => {
    if (!analysis?.obligations) return [];
    const query = searchQuery.trim().toLowerCase();

    return analysis.obligations.filter((ob: ObligationOut) => {
      // 1. Search filter across: actor, counterparty, action, object, category, evidence_quote
      if (query) {
        const matchActor = ob.actor?.toLowerCase().includes(query) ?? false;
        const matchCounterparty =
          ob.counterparty?.toLowerCase().includes(query) ?? false;
        const matchAction = ob.action?.toLowerCase().includes(query) ?? false;
        const matchObject = ob.object?.toLowerCase().includes(query) ?? false;
        const matchCategory = ob.category?.toLowerCase().includes(query) ?? false;
        const matchEvidence =
          ob.evidence_quote?.toLowerCase().includes(query) ?? false;

        if (
          !matchActor &&
          !matchCounterparty &&
          !matchAction &&
          !matchObject &&
          !matchCategory &&
          !matchEvidence
        ) {
          return false;
        }
      }

      // 2. Category filter
      if (categoryFilter !== 'ALL' && ob.category !== categoryFilter) {
        return false;
      }

      // 3. Status filter
      if (statusFilter !== 'ALL' && ob.status !== statusFilter) {
        return false;
      }

      // 4. Risk band filter
      if (riskBandFilter !== 'ALL' && ob.risk?.band !== riskBandFilter) {
        return false;
      }

      // 5. Review state filter
      if (
        reviewStateFilter !== 'ALL' &&
        ob.review_state !== reviewStateFilter
      ) {
        return false;
      }

      return true;
    });
  }, [
    analysis?.obligations,
    searchQuery,
    categoryFilter,
    statusFilter,
    riskBandFilter,
    reviewStateFilter,
  ]);

  // 1. Missing Route ID state
  if (!contractId) {
    return (
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-16">
        <div className="p-8 rounded-xl border border-rose-800/80 bg-rose-950/40 text-center space-y-4">
          <div className="w-12 h-12 rounded-lg bg-rose-900/60 border border-rose-700/80 flex items-center justify-center mx-auto text-rose-300">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-rose-100">
            Missing Contract Identifier
          </h2>
          <p className="text-sm text-rose-300 max-w-md mx-auto">
            No valid contract ID was found in the route. Please check the URL or upload a new contract.
          </p>
          <div className="pt-2">
            <Link
              to="/upload"
              className="inline-flex items-center px-4 py-2 rounded-md bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs transition-colors"
            >
              Go to Upload
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Loading state with Conan branding
  if (isLoading) {
    return (
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 shadow-lg">
          <div className="w-6 h-6 border-2 border-slate-600 border-t-white rounded-full animate-spin" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Conan Intelligence
          </span>
          <h2 className="text-lg font-semibold text-white">
            Loading Contract Analysis...
          </h2>
          <p className="text-xs text-slate-400 max-w-sm">
            Retrieving verified obligations, dependency links, and risk scores.
          </p>
        </div>
      </div>
    );
  }

  // 3. Error state with recovery actions
  if (isError || !analysis) {
    return (
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-16">
        <div className="p-6 rounded-xl border border-rose-800/80 bg-rose-950/40 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-rose-900/60 border border-rose-700/80 flex items-center justify-center shrink-0 text-rose-300">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-rose-100">
                Failed to Load Contract Analysis
              </h2>
              <p className="text-xs text-rose-200">
                {error?.message || 'Could not retrieve analysis data for this contract from the backend.'}
              </p>
              <p className="text-[11px] text-slate-400 pt-1 font-mono">
                Contract ID: <span className="text-slate-300">{contractId}</span>
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-rose-900/60 flex items-center space-x-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="px-3.5 py-1.5 rounded bg-rose-900/80 hover:bg-rose-900 text-xs font-medium text-white transition-colors"
            >
              Retry
            </button>
            <Link
              to="/upload"
              className="px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              Back to Upload
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Successful state: extract data
  const { contract, stats, obligations, as_of, disclaimer } = analysis;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/upload"
          className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="mr-1">&larr;</span> Back to Upload
        </Link>
        <span className="text-xs font-mono text-slate-500">
          Pipeline v{contract.pipeline_version}
        </span>
      </div>

      {/* Contract Header */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {contract.name || 'Untitled Contract'}
              </h1>
              {contract.is_sample && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-purple-950/70 text-purple-300 border border-purple-800">
                  Sample Contract
                </span>
              )}
            </div>

            {contract.filename && (
              <p className="text-xs font-mono text-slate-400">
                Source File: {contract.filename}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
              <span>
                Contract ID: <span className="font-mono text-slate-300">{contract.id}</span>
              </span>
              <span>•</span>
              <span>{contract.page_count} pages</span>
              <span>•</span>
              <span>Analyzed as of: {formatDate(as_of)}</span>
            </div>
          </div>

          <Link
            to="/upload"
            className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors shrink-0 text-center"
          >
            Upload Another
          </Link>
        </div>

        {/* Identified Parties */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Identified Parties
          </span>
          {contract.parties && contract.parties.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {contract.parties.map((party: Party, idx: number) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-xs text-slate-200 flex items-center space-x-1.5"
                >
                  <span className="font-medium">{party.name}</span>
                  {party.role && (
                    <span className="text-[11px] font-mono text-slate-400">
                      ({party.role})
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No parties identified in this contract.
            </p>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      {stats ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Obligations
              </span>
              <p className="text-2xl font-bold text-white font-mono">
                {stats.obligations}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Clauses
              </span>
              <p className="text-2xl font-bold text-white font-mono">
                {stats.clauses}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Needs Review
              </span>
              <p className="text-2xl font-bold text-amber-400 font-mono">
                {stats.needs_review}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Unresolved Dates
              </span>
              <p className="text-2xl font-bold text-slate-300 font-mono">
                {stats.unresolved_dates}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Clauses w/o Ob.
              </span>
              <p className="text-2xl font-bold text-slate-400 font-mono">
                {stats.clauses_without_obligations}
              </p>
            </div>
          </div>

          {/* Stats Warnings if any */}
          {stats.warnings && stats.warnings.length > 0 && (
            <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-900/60 text-xs text-amber-300 space-y-1">
              <span className="font-semibold block text-amber-200">
                Analysis Warnings ({stats.warnings.length})
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {stats.warnings.map((w: string, idx: number) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-500 italic">
          No statistics available for this analysis.
        </div>
      )}

      {/* Obligations Section */}
      <div className="space-y-4">
        {/* Section Header with "X of Y obligations" display */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-0.5">
            <h2 className="text-lg font-semibold text-white">
              Contract Obligations
            </h2>
            <p className="text-xs text-slate-400">
              Extracted operational commitments, modalities, and risk levels
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-auto">
            {filteredObligations.length} of {obligations.length} obligations
          </span>
        </div>

        {obligations.length === 0 ? (
          <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-2">
            <p className="text-sm font-medium text-slate-300">
              No obligations extracted
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No operational commitments were extracted from this document, or extraction yielded zero results.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                {/* Search Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by actor, counterparty, action, object, category, or evidence quote..."
                    className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-800/90 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300 text-xs"
                      aria-label="Clear search input"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Clear Filters Button (When any filter/search is active) */}
                {isFilterActive && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap self-start md:self-auto"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* Dropdown Filters Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/60">
                {/* Category Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono capitalize"
                  >
                    <option value="ALL">All Categories</option>
                    {availableCategories.map((cat: string) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono capitalize"
                  >
                    <option value="ALL">All Statuses</option>
                    {availableStatuses.map((st: string) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Risk Band Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Risk Band
                  </label>
                  <select
                    value={riskBandFilter}
                    onChange={(e) => setRiskBandFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono capitalize"
                  >
                    <option value="ALL">All Risk Bands</option>
                    {availableRiskBands.map((band: string) => (
                      <option key={band} value={band}>
                        {band}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Review State Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Review State
                  </label>
                  <select
                    value={reviewStateFilter}
                    onChange={(e) => setReviewStateFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono capitalize"
                  >
                    <option value="ALL">All Review States</option>
                    {availableReviewStates.map((rs: string) => (
                      <option key={rs} value={rs}>
                        {rs}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Filtered Empty State vs Table */}
            {filteredObligations.length === 0 ? (
              <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-200">
                    No obligations match the current filters.
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your search keywords or reset the dropdown filters to show matching obligations.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-850 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      <th scope="col" className="px-4 py-3 min-w-[140px]">Actor</th>
                      <th scope="col" className="px-4 py-3 min-w-[200px]">Action & Object</th>
                      <th scope="col" className="px-4 py-3 min-w-[120px]">Category & Modality</th>
                      <th scope="col" className="px-4 py-3 min-w-[120px]">Due Date</th>
                      <th scope="col" className="px-4 py-3 min-w-[110px]">Risk</th>
                      <th scope="col" className="px-4 py-3 min-w-[100px]">Review</th>
                      <th scope="col" className="px-4 py-3 min-w-[90px]">Status</th>
                      <th scope="col" className="px-4 py-3 min-w-[200px]">Evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredObligations.map((ob: ObligationOut) => (
                      <tr key={ob.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Actor */}
                        <td className="px-4 py-3.5 align-top">
                          <span className="font-semibold text-slate-200 block">
                            {ob.actor || '—'}
                          </span>
                          {ob.counterparty && (
                            <span className="text-[11px] text-slate-400 block">
                              to {ob.counterparty}
                            </span>
                          )}
                        </td>

                        {/* Action & Object */}
                        <td className="px-4 py-3.5 align-top">
                          <p className="text-slate-100 font-medium leading-relaxed">
                            {ob.action}
                            {ob.object ? ` ${ob.object}` : ''}
                          </p>
                          {ob.is_conditional && ob.condition_text && (
                            <p className="text-[11px] text-slate-400 mt-1 italic">
                              Condition: {ob.condition_text}
                            </p>
                          )}
                        </td>

                        {/* Category & Modality */}
                        <td className="px-4 py-3.5 align-top space-y-1">
                          <div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                              {ob.category}
                            </span>
                          </div>
                          <div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${getModalityBadgeClass(
                                ob.modality
                              )}`}
                            >
                              {ob.modality}
                            </span>
                          </div>
                        </td>

                        {/* Due Date & Resolution */}
                        <td className="px-4 py-3.5 align-top space-y-0.5 font-mono">
                          <span className="text-slate-200 block text-[11px]">
                            {formatDate(ob.due_date)}
                          </span>
                          {ob.resolution_status && ob.resolution_status !== 'resolved' && (
                            <span className="text-[10px] text-amber-400/90 block capitalize">
                              {ob.resolution_status.replace(/_/g, ' ')}
                            </span>
                          )}
                        </td>

                        {/* Risk */}
                        <td className="px-4 py-3.5 align-top">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase font-medium border ${getRiskBadgeClass(
                                ob.risk.band
                              )}`}
                            >
                              {ob.risk.band} ({ob.risk.score})
                            </span>
                            {ob.risk.label && (
                              <span className="text-[11px] text-slate-400 block leading-tight">
                                {ob.risk.label}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Review State */}
                        <td className="px-4 py-3.5 align-top space-y-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono capitalize border ${getReviewStateBadgeClass(
                              ob.review_state
                            )}`}
                          >
                            {ob.review_state}
                          </span>
                          {ob.needs_review && (
                            <span className="block text-[10px] text-amber-400 font-medium">
                              Review Needed
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 align-top">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono capitalize border ${getStatusBadgeClass(
                              ob.status
                            )}`}
                          >
                            {ob.status}
                          </span>
                        </td>

                        {/* Evidence Indicator */}
                        <td className="px-4 py-3.5 align-top">
                          {ob.evidence_quote ? (
                            <div className="space-y-1 max-w-xs">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                                    ob.evidence_status === 'verified'
                                      ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80'
                                      : 'bg-amber-950/50 text-amber-300 border-amber-800/80'
                                  }`}
                                >
                                  {ob.evidence_status === 'verified'
                                    ? '✓ Verified'
                                    : '⚠ Unverified'}
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">
                                  p. {ob.page_start}
                                  {ob.page_end && ob.page_end !== ob.page_start
                                    ? `–${ob.page_end}`
                                    : ''}
                                  {ob.page_approx ? ' (approx)' : ''}
                                </span>
                              </div>
                              <p
                                className="text-xs text-slate-400 italic line-clamp-2"
                                title={ob.evidence_quote}
                              >
                                &ldquo;{ob.evidence_quote}&rdquo;
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 italic">
                              No quote linked
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Backend Legal/Operational Disclaimer */}
      {disclaimer && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
          <span className="font-semibold text-slate-300 block">Notice</span>
          <p className="leading-relaxed">{disclaimer}</p>
        </div>
      )}
    </div>
  );
};

export default ContractDetailPage;
