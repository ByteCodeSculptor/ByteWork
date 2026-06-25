import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { contact, seo, services, currency } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = `${contact.brand.name}${contact.brand.suffix}`;

export const metadata = {
  metadataBase: new URL(seo.url),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: contact.name }],
  alternates: { canonical: "/" },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: seo.url,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

// schema.org structured data for the freelance service + its offerings.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteName,
  description: seo.description,
  url: seo.url,
  email: contact.email,
  founder: { "@type": "Person", name: contact.name, jobTitle: contact.role },
  areaServed: "IN",
  makesOffer: services.map((service) => ({
    "@type": "Offer",
    price: service.basePrice,
    priceCurrency: currency.code,
    itemOffered: { "@type": "Service", name: service.name, description: service.description },
  })),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
