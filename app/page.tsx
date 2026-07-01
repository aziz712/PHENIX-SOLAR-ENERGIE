"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Home, Factory, Sprout, MapPin, BadgeCheck, Phone, HelpCircle, Sun, ShieldCheck } from "lucide-react";
import FAQAccordion from "@/components/FAQAccordion";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-deep-blue">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/video-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/background-video.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>

        <div className="relative z-20 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 px-4 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-solar-yellow font-semibold text-sm"
          >
            Leader du Photovoltaïque en Tunisie
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight"
          >
            Installation de Panneaux <br className="hidden md:block" />
            <span className="text-solar-yellow">Photovoltaïques</span> en Tunisie
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light"
          >
            Réduisez votre facture STEG jusqu'à 100%. Solutions solaires clés en main pour particuliers, entreprises et agriculteurs à Sousse, Tunis, Sfax et toute la Tunisie.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/request"
              className="w-full sm:w-auto px-8 py-4 bg-solar-yellow text-deep-blue text-lg font-bold rounded-full shadow-xl shadow-solar-yellow/20 hover:bg-solar-orange hover:text-white transition-all transform hover:-translate-y-1"
            >
              Demander un devis gratuit
            </Link>
            <Link
              href="/realisations"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white text-lg font-bold rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              Voir nos projets <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            {[
              { value: "500+", label: "Projets Réalisés", color: "text-deep-blue", icon: <Sun className="w-8 h-8 mb-2 mx-auto text-deep-blue" /> },
              { value: "24/24", label: "Gouvernorats Couverts", color: "text-solar-orange", icon: <MapPin className="w-8 h-8 mb-2 mx-auto text-solar-orange" /> },
              { value: "100%", label: "Conformité STEG", color: "text-eco-green", icon: <BadgeCheck className="w-8 h-8 mb-2 mx-auto text-eco-green" /> },
              { value: "25 Ans", label: "Garantie Panneaux", color: "text-electric-blue", icon: <ShieldCheck className="w-8 h-8 mb-2 mx-auto text-electric-blue" /> },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-4 cursor-pointer group"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  {stat.icon}
                </motion.div>
                <div className={`text-4xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide group-hover:text-gray-900 transition-colors">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Block 1: The "Why" */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="py-20 relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/why-solar-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-deep-blue/80 backdrop-blur-[2px]"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-solar-yellow font-bold uppercase tracking-wider text-sm">Transition Énergétique</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-2 mb-6">Pourquoi choisir l'énergie solaire en Tunisie ?</h2>
            <div className="w-24 h-1 bg-solar-yellow mx-auto rounded-full"></div>
          </div>

          <div className="prose prose-lg text-gray-100 mx-auto">
            <p className="lead text-xl text-center mb-10 text-gray-100">
              Avec plus de <strong>3000 heures d'ensoleillement par an</strong>, la Tunisie est l'un des pays les plus propices à l'énergie photovoltaïque au monde. Investir dans des panneaux solaires n'est pas seulement un geste écologique, c'est une décision financière stratégique.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-10">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                  <BadgeCheck className="w-6 h-6 text-solar-yellow" /> Réduisez votre facture STEG
                </h3>
                <p className="text-gray-200">
                  Fini les augmentations tarifaires de l'électricité. En produisant votre propre énergie verte, vous réduisez considérablement, voire annulez, votre facture mensuelle.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                  <BadgeCheck className="w-6 h-6 text-solar-yellow" /> Rentabilité Maximale
                </h3>
                <p className="text-gray-200">
                  Le retour sur investissement d'une installation solaire en Tunisie est compris entre <strong>3 et 5 ans</strong>, pour une durée de vie des panneaux supérieure à 25 ans.
                </p>
              </div>
            </div>

            <p className="text-gray-200">
              Que vous soyez à <strong>Sousse</strong>, <strong>Tunis</strong>, <strong>Sfax</strong> ou n'importe où en Tunisie, PHÉNIX SOLAR ÉNERGIE vous accompagne pour dimensionner la centrale solaire idéale pour vos besoins. Nous utilisons des technologies de pointe (panneaux monocristallins, onduleurs hybrides) pour garantir un rendement optimal même en cas de fortes chaleurs.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Services Section (Enhanced) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">Nos Solutions Photovoltaïques Clés en Main</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expertise technique et matériel certifié pour tous les secteurs d'activité.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Service 1 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-background-light rounded-3xl p-8 border border-gray-100"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                <Home className="w-8 h-8 text-solar-orange" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Installation Résidentielle</h3>
              <p className="text-gray-600 mb-6">
                Pour les propriétaires de villas et maisons. Nos kits solaires autoconsommation s'intègrent parfaitement à votre toiture.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-eco-green shrink-0" /> Compteur bidirectionnel
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-eco-green shrink-0" /> Gestion administrative STEG/ANME
                </li>
              </ul>
            </motion.div>

            {/* Service 2 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-background-light rounded-3xl p-8 border border-gray-100"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                <Factory className="w-8 h-8 text-deep-blue" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Solaire Industriel</h3>
              <p className="text-gray-600 mb-6">
                Réduisez les charges fixes de votre usine ou entreprise. Installations photovoltaïques Moyenne Tension (MT) et Haute Tension.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-eco-green shrink-0" /> Audit énergétique complet
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-eco-green shrink-0" /> Rentabilité exceptionnelle
                </li>
              </ul>
            </motion.div>

            {/* Service 3 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-background-light rounded-3xl p-8 border border-gray-100"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                <Sprout className="w-8 h-8 text-eco-green" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pompage Solaire</h3>
              <p className="text-gray-600 mb-6">
                Irriguez vos terres gratuitement grâce au soleil. Solutions de pompage au fil du soleil, puissantes et autonomes.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-eco-green shrink-0" /> Variateurs de vitesse solaires
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-eco-green shrink-0" /> Plus de carburant ni facture
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="inline-flex items-center gap-2 text-deep-blue font-bold px-8 py-3 rounded-xl border-2 border-deep-blue hover:bg-deep-blue hover:text-white transition-colors">
              Découvrir tous nos services <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Content Block 2: Provenance & Local */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-deep-blue text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-solar-yellow/5 pattern-dots" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Votre installateur solaire de confiance partout en Tunisie</h2>
            <div className="space-y-6 text-gray-300 text-lg">
              <p>
                Chez <strong>PHÉNIX SOLAR ÉNERGIE</strong>, nous sommes plus qu'un simple installateur. Nous sommes votre partenaire énergie durable. Basés au cœur de la Tunisie, nous intervenons rapidement dans tous les gouvernorats.
              </p>
              <ul className="grid grid-cols-2 gap-4">
                <li className="flex items-center gap-2"><MapPin className="text-solar-yellow w-5 h-5" /> Installation à Tunis</li>
                <li className="flex items-center gap-2"><MapPin className="text-solar-yellow w-5 h-5" /> Installation à Sousse</li>
                <li className="flex items-center gap-2"><MapPin className="text-solar-yellow w-5 h-5" /> Installation à Sfax</li>
                <li className="flex items-center gap-2"><MapPin className="text-solar-yellow w-5 h-5" /> Installation à Nabeul</li>
                <li className="flex items-center gap-2"><MapPin className="text-solar-yellow w-5 h-5" /> Installation à Monastir</li>
                <li className="flex items-center gap-2"><MapPin className="text-solar-yellow w-5 h-5" /> Toute la Tunisie</li>
              </ul>
              <p>
                Nos équipes techniques sont certifiées et formées aux dernières normes de sécurité. Nous prenons en charge l'intégralité du dossier administratif avec la STEG et l'ANME pour vous faire bénéficier des <strong>subventions de l'état</strong>.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-deep-blue font-bold rounded-full hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-5 h-5" /> Parler à un expert
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:w-1/2 relative"
          >
            <div className="aspect-square bg-linear-to-tr from-solar-yellow to-solar-orange rounded-full opacity-20 absolute -top-10 -right-10 blur-3xl animate-pulse"></div>
            {/* Simulated Map or Trust Badge */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <BadgeCheck className="w-8 h-8 text-solar-yellow" /> Pourquoi nous ?
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-1">Matériel de Classe A</h4>
                  <p className="text-sm text-gray-300">Panneaux Tier-1 (Jinko, Longi, Trina) et onduleurs performants (Huawei, Growatt, Sungrow).</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Suivi en Temps Réel</h4>
                  <p className="text-sm text-gray-300">Application mobile pour suivre votre production solaire minute par minute.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Service Après-Vente Réactif</h4>
                  <p className="text-sm text-gray-300">Intervention sous 48h en cas de pépin. Nettoyage et maintenance disponibles.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <section className="py-20 bg-background-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-deep-blue mb-12"
          >
            Questions Fréquentes sur le Solaire
          </motion.h2>

          <div className="mt-12">
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-24 bg-solar-yellow/90 backdrop-blur-sm relative overflow-hidden text-center"
      >
        <div className="absolute inset-0 opacity-5 pattern-dots mix-blend-overlay"></div>
        <div className="relative max-w-5xl mx-auto px-4">
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold text-deep-blue mb-8"
          >
            Passez au vert, <span className="text-white">économisez</span> dès maintenant.
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-deep-blue/80 font-medium mb-10 max-w-2xl mx-auto"
          >
            Ne laissez plus le soleil briller pour rien. Rejoignez les centaines de foyers tunisiens qui ont choisi PHÉNIX SOLAR ÉNERGIE.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              href="/request"
              className="inline-block px-12 py-5 bg-deep-blue text-white text-xl font-bold rounded-full shadow-lg hover:bg-white hover:text-deep-blue transition-all transform hover:scale-105"
            >
              Calculer mes économies
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
