"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">

          {/* BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MODAL */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-3xl p-6 w-[320px] shadow-xl text-center"
          >
            <h3 className="text-lg font-semibold mb-2">{title}</h3>

            <p className="text-sm text-gray-500 mb-6">{description}</p>

            <div className="flex gap-2">

              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-full font-medium bg-[#EDEAEA] hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-2 rounded-full bg-[#C9151B] text-white hover:bg-[#A80B10]"
              >
                Delete
              </button>

            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}