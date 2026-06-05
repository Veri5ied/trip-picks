import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { createId } from "../src/lib/id.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const activities = [
  {
    id: "act_001",
    title: "Nike Art Gallery",
    category: "Culture",
    area: "Lekki",
    durationMinutes: 90,
    priceLevel: 2,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=800&q=85",
    description:
      "Browse contemporary African art in one of Lagos' best-known galleries.",
    tags: ["art", "indoor", "culture"],
  },
  {
    id: "act_002",
    title: "Lekki Conservation Centre",
    category: "Nature",
    area: "Lekki",
    durationMinutes: 120,
    priceLevel: 2,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1649502913092-fb7f0e8fc632?w=800&q=85",
    description:
      "Walk the canopy bridge and explore a quiet nature reserve in the city.",
    tags: ["nature", "outdoor", "walk"],
  },
  {
    id: "act_003",
    title: "Tarkwa Bay Beach",
    category: "Beach",
    area: "Victoria Island",
    durationMinutes: 180,
    priceLevel: 2,
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1618828665347-d870c38c95c7?w=800&q=85",
    description:
      "Take a boat ride to a relaxed beach spot for swimming, surfing, and sun.",
    tags: ["beach", "outdoor", "water"],
  },
  {
    id: "act_004",
    title: "Terra Kulture",
    category: "Culture",
    area: "Victoria Island",
    durationMinutes: 120,
    priceLevel: 3,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1526735334552-daff0bd6d53f?w=800&q=85",
    description:
      "Enjoy Nigerian food, books, theatre, and cultural exhibitions in one venue.",
    tags: ["culture", "food", "theatre"],
  },
  {
    id: "act_005",
    title: "Freedom Park",
    category: "History",
    area: "Lagos Island",
    durationMinutes: 75,
    priceLevel: 1,
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1587590010936-300da0d70b9e?w=800&q=85",
    description:
      "Visit a historic public park with live events, memorials, and open courtyards.",
    tags: ["history", "outdoor", "music"],
  },
  {
    id: "act_006",
    title: "Balogun Market",
    category: "Shopping",
    area: "Lagos Island",
    durationMinutes: 120,
    priceLevel: 1,
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1648023199223-25d3622bcb13?w=800&q=85",
    description:
      "Explore one of Lagos' busiest markets for fabrics, fashion, and local finds.",
    tags: ["shopping", "market", "fashion"],
  },
  {
    id: "act_007",
    title: "Jazzhole",
    category: "Music",
    area: "Ikoyi",
    durationMinutes: 60,
    priceLevel: 2,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1573662766191-066ba9570a4b?w=800&q=85",
    description:
      "Browse records, books, and coffee in a beloved Lagos music and culture shop.",
    tags: ["music", "books", "indoor"],
  },
  {
    id: "act_008",
    title: "Eko Hotel Main Bar",
    category: "Food",
    area: "Victoria Island",
    durationMinutes: 90,
    priceLevel: 3,
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1648023200358-9dc050df521d?w=800&q=85",
    description:
      "Enjoy cocktails and live music at one of Lagos' most iconic hotel bars.",
    tags: ["food", "drinks", "nightlife"],
  },
];

async function main() {
  for (const activity of activities) {
    await prisma.activity.upsert({
      where: {
        id: activity.id,
      },
      update: activity,
      create: activity,
    });
  }

  const password = await bcrypt.hash("password123", 12);
  await prisma.user.upsert({
    where: { email: "demo@trip-picks.app" },
    update: {},
    create: {
      id: createId("user"),
      email: "demo@trip-picks.app",
      password,
    },
  });

  console.log("Seeded: 8 activities, 1 user (demo@trip-picks.app / password123)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
