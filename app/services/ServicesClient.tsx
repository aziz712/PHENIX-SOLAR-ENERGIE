"use client";

import { motion } from "framer-motion";
import { Check, Sun, Factory, Droplets, Wrench, Battery } from "lucide-react";


export default function ServicesPage() {
    const services = [
        {
            id: "residential",
            title: "Solutions Résidentielles",
            icon: <Sun className="w-12 h-12 text-solar-orange" />,
            description: "Transformez votre toiture en source de revenus et d'économies.",
            features: [
                "Étude de dimensionnement personnalisée",
                "Installation sur toiture inclinée ou terrasse",
                "Systèmes raccordés au réseau STEG",
                "Dossier administratif clé en main",
            ],
            image: "bg-linear-to-br from-solar-yellow/20 to-orange-100",
        },
        {
            id: "industrial",
            title: "Solutions Industrielles",
            icon: <Factory className="w-12 h-12 text-deep-blue" />,
            description: "Optimisez vos coûts énergétiques et réduisez votre empreinte carbone.",
            features: [
                "Installations Moyenne Tension (MT)",
                "Réduction de la facture énergétique jusqu'à 70%",
                "Monitoring et supervision à distance",
                "Retour sur investissement rapide (< 4 ans)",
            ],
            image: "bg-linear-to-br from-deep-blue/10 to-blue-100",
        },
        {
            id: "pumping",
            title: "Pompage Solaire",
            icon: <Droplets className="w-12 h-12 text-eco-green" />,
            description: "L'indépendance énergétique pour votre exploitation agricole.",
            features: [
                "Fonctionnement au fil du soleil sans batteries",
                "Remplacement des groupes électrogènes coûteux",
                "Dimensionnement selon le besoin hydraulique",
                "Systèmes robustes et durables",
            ],
            image: "bg-linear-to-br from-eco-green/10 to-green-100",
        },
        {
            id: "offgrid",
            title: "Sites Isolés (Off-Grid)",
            icon: <Battery className="w-12 h-12 text-electric-blue" />,
            description: "L'électricité partout, même sans réseau STEG.",
            features: [
                "Stockage sur batteries (Gel, Lithium)",
                "Onduleurs hybrides intelligents",
                "Alimentation 24/7",
                "Idéal pour maisons de campagne et zones rurales",
            ],
            image: "bg-linear-to-br from-electric-blue/10 to-cyan-100",
        },
        {
            id: "maintenance",
            title: "Maintenance & SAV",
            icon: <Wrench className="w-12 h-12 text-gray-700" />,
            description: "Garantissez la longévité et la performance de votre installation.",
            features: [
                "Nettoyage des panneaux photovoltaïques",
                "Vérification des onduleurs et câblages",
                "Intervention rapide en cas de panne",
                "Contrats de maintenance annuelle",
            ],
            image: "bg-linear-to-br from-gray-100 to-gray-200",
        },
    ];

    return (
        <div className="bg-background-light min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-deep-blue mb-6"
                    >
                        Nos Services
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Une expertise complète pour tous vos projets solaires, de l'étude à la maintenance.
                    </motion.p>
                </div>

                <div className="space-y-16">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} bg-white rounded-3xl overflow-hidden shadow-xl`}
                        >
                            <div className={`md:w-1/2 p-10 flex flex-col justify-center ${service.image}`}>
                                <div className="bg-white/80 w-24 h-24 rounded-2xl flex items-center justify-center mb-6 shadow-sm backdrop-blur-sm">
                                    {service.icon}
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h2>
                                <p className="text-lg text-gray-700 mb-6 font-medium leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                            <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white border-l border-gray-100">
                                <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider text-solar-orange">
                                    Ce que nous offrons
                                </h3>
                                <ul className="space-y-4">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span className="text-gray-600 text-lg">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
