// src/components/UndoToast.jsx
import React from "react";

/**
 * UndoToast
 * Props:
 *  - message: text to show
 *  - onUndo: callback when user clicks Undo
 *  - onClose: optional callback for when toast auto-hides
 *  - secondsLeft: number (for UI countdown)
 */
export default function UndoToast({ message = "Action performed", onUndo, onClose, secondsLeft }) {
  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 bottom-6 z-50">
      <div className="flex items-center gap-4 bg-white dark:bg-slate-800 border shadow-md rounded-lg px-4 py-3">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{message}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Undo available for {secondsLeft}s</div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onUndo}
            className="btn btn-sm btn-ghost border rounded-md px-3"
            aria-label="Undo action"
          >
            Undo
          </button>
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost px-2"
            aria-label="Dismiss"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
