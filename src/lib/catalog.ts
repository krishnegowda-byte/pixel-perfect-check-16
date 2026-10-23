import rawCategories from "@/data/categories.json";
import rawProducts from "@/data/products.json";
import rawAcDrivesProducts from "@/data/ac-drives-products.json";

/**
 * Catalogue data exported from the existing WooCommerce store on dicsglobal.com
 * (Store API, 858 products, 133 categories). Re-export to refresh.
 * AC Drives line-up (Fuji Electric drives + OMRON servo systems) lives in ac-drives-products.json.
 */
export type Category = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  description: string;
  image: string | null;
};
export type Product = {
  id: number;
  name: string;
  slug: string;
  brand: string | null;
  categories: string[];
  summary: string;
  description: string;
  images: string[];
  sku: string | null;
};

export const categories = rawCategories as Category[];
export const products = [...(rawProducts as Product[]), ...(rawAcDrivesProducts as Product[])];

const byId = new Map(categories.map((c) => [c.id, c]));
const bySlug = new Map(categories.map((c) => [c.slug, c]));
const productBySlug = new Map(products.map((p) => [p.slug, p]));

export const getCategory = (slug: string) => bySlug.get(slug);
export const getProduct = (slug: string) => productBySlug.get(slug);
export const topCategories = categories
  .filter((c) => c.parent === 0)
  .sort((a, b) => a.name.localeCompare(b.name));

export function childrenOf(cat: Category) {
  return categories.filter((c) => c.parent === cat.id).sort((a, b) => a.name.localeCompare(b.name));
}

/** Ancestors from root to the category itself. */
export function lineage(cat: Category): Category[] {
  const out: Category[] = [];
  let cur: Category | undefined = cat;
  while (cur) {
    out.unshift(cur);
    cur = cur.parent ? byId.get(cur.parent) : undefined;
  }
  return out;
}

export const categoryPath = (cat: Category) => lineage(cat).map((c) => c.slug).join("/");

/** Display label: subcategories that are just a brand name get their parent's name appended. */
export function categoryLabel(cat: Category) {
  const parent = cat.parent ? byId.get(cat.parent) : undefined;
  const brandish = ["OMRON", "AUTONICS", "FUJI", "CKD", "CROUZET", "CRYDOM", "PROFACE"].includes(cat.name.toUpperCase());
  return brandish && parent ? `${cat.name} ${parent.name}` : cat.name;
}

function descendantSlugs(cat: Category): Set<string> {
  const set = new Set<string>([cat.slug]);
  const stack = [cat.id];
  while (stack.length) {
    const id = stack.pop()!;
    for (const c of categories) if (c.parent === id) { set.add(c.slug); stack.push(c.id); }
  }
  return set;
}

export function productsIn(cat: Category): Product[] {
  const set = descendantSlugs(cat);
  return products.filter((p) => p.categories.some((s) => set.has(s)));
}

export function topCategoryOf(p: Product): Category | undefined {
  const c = getCategory(p.categories[0] ?? "");
  return c ? lineage(c)[0] : undefined;
}

export function relatedProducts(p: Product, n = 4): Product[] {
  const set = new Set(p.categories);
  const same = products.filter((x) => x.slug !== p.slug && x.categories.some((s) => set.has(s)));
  return same.slice(0, n);
}

export const brandNames = Array.from(new Set(products.map((p) => p.brand).filter(Boolean) as string[])).sort();

export function searchProducts(opts: { q?: string | undefined; brand?: string | undefined; category?: string | undefined }) {
  const q = opts.q?.trim().toLowerCase();
  let list = products;
  if (opts.category) {
    const c = getCategory(opts.category);
    if (c) { const set = descendantSlugs(c); list = list.filter((p) => p.categories.some((s) => set.has(s))); }
  }
  if (opts.brand) list = list.filter((p) => p.brand === opts.brand);
  if (q) {
    const terms = q.split(/\s+/);
    list = list.filter((p) => {
      const hay = `${p.name} ${p.brand ?? ""} ${p.slug.replace(/-/g, " ")} ${p.categories.join(" ").replace(/-/g, " ")}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }
  return list;
}
