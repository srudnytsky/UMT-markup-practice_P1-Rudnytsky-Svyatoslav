require('dotenv').config();
const { connectDB, Bouquet } = require('../models');

const RAW_BASE = 'https://raw.githubusercontent.com/srudnytsky/UMT-markup-practice_P1-Rudnytsky-Svyatoslav/main/images';

const bouquets = [
  { title: 'Peach Meadow', description: 'A soft and radiant arrangement of peach and blush roses with lush greenery in a straw basket — light and natural.', price: 55, category: 'pastel', photoURL: `${RAW_BASE}/side-view-rose-bouquet-with-wildflowers-pink-basket.jpg` },
  { title: 'Blush Romance', description: 'A premium bouquet of deep pink and ivory roses, complemented by silver eucalyptus — sophisticated and intimate.', price: 34, category: 'romantic', photoURL: `${RAW_BASE}/florist-makes-beautiful-bouquet-studio.jpg` },
  { title: 'Pastel Garden', description: 'A pastel-toned mix of spray roses and greenery in a woven basket — gentle, airy, and perfect for any occasion.', price: 40, category: 'pastel', photoURL: `${RAW_BASE}/big-basket-mixed-flowers-standing-table-with-christmas-cones.jpg` },
  { title: 'Tulip Charm', description: 'A vivid bouquet of bright tulips and roses in a lavender box — cheerful and full of charm.', price: 61, category: 'bright', photoURL: `${RAW_BASE}/mixed-flower-composition-side-view.jpg` },
  { title: 'Berry Bloom', description: 'A lush mix of rich pink, purple, and cream blooms with textured greens — romantic and elegant.', price: 32, category: 'romantic', photoURL: `${RAW_BASE}/exotic-rustic-bunch-flowers-mixed-colors.jpg` },
  { title: 'Sweet Whisper', description: 'A charming spring bouquet with peonies, roses, and lilac-toned accents — fresh, lively, and expressive.', price: 40, category: 'pastel', photoURL: `${RAW_BASE}/basket-filled-with-assorted-colorful-flowers-notecard.jpg` },
  { title: 'Field Joy', description: 'A rustic hand-tied bouquet of sunflowers, lisianthus, and daisies — perfect for brightening the day.', price: 49, category: 'rustic', photoURL: `${RAW_BASE}/wild-flowers.jpg` },
  { title: 'Soft Bloom', description: 'A delicate bouquet of pink carnations and roses wrapped in satin paper — soft, stylish, and versatile.', price: 37, category: 'elegant', photoURL: `${RAW_BASE}/close-up-bouquet-decorated-vintage-style-dark-background.jpg` },
  { title: 'Golden Hour', description: 'A warm composition of golden tulips and roses that captures the glow of a summer evening.', price: 45, category: 'bright', photoURL: `${RAW_BASE}/perfect-gift-wonderful-flowers-womens-day-tender-smiling-brunet-woman-holding-front-face-bouquet-spring-flowerspace-text.jpg` },
  { title: 'Rose Whisper', description: 'A stylish composition of roses, seasonal greenery, and vibrant berries — a bold and elegant floral statement.', price: 40, category: 'romantic', photoURL: `${RAW_BASE}/bridal-arrangement-wedding-flowers-closeup-decoration-roses-flowers-ornamental-plants-closeup.jpg` },
  { title: 'Lilac Charm', description: 'A rich bouquet with lavender, lisianthus, and roses — ideal for those who love deep hues and gentle fragrance.', price: 55, category: 'pastel', photoURL: `${RAW_BASE}/mixed-flower-bouquet-wooden-table.jpg` },
  { title: 'Wild Meadow', description: 'A relaxed, garden-style gathering of wildflowers and roses — effortless and full of texture.', price: 38, category: 'rustic', photoURL: `${RAW_BASE}/side-view-rose-bouquet-with-wildflowers-pink-basket.jpg` },
  { title: 'Velvet Bloom', description: 'Deep, velvety blooms arranged with silver greenery for a refined, evening-ready gift.', price: 58, category: 'elegant', photoURL: `${RAW_BASE}/florist-makes-beautiful-bouquet-studio.jpg` },
  { title: 'Sunny Days', description: 'A bright, cheerful basket bouquet bursting with warm-toned blooms — perfect for celebrations.', price: 42, category: 'bright', photoURL: `${RAW_BASE}/big-basket-mixed-flowers-standing-table-with-christmas-cones.jpg` },
];

const run = async () => {
  await connectDB();
  const existingCount = await Bouquet.count();
  if (existingCount > 0) {
    console.log(`Table already has ${existingCount} rows — skipping seed. Delete rows first if you want to reseed.`);
    process.exit(0);
  }
  await Bouquet.bulkCreate(bouquets);
  console.log(`Seeded ${bouquets.length} bouquets.`);
  process.exit(0);
};
run().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
