import fs from 'fs';

const categories = [
  {
    name: "Tech",
    items: ["Casque Audio", "Montre Connectée", "Enceinte Bluetooth", "Clavier Mécanique", "Chargeur Sans Fil", "Appareil Photo", "Projecteur Portable", "Liseuse", "Souris Ergonomique", "Tablette"],
    brands: ["Sony", "Bose", "Apple", "Samsung", "Logitech", "Marshall", "Garmin", "Canon", "Anker", "Kindle"],
    adjectives: ["Pro", "Max", "Ultra", "Elite", "Premium", "Smart", "Compact", "Mini", "Wireless", "Advanced"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80"
    ]
  },
  {
    name: "Maison",
    items: ["Vase en Céramique", "Lampe de Bureau", "Plaid en Laine", "Bougie Parfumée", "Miroir Mural", "Coussin", "Affiche d'Art", "Tapis", "Plateau", "Horloge"],
    brands: ["Ferm Living", "Hay", "Muuto", "Menu", "Diptyque", "Byredo", "Maison du Monde", "Zara Home", "IKEA", "Habitat"],
    adjectives: ["Design", "Minimaliste", "Scandinave", "Élégant", "Vintage", "Moderne", "Artisanal", "Bohème", "Chic", "Contemporain"],
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      "https://images.unsplash.com/photo-1507133750070-4ed4b5886446?w=800&q=80",
      "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80"
    ]
  },
  {
    name: "Food",
    items: ["Coffret Dégustation", "Bouteille de Vin", "Champagne", "Chocolats Fins", "Thé Grand Cru", "Café de Spécialité", "Huile d'Olive", "Truffe", "Caviar", "Miel Rare"],
    brands: ["Mariage Frères", "Alain Ducasse", "Pierre Hermé", "Ruinart", "Dom Pérignon", "Veuve Clicquot", "Petrossian", "Kusmi Tea", "Valrhona", "Angelina"],
    adjectives: ["Grand Cru", "Millésimé", "Exception", "Artisanal", "Bio", "Prestige", "Gourmet", "Signature", "Authentique", "Raffiné"],
    images: [
      "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=800&q=80",
      "https://images.unsplash.com/photo-1574845012579-2d17c8005374?w=800&q=80",
      "https://images.unsplash.com/photo-1582103287241-2762adac6e1c?w=800&q=80",
      "https://images.unsplash.com/photo-1596450514735-111a2fe02935?w=800&q=80",
      "https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=800&q=80"
    ]
  },
  {
    name: "Bien-être",
    items: ["Coffret Soin", "Huile de Massage", "Crème Visage", "Sérum", "Masque Relaxant", "Rouleau de Jade", "Tapis de Yoga", "Diffuseur d'Huiles", "Bain Moussant", "Savon Artisanal"],
    brands: ["Aesop", "Le Labo", "Kiehl's", "L'Occitane", "Rituals", "Clarins", "Chanel", "Dior", "Guerlain", "La Mer"],
    adjectives: ["Apaisant", "Revitalisant", "Bio", "Naturel", "Purifiant", "Hydratant", "Anti-âge", "Détox", "Relaxant", "Luxueux"],
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
      "https://images.unsplash.com/photo-1615397323214-e05e54d3d82d?w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"
    ]
  },
  {
    name: "Expérience",
    items: ["Dîner Étoilé", "Saut en Parachute", "Vol en Montgolfière", "Nuit dans les Arbres", "Stage de Pilotage", "Atelier Cuisine", "Dégustation de Vins", "Massage Spa", "Week-end Évasion", "Billet Concert"],
    brands: ["Relais & Châteaux", "Michelin", "Smartbox", "Wonderbox", "Airbnb", "Booking", "Ticketmaster", "Spa Cinq Mondes", "Porsche", "Oenologie"],
    adjectives: ["Inoubliable", "Sensationnel", "Romantique", "Extrême", "Gourmand", "Insolite", "VIP", "Privé", "Exclusif", "Découverte"],
    images: [
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
      "https://images.unsplash.com/photo-1522083111860-6b60c38ff2ec?w=800&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
    ]
  }
];

const generateProduct = () => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const item = category.items[Math.floor(Math.random() * category.items.length)];
  const brand = category.brands[Math.floor(Math.random() * category.brands.length)];
  const adjective = category.adjectives[Math.floor(Math.random() * category.adjectives.length)];
  const image = category.images[Math.floor(Math.random() * category.images.length)];
  
  const name = `${item} ${brand} ${adjective}`.replace(/'/g, "''");
  const description = `Découvrez ce magnifique produit de la marque ${brand}. Une expérience ${adjective.toLowerCase()} garantie. Parfait pour offrir un cadeau d'exception.`.replace(/'/g, "''");
  const price = Math.floor(Math.random() * 400) + 20; // 20 to 420
  
  return `('${name}', '${description}', ${price}, '${category.name}', '${image}')`;
};

async function seed() {
  const values = Array.from({ length: 200 }, generateProduct);
  
  const sql = `INSERT INTO products (name, description, price, category, image_url) VALUES \n${values.join(',\n')};`;
  
  fs.writeFileSync('seed_200_products.sql', sql);
  console.log('Successfully created seed_200_products.sql');
}

seed();
