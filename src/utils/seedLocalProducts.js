export async function ensureSeedLocalProducts() {
  const KEY = "localProducts";
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (existing.length >= 100) {
      console.info("Seeder: already seeded", existing.length);
      return existing;
    }

    const categories = [
      "Men", "Women", "Kids", "Shoes", "Accessories",
      "Bags", "Beauty", "Home", "Sports", "Ethnic"
    ];

    const seed = [];
    let idCounter = Date.now();

    categories.forEach((cat, ci) => {
      for (let j = 1; j <= 10; j++) {
        const idx = ci * 10 + j;
        const name = `${cat} Product ${j}`;
        const price = Math.round(499 + Math.random() * 4500);
        const hasDiscount = Math.random() > 0.6;
        const discount_price = hasDiscount ? Math.round(price * (0.6 + Math.random() * 0.35)) : null;
        const images = [
          `https://via.placeholder.com/600x600.png?text=${encodeURIComponent(`${cat}+${j}`)}`
        ];

        seed.push({
          id: `local-${idCounter++}-${idx}`,
          name,
          description: `${name} — stylish, comfortable and affordable.`,
          price,
          discount_price,
          category: cat,
          brand: `${cat}Brand`,
          sizes: ["S", "M", "L", "XL"],
          colors: ["#000000", "#ffffff", "red", "blue"],
          images,
          stock: Math.floor(10 + Math.random() * 90),
          rating: Number((3 + Math.random() * 2).toFixed(1)),
          reviews: Math.floor(Math.random() * 500)
        });
      }
    });

    const merged = [...seed, ...existing];
    localStorage.setItem(KEY, JSON.stringify(merged));
    console.info("Seeder: created", seed.length, "items");
    // return newly stored array
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch (err) {
    console.error("Seeder error", err);
    return [];
  }
}