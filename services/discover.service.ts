import { prisma } from "../model/prisma";

// images static (ممكن بعدين تبقى من DB)
const familyImages: Record<string, string> = {
  floral: "https://yourcdn.com/floral.jpg",
  woody: "https://yourcdn.com/woody.jpg",
  oriental: "https://yourcdn.com/oriental.jpg",
  fresh: "https://yourcdn.com/fresh.jpg",
  citrus: "https://yourcdn.com/citrus.jpg",
  aquatic: "https://yourcdn.com/aquatic.jpg",
};

export class discover_services {
  constructor() {}

    async getDiscoverData() {
    
         const [familiesRaw, trendingRaw] = await Promise.all([
    
            prisma.product.groupBy({
            by: ["fragrance_family"],
            _count: { _all: true },
            orderBy: {
                _count: { fragrance_family: "desc" },
            },
            }),

            // 🔵 Trending (most sold)
            prisma.orderItem.groupBy({
            by: ["product_id"],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: "desc" } },
            take: 10,
            }),
        ]);

        // 🟣 format families
        const families = familiesRaw.map((f : any ) => ({
            name: f.fragrance_family,
            count: f._count._all,
            image: familyImages[f.fragrance_family] || "default.jpg",
        }));

        // 🔵 extract product ids
        const productIds = trendingRaw.map((t) => t.product_id);

        // 🔵 get products
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: {
            id: true,
            name: true,
            image_url: true,
            brand: {
                select: { name: true },
            },
            sizes: {
                select: { price: true },
                orderBy: { price: "asc" },
                take: 1,
            },
            },
        });

        const sortedProducts = productIds.map((id) =>
            products.find((p) => p.id === id)
        );

        const trending = sortedProducts.map((p) => ({
            id: p?.id,
            name: p?.name,
            image: p?.image_url,
            brand: p?.brand.name,
            price: p?.sizes[0]?.price || 0,
        }));

        return {
            families,
            trending,
        };
    }
}