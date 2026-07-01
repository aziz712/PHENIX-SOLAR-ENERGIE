export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "PHÉNIX SOLAR ÉNERGIE",
        "image": "https://phenixsolarenergie.tn/logo.png",
        "@id": "https://phenixsolarenergie.tn",
        "url": "https://phenixsolarenergie.tn",
        "telephone": "+216 12 345 678",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Av Hedi Nouira",
            "addressLocality": "Sousse",
            "postalCode": "4000",
            "addressCountry": "TN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 35.8256,
            "longitude": 10.6084
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "08:00",
            "closes": "18:00"
        },
        "sameAs": [
            "https://www.facebook.com/phenixsolarenergie",
            "https://www.instagram.com/phenixsolarenergie"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
