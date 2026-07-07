"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Globe, Award } from "lucide-react";


export default function AboutPage() {
    return (
        <div className="bg-background-light min-h-screen">
            {/* Hero Section */}
            <section className="bg-deep-blue py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-solar-yellow/5 pattern-dots" />
                <div className="relative max-w-4xl mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Qui Sommes-Nous ?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-300"
                    >
                        PHOENIX SOLAR ENERGY est votre expert en solutions photovoltaïques en Tunisie.
                        Nous nous engageons pour une transition énergétique durable et accessible.
                    </motion.p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Placeholder for About Image */}
                        <div
                            className="rounded-3xl overflow-hidden shadow-2xl h-96 bg-cover bg-center relative"
                            style={{ backgroundImage: "url('/about.png')" }}
                        >
                            <div className="absolute inset-0 bg-linear-to-tr from-deep-blue/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-4 rounded-xl">
                                <p className="font-bold text-deep-blue">Depuis 2010</p>
                                <p className="text-gray-600 text-sm">Au service de l'énergie verte en Tunisie</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-deep-blue mb-6">Notre Mission</h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            Chez PHOENIX SOLAR ENERGY, notre mission est simple : <strong>démocratiser l'accès à l'énergie solaire</strong> pour tous les Tunisiens.
                            Nous croyons que chaque toit a le potentiel de devenir une centrale d'énergie propre.
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Nous accompagnons nos clients de l'étude de faisabilité jusqu'à la mise en service, en garantissant
                            la qualité, la sécurité et la rentabilité de chaque installation.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-8 h-8 text-eco-green" />
                                <span className="font-semibold text-gray-800">Garantie 25 ans</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="w-8 h-8 text-solar-orange" />
                                <span className="font-semibold text-gray-800">Équipe Certifiée</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="w-8 h-8 text-electric-blue" />
                                <span className="font-semibold text-gray-800">Couverture Nationale</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Award className="w-8 h-8 text-solar-yellow" />
                                <span className="font-semibold text-gray-800">Qualité Premium</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats/Timeline Bar */}
            <section className="bg-white py-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-12">Nos Valeurs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-gray-50 rounded-2xl">
                            <h3 className="text-xl font-bold text-deep-blue mb-3">Innovation</h3>
                            <p className="text-gray-600">Nous utilisons les dernières technologies photovoltaïques pour maximiser votre rendement.</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-2xl">
                            <h3 className="text-xl font-bold text-deep-blue mb-3">Transparence</h3>
                            <p className="text-gray-600">Des devis clairs, sans coûts cachés, et un suivi rigoureux de votre projet.</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-2xl">
                            <h3 className="text-xl font-bold text-deep-blue mb-3">Engagement</h3>
                            <p className="text-gray-600">Un service après-vente réactif pour assurer la pérennité de votre installation.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
