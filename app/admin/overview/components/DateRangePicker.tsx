"use client";

import { useState } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DateRangePickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (start: string, end: string) => void;
    initialStart?: string;
    initialEnd?: string;
}

export default function DateRangePicker({ isOpen, onClose, onSelect, initialStart, initialEnd }: DateRangePickerProps) {
    const [start, setStart] = useState(initialStart || "");
    const [end, setEnd] = useState(initialEnd || "");

    const handleApply = () => {
        if (start && end) {
            onSelect(start, end);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md border border-gray-100"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-deep-blue flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-solar-orange" />
                                Sélectionner une période
                            </h3>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Date de début</label>
                                <input
                                    type="date"
                                    value={start}
                                    onChange={(e) => setStart(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-solar-orange focus:ring-2 focus:ring-solar-orange/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Date de fin</label>
                                <input
                                    type="date"
                                    value={end}
                                    onChange={(e) => setEnd(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-solar-orange focus:ring-2 focus:ring-solar-orange/20 outline-none transition-all"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleApply}
                                    disabled={!start || !end}
                                    className="flex-1 px-4 py-3 bg-deep-blue text-white font-bold rounded-xl hover:bg-solar-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Appliquer
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
