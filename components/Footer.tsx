import Link from "next/link";
import { Sun, Facebook, Mail, Phone, MapPin, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-deep-blue text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center mb-4">
                            <img
                                src="/footer-logo.png"
                                alt="PHOENIX SOLAR ENERGY Logo"
                                className="h-28 w-auto "
                            />
                        </Link>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            Votre partenaire de confiance pour l'énergie solaire en Tunisie.
                            Solutions photovoltaïques durables pour un avenir plus vert.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-solar-yellow transition-colors" aria-label="Facebook">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-solar-yellow transition-colors" aria-label="Instagram">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-solar-yellow transition-colors" aria-label="LinkedIn">
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-solar-yellow">Navigation</h3>
                        <ul className="space-y-2">
                            <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link></li>
                            <li><Link href="/projects" className="text-gray-300 hover:text-white transition-colors">Réalisations</Link></li>
                            <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">À propos</Link></li>
                            <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-solar-yellow">Services</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-300">Installation Résidentielle</li>
                            <li className="text-gray-300">Solutions Industrielles</li>
                            <li className="text-gray-300">Pompage Solaire</li>
                            <li className="text-gray-300">Maintenance & Suivi</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-solar-yellow">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-solar-orange mt-0.5 shrink-0" />
                                <span className="text-gray-300 text-sm">Tunis, Tunisie</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-solar-orange shrink-0" />
                                <span className="text-gray-300 text-sm">+216 XX XXX XXX</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-solar-orange shrink-0" />
                                <span className="text-gray-300 text-sm">contact@PhenixSolarEnergie.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} PHOENIX SOLAR ENERGY. Tous droits réservés.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-400">
                        <Link href="/privacy" className="hover:text-white">Confidentialité</Link>
                        <Link href="/terms" className="hover:text-white">Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
