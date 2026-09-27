import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getExportUrl } from '../lib/api';
import { downloadFile } from '../lib/download';

export interface ContractExportDropdownProps {
  contractId: string;
  contractName?: string;
  isOffline?: boolean;
}

export const ContractExportDropdown: React.FC<ContractExportDropdownProps> = ({
  contractId,
  contractName,
  isOffline = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<'ics' | 'csv' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleExport = useCallback(
    async (format: 'ics' | 'csv') => {
      if (isDownloading || isOffline) return;

      setIsDownloading(format);
      setError(null);

      const fallbackSlug =
        (contractName || 'contract')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || 'contract';
      const fallbackFilename = `${fallbackSlug}.${format}`;
      const url = getExportUrl(contractId, format);

      try {
        await downloadFile(url, fallbackFilename);
        setIsOpen(false);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Export request failed. Please check network connectivity.';
        setError(message);
      } finally {
        setIsDownloading(null);
      }
    },
    [contractId, contractName, isDownloading, isOffline]
  );

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => !isOffline && setIsOpen((prev) => !prev)}
        disabled={Boolean(isDownloading) || isOffline}
        title={isOffline ? 'Not available in offline demo' : 'Export contract data'}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {isDownloading ? (
          <svg
            className="w-3.5 h-3.5 animate-spin text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}
        <span>{isDownloading ? 'Exporting...' : 'Export'}</span>
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-64 rounded-lg bg-slate-900 border border-slate-700/80 shadow-2xl z-30 p-1.5 divide-y divide-slate-800"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Export Options
          </div>
          <div className="py-1 space-y-0.5">
            {/* Calendar (.ics) option */}
            <button
              type="button"
              onClick={() => handleExport('ics')}
              disabled={Boolean(isDownloading)}
              className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded text-left hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              role="menuitem"
            >
              <div className="mt-0.5 p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 group-hover:text-white group-hover:border-slate-600 shrink-0">
                {isDownloading === 'ics' ? (
                  <svg
                    className="w-4 h-4 animate-spin text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
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
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-200 group-hover:text-white flex items-center justify-between gap-1">
                  <span>Calendar (.ics)</span>
                  {isDownloading === 'ics' && (
                    <span className="text-[10px] font-mono text-slate-400 animate-pulse">
                      Generating...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  Resolved deadlines with 7-day and 1-day reminders
                </p>
              </div>
            </button>

            {/* Spreadsheet (.csv) option */}
            <button
              type="button"
              onClick={() => handleExport('csv')}
              disabled={Boolean(isDownloading)}
              className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded text-left hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              role="menuitem"
            >
              <div className="mt-0.5 p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 group-hover:text-white group-hover:border-slate-600 shrink-0">
                {isDownloading === 'csv' ? (
                  <svg
                    className="w-4 h-4 animate-spin text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
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
                      strokeWidth={1.5}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-200 group-hover:text-white flex items-center justify-between gap-1">
                  <span>Spreadsheet (.csv)</span>
                  {isDownloading === 'csv' && (
                    <span className="text-[10px] font-mono text-slate-400 animate-pulse">
                      Generating...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  All obligations, metadata, risk scores &amp; status
                </p>
              </div>
            </button>
          </div>

          {error && (
            <div className="pt-1.5">
              <div className="p-2 rounded bg-rose-950/70 border border-rose-800 text-[11px] text-rose-300 flex items-start justify-between gap-1.5">
                <span className="leading-snug">{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-rose-400 hover:text-rose-200 shrink-0 font-bold leading-none px-1"
                  aria-label="Dismiss error"
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContractExportDropdown;
