import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

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
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
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
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
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
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
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
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
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
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
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
    imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e",
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
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    description:
      "Browse records, books, and coffee in a beloved Lagos music and culture shop.",
    tags: ["music", "books", "indoor"],
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
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
