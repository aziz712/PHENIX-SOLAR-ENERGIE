import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Conditions d'Utilisation - PHÉNIX SOLAR ÉNERGIE",
  description: "Conditions générales d'utilisation du site PHÉNIX SOLAR ÉNERGIE",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-solar-yellow hover:text-solar-orange mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </Link>

        <h1 className="text-4xl font-bold text-deep-blue mb-8">Conditions d'Utilisation</h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">1. Acceptation des Conditions</h2>
            <p>
              En accédant et en utilisant ce site web, vous acceptez d'être lié par les conditions d'utilisation suivantes.
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">2. Utilisation du Site</h2>
            <p>
              Vous acceptez d'utiliser ce site uniquement à des fins légales et d'une manière qui ne porte préjudice à personne
              ou ne restreint l'accès ou l'utilisation du site par quelqu'un d'autre.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">3. Propriété Intellectuelle</h2>
            <p>
              Tous les contenus du site (textes, images, logos, vidéos) sont la propriété de PHÉNIX SOLAR ÉNERGIE ou de ses
              fournisseurs. Toute reproduction sans autorisation écrite est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">4. Limitation de Responsabilité</h2>
            <p>
              PHÉNIX SOLAR ÉNERGIE ne sera pas responsable de tout dommage direct, indirect ou accidentel résultant de l'utilisation
              de ce site ou de son contenu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">5. Modifications</h2>
            <p>
              PHÉNIX SOLAR ÉNERGIE se réserve le droit de modifier ces conditions à tout moment. Les modifications entreront en
              vigueur dès leur publication.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-deep-blue mt-8 mb-4">6. Contact</h2>
            <p>
              Pour toute question concernant ces conditions, veuillez nous contacter via le formulaire de contact sur notre site.
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
