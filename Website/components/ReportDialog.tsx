"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  submitting?: boolean;
  title?: string;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void> | void;
};

const QUICK_REASONS = [
  "This post appears to contain manipulated context and needs moderator verification.",
  "This post appears misleading and may spread misinformation.",
  "This post seems abusive or harmful and should be reviewed.",
  "This post looks unrelated to civic issues and should be checked."
];

export default function ReportDialog({ open, submitting = false, title = "Report Post", onClose, onSubmit }: Props) {
  const [reason, setReason] = useState(QUICK_REASONS[0]);

  useEffect(() => {
    if (!open) return;
    setReason(QUICK_REASONS[0]);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    await onSubmit(reason.trim());
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-[1px]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="w-[92vw] max-w-lg max-h-[88vh] overflow-y-auto rounded-3xl border border-pink-100 bg-white p-5 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">Select a reason and submit your report for moderator review.</p>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  {QUICK_REASONS.map((item) => {
                    const active = reason === item;
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setReason(item)}
                        className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                          active
                            ? "border-pink-300 bg-pink-50 text-pink-700"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>

                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  placeholder="Write report reason"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !reason.trim()}
                    className="rounded-xl border border-pink-200 bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
