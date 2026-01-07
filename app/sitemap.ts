import { Product } from "@/config/types";
import { getProducts } from "@/services/ProductService";

export default async function sitemap() {
  const fetchAllProducts = async (): Promise<Product[]> => {
    let allProducts: Product[] = [];
    let hasNextPage = true;
    let cursor = "";

    while (hasNextPage) {
      const data = await getProducts(
        { productType: "", minPrice: 0, maxPrice: 0, searchText: "" },
        "",
        100,
        cursor,
        "BEST_SELLING",
        true,
        true
      );
      if (data.pageInfo.startCursor) {
        allProducts = [...allProducts, ...data.products];
        hasNextPage = data.pageInfo?.hasNextPage || false;
        cursor = data.pageInfo?.endCursor || "";
      } else {
        hasNextPage = false;
      }
    }
    return allProducts;
  };

  const products = await fetchAllProducts();
  const sitemapEntries = products.map((product: Product) => ({
    url: `https://montre-d-art.store/catalog/${product.handle}`,
    lastModified: new Date(),
  }));

  return [
    { url: "https://montre-d-art.store", lastModified: new Date() },
    { url: "https://montre-d-art.store/catalog", lastModified: new Date() },
    { url: "https://montre-d-art.store/legal", lastModified: new Date() },
    { url: "https://montre-d-art.store/contact-us", lastModified: new Date() },
    { url: "https://montre-d-art.store/auth", lastModified: new Date() },
    { url: "https://montre-d-art.store/", lastModified: new Date() },
    ...sitemapEntries,
  ];
}
