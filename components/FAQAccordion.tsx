"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "Quel est le prix d'une installation photovoltaïque en Tunisie ?",
        answer: "Le prix varie selon la puissance (1kWc, 2kWc... 5kWc). En moyenne, une installation résidentielle de 3kWc coûte entre 6 000 et 8 000 DT après subventions. Contactez-nous pour un devis précis."
    },
    {
        question: "Ai-je droit à des subventions de l'État ?",
        answer: "Oui, l'État tunisien via l'ANME finance une partie de votre installation (jusqu'à 500 DT par kWc). Il existe aussi des crédits bancaires bonifiés 'Eco-Prêt'."
    },
    {
        question: "Quelle est la durée de vie des panneaux solaires ?",
        answer: "Les panneaux solaires modernes on une durée de vie supérieure à 30 ans. Nos panneaux sont garantis 25 ans en performance."
    },
    {
        question: "Est-ce que ça fonctionne quand il y a des nuages ?",
        answer: "Oui, les panneaux produisent de l'énergie grâce à la luminosité, même par temps nuageux, bien que la production soit réduite par rapport au plein soleil."
    }
];

export default function FAQAccordion() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {faqs.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none bg-white hover:bg-gray-50 transition-colors"
                    >
                        <h3 className="text-lg font-bold text-deep-blue flex items-center gap-3">
                            <HelpCircle className="w-6 h-6 text-solar-orange shrink-0" />
                            {item.question}
                        </h3>
                        <div className="shrink-0 ml-4">
                            {activeIndex === index ? (
                                <Minus className="w-5 h-5 text-solar-orange" />
                            ) : (
                                <Plus className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </button>

                    <AnimatePresence>
                        {activeIndex === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <div className="px-6 pb-6 pt-0 text-gray-600 ml-9 border-t border-transparent">
                                    <p>{item.answer}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
