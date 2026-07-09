export interface ProductVariant {
  id: string;
  label: string;
  priceEUR: number;
  /** Present when the variant is on sale — the crossed-out original price. */
  compareAtEUR?: number;
  stripePriceId: string;
  stock?: number;
}

export interface ProductVideo {
  src: string;
  poster: string;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  images: string[];
  aPlusContent?: string[];
  videos?: ProductVideo[];
  variants: ProductVariant[];
  specs: Record<string, string>;
}

export const products: Product[] = [
  {
    slug: 'uvsu-shaker',
    name: "Carlu's UvsU Shaker",
    tagline: 'Zwei Shaker. Vier Fächer. Kein Grund mehr zu kramen.',
    description:
      'Der UvsU Shaker kommt im Doppelpack – zwei komplette 500-ml-Shaker in Schwarz und Mint, damit du nie wieder mit ungespültem Becher dastehst. Jeder Shaker hat zwei aufschraubbare Fächer (100 ml + 150 ml), die sich beliebig kombinieren oder einzeln nutzen lassen – bis zu vier Portionen Protein, Creatin, BCAAs oder Snacks getrennt transportiert. Der Stufendeckel mit Snap-Lock-Verschluss und Präzisionsgewinde hält auch in der vollgepackten Sporttasche dicht, ohne beim Trinken an der Nase zu stören. Ein Edelstahl-Federmixer pro Shaker sorgt für klumpenfreie Shakes. Material ist BPA-frei, lebensmittelecht und frei von Phthalaten – und alles zusammen (Shaker, Deckel, Fächer, Mixball) ist spülmaschinenfest. Zwei Tabletten-Organizer-Einsätze für Vitamine oder Supplements sind ebenfalls dabei.',
    images: [
      '/images/products/shaker-hero.png',
      '/images/products/shaker-mixballs.png',
      '/images/products/shaker-dishwasher.png',
      '/images/products/shaker-smooth-surface.png',
      '/images/products/shaker-set.png',
      '/images/products/shaker-compartments.png',
    ],
    variants: [
      {
        id: 'doppelpack-schwarz-mint',
        label: 'Doppelpack – Schwarz + Mint',
        priceEUR: 19.99,
        stripePriceId: 'price_1TrQPSH7Qq98HnZhnaBMouF2',
      },
    ],
    specs: {
      Volumen: '2× 500 ml (Doppelpack)',
      Fächer: '2 pro Shaker, 100 ml + 150 ml, modular kombinierbar',
      Deckel: 'Stufendeckel mit Snap-Lock, Präzisionsgewinde',
      Mixhilfe: 'Edelstahl-Federmixer, 1 pro Shaker (2 im Set)',
      Zubehör: '2× Tabletten-Organizer-Einsatz',
      Material: 'BPA-frei, phthalatfrei, lebensmittelecht',
      Reinigung: 'Komplett spülmaschinenfest (Shaker, Deckel, Fächer, Mixball)',
      Dichtigkeit: '100 % auslaufsicher',
      Farben: 'Schwarz (matt) + Mint/Grün (transparent)',
    },
  },
  {
    slug: 'uvsu-shaker-schwarz-weiss',
    name: "Carlu's UvsU Shaker – Schwarz/Weiß",
    tagline: 'Zwei Shaker. Vier Fächer. Kein Grund mehr zu kramen.',
    description:
      'Der UvsU Shaker kommt im Doppelpack – zwei komplette 500-ml-Shaker in Schwarz und Weiß, damit du nie wieder mit ungespültem Becher dastehst. Jeder Shaker hat zwei aufschraubbare Fächer (100 ml + 150 ml), die sich beliebig kombinieren oder einzeln nutzen lassen – bis zu vier Portionen Protein, Creatin, BCAAs oder Snacks getrennt transportiert. Der Step-Stop-Deckel mit Snap-Lock-Verschluss und Präzisionsgewinde hält auch in der vollgepackten Sporttasche dicht, ohne beim Trinken an der Nase zu stören. Ein Edelstahl-Federmixer pro Shaker sorgt für klumpenfreie Shakes. Material ist BPA-frei, lebensmittelecht und frei von Phthalaten – und alles zusammen (Shaker, Deckel, Fächer, Mixball) ist spülmaschinenfest. Zwei Tabletten-Organizer-Einsätze für Vitamine oder Supplements sind ebenfalls dabei.',
    images: [
      '/images/products/shaker-blue-hero.png',
      '/images/products/shaker-blue-lifestyle.png',
      '/images/products/shaker-blue-lid-detail.png',
      '/images/products/shaker-blue-mixball.png',
      '/images/products/shaker-blue-organizer.png',
      '/images/products/shaker-blue-set.png',
      '/images/products/shaker-blue-modular.png',
    ],
    variants: [
      {
        id: 'doppelpack-schwarz-weiss',
        label: 'Doppelpack – Schwarz + Weiß',
        priceEUR: 19.99,
        stripePriceId: 'price_1TrQPTH7Qq98HnZh5yCUN30R',
      },
    ],
    specs: {
      Volumen: '2× 500 ml (Doppelpack)',
      Fächer: '2 pro Shaker, 100 ml + 150 ml, modular kombinierbar',
      Deckel: 'Step-Stop-Stufendeckel mit Snap-Lock, Präzisionsgewinde',
      Mixhilfe: 'Edelstahl-Federmixer, 1 pro Shaker (2 im Set)',
      Zubehör: '2× Tabletten-Organizer-Einsatz',
      Material: 'BPA-frei, phthalatfrei, lebensmittelecht',
      Reinigung: 'Komplett spülmaschinenfest (Shaker, Deckel, Fächer, Mixball)',
      Dichtigkeit: '100 % auslaufsicher',
      Farben: 'Schwarz (matt) + Weiß (transparent), blaue Akzente',
    },
  },
  {
    slug: 'laufweste',
    name: "Carlu's Laufweste",
    tagline: 'Ultraleicht. Reflektierend. Alles griffbereit.',
    description:
      'Die Carlu\'s Laufweste ist aus luftigem Honeycomb-Mesh gefertigt – ultraleicht, atmungsaktiv und beim Laufen kaum spürbar. Die vordere Zip-Tasche hält dein Handy sicher griffbereit, die elastische Tasche nimmt die mitgelieferte 500-ml-Softflasche auf, und die Rückentasche mit Reißverschluss bietet zusätzlichen Stauraum für Snacks oder eine Jacke. Reflektorstreifen, Mini-Reflektoren und ein reflektierender Rückenprint sorgen für bessere Sichtbarkeit bei Dämmerung und Dunkelheit. Die stufenlos verstellbare Passform (80–130 cm Brustumfang) sitzt für Damen und Herren ohne Wackeln oder Verrutschen.',
    images: [
      '/images/products/laufweste-hero.png',
      '/images/products/laufweste-breathable.png',
      '/images/products/laufweste-pockets.png',
      '/images/products/laufweste-bottle.png',
      '/images/products/laufweste-back-pocket.png',
      '/images/products/laufweste-visibility.png',
      '/images/products/laufweste-fit.png',
    ],
    aPlusContent: [
      '/images/products/laufweste-lifestyle-sunset.png',
      '/images/products/laufweste-bottle-detail.png',
      '/images/products/laufweste-storage.png',
      '/images/products/laufweste-quick-access.png',
      '/images/products/laufweste-day-night.png',
      '/images/products/laufweste-comfort.png',
      '/images/products/laufweste-spotlight-front.png',
      '/images/products/laufweste-spotlight-back.png',
      '/images/products/laufweste-flatlay-dark.jpg',
      '/images/products/laufweste-front-back-dark.jpg',
    ],
    videos: [
      {
        src: '/images/products/laufweste-video-1.mp4',
        poster: '/images/products/laufweste-video-1-poster.jpg',
      },
      {
        src: '/images/products/laufweste-video-2.mp4',
        poster: '/images/products/laufweste-video-2-poster.jpg',
      },
    ],
    variants: [
      {
        id: 'laufweste-s',
        label: 'S',
        priceEUR: 14.99,
        compareAtEUR: 24.99,
        stripePriceId: 'price_1TrQSlH7Qq98HnZho5RZXxVF',
      },
      {
        id: 'laufweste-m',
        label: 'M',
        priceEUR: 14.99,
        compareAtEUR: 24.99,
        stripePriceId: 'price_1TrQSlH7Qq98HnZho5RZXxVF',
      },
      {
        id: 'laufweste-l',
        label: 'L',
        priceEUR: 14.99,
        compareAtEUR: 24.99,
        stripePriceId: 'price_1TrQSlH7Qq98HnZho5RZXxVF',
      },
    ],
    specs: {
      Material: 'Atmungsaktives Honeycomb-Mesh, ultraleicht',
      Passform: 'Stufenlos verstellbar, 80–130 cm Brustumfang',
      Eignung: 'Unisex – Damen & Herren',
      Taschen: 'Vordere Zip-Tasche (Handy), elastische Flaschentasche, Rückentasche mit Reißverschluss',
      Zubehör: '500-ml-Softflasche inklusive – faltbar, BPA-frei, auslaufsicher',
      Sichtbarkeit: 'Reflektorstreifen, Mini-Reflektoren, reflektierender Rückenprint',
    },
  },
  {
    slug: 'widerstandsbaender-set',
    name: "Carlu's Widerstandsband-Set",
    tagline: '3 Stufen. Ein Set. Überall einsetzbar.',
    description:
      'Das Widerstandsband-Set bringt drei Belastungsstufen (leicht, mittel, stark) in einem kompakten Set für Kraft-, Mobility- und Reha-Training. Die Bänder aus robustem Naturlatex lassen sich einzeln oder kombiniert nutzen und passen in jede Sporttasche.',
    images: [
      '/images/products/resistance-bands-hero.svg',
    ],
    variants: [
      {
        id: 'widerstandsbaender-set',
        label: 'Set (3 Stufen)',
        priceEUR: 17.99,
        stripePriceId: 'price_REPLACE_ME_widerstandsbaender',
        stock: 0,
      },
    ],
    specs: {
      Material: 'Naturlatex',
      Stufen: '3× (leicht, mittel, stark)',
      Länge: '1200 mm pro Band',
      Einsatz: 'Kraft-, Mobility- und Reha-Training',
    },
  },
  {
    slug: 'sport-armtasche',
    name: "Carlu's Sport-Armtasche",
    tagline: 'Handy sicher am Arm. Für jeden Lauf.',
    description:
      'Die Sport-Armtasche hält dein Handy (bis ca. 6,7 Zoll) sicher am Oberarm, während die stufenlos verstellbare Reflektor-Schnalle für Passform ohne Wackeln sorgt. Der weiche Neopren-Innenstoff verhindert Scheuern auch auf langen Läufen.',
    images: [
      '/images/products/armtasche-hero.svg',
    ],
    variants: [
      {
        id: 'sport-armtasche',
        label: 'Einheitsgröße',
        priceEUR: 14.99,
        stripePriceId: 'price_REPLACE_ME_armtasche',
        stock: 0,
      },
    ],
    specs: {
      Material: 'Neopren, atmungsaktiv',
      Passform: 'Bizepsumfang 25–40 cm, verstellbar',
      Kompatibilität: 'Smartphones bis 6,7 Zoll',
      Sichtbarkeit: 'Reflektierende Schnalle',
    },
  },
  {
    slug: 'springseil',
    name: "Carlu's Speed-Springseil",
    tagline: 'Kugellager-Griffe. Verstellbare Länge.',
    description:
      'Das Speed-Springseil mit Kugellager-Griffen ermöglicht schnelle, präzise Drehungen für Cardio- und Double-Under-Training. Das Stahlseil ist stufenlos kürzbar und passt sich jeder Körpergröße an.',
    images: [
      '/images/products/springseil-hero.svg',
    ],
    variants: [
      {
        id: 'springseil',
        label: 'Einheitsgröße',
        priceEUR: 12.99,
        stripePriceId: 'price_REPLACE_ME_springseil',
        stock: 0,
      },
    ],
    specs: {
      Material: 'Stahlseil, ummantelt',
      Griffe: 'Kugellager, rutschfest',
      Länge: 'Verstellbar, kürzbar',
      Einsatz: 'Cardio- und Speed-Training',
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((v) => v.id === variantId);
}

export function isOutOfStock(product: Product): boolean {
  return product.variants.every((v) => v.stock === 0);
}

export function getFromVariant(product: Product): ProductVariant {
  return product.variants.reduce((min, v) => (v.priceEUR < min.priceEUR ? v : min), product.variants[0]);
}

export function getFromPrice(product: Product): number {
  return getFromVariant(product).priceEUR;
}
