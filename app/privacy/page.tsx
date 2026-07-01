import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Politique de Confidentialité - PHÉNIX SOLAR ÉNERGIE",
    description: "Politique de confidentialité et protection des données du site PHÉNIX SOLAR ÉNERGIE",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-solar-yellow hover:text-solar-orange mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Retour à l'accueil
                </Link>

                <h1 className="text-4xl font-bold text-deep-blue mb-8">Politique de Confidentialité</h1>

                <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">1. Collecte de Données</h2>
                        <p>
                            Nous collectons les informations que vous nous fournissez volontairement par le biais de nos formulaires de contact
                            et demandes de devis. Ces informations incluent votre nom, email, numéro de téléphone et adresse.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">2. Utilisation des Données</h2>
                        <p>
                            Les données collectées sont utilisées pour:
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Répondre à vos demandes de devis</li>
                            <li>Vous contacter pour le suivi des demandes</li>
                            <li>Améliorer nos services</li>
                            <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">3. Protection des Données</h2>
                        <p>
                            Nous mettons en place des mesures de sécurité appropriées pour protéger vos données personnelles contre l'accès
                            non autorisé, l'altération, la divulgation ou la destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">4. Partage des Données</h2>
                        <p>
                            Nous ne partageons pas vos données personnelles avec des tiers, sauf si nécessaire pour fournir nos services ou si
                            la loi l'exige.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">5. Cookies</h2>
                        <p>
                            Notre site utilise des cookies pour améliorer votre expérience utilisateur. Vous pouvez configurer votre navigateur
                            pour refuser les cookies, mais cela peut affecter certaines fonctionnalités du site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">6. Droits des Utilisateurs</h2>
                        <p>
                            Vous avez le droit d'accéder, de corriger ou de supprimer vos données personnelles. Pour exercer ces droits,
                            contactez-nous via notre formulaire de contact.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">7. Modifications</h2>
                        <p>
                            PHÉNIX SOLAR ÉNERGIE se réserve le droit de modifier cette politique de confidentialité à tout moment. Les
                            modifications entreront en vigueur dès leur publication.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">8. Contact</h2>
                        <p>
                            Pour toute question concernant cette politique de confidentialité, veuillez nous contacter via le formulaire de
                            contact sur notre site.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Dernière mise à jour: {new Date().toLocaleDateString("fr-FR")}</p>
                </div>
            </div>
        </div>
    );
}
