import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CategoryCard, EnquiryBand, PageHeader, ProductCard } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { categoryLabel, categoryPath, childrenOf, getCategory, lineage, products, productsIn } from "@/lib/catalog";

/** AC Drives page shows a curated line-up: Fuji Electric drives first, then OMRON servo systems. */
const AC_DRIVES_SLUG = "ac-drives";
const acDriveGroups = [
  { id: "fuji-electric-drives", brand: "Fuji Electric", title: "Fuji Electric · Drive and Control", intro: "Low and medium voltage AC drives (inverters) from Fuji Electric — from compact micro drives to high-performance and medium-voltage inverters." },
  { id: "omron-servo-drives", brand: "OMRON", title: "OMRON · Servomotors / Servo Drivers", intro: "High-speed, high-precision OMRON servo systems, including drives with built-in EtherCAT communications." },
].map((g) => ({ ...g, items: products.filter((p) => p.brand === g.brand && p.categories.includes(AC_DRIVES_SLUG)) }));
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/product-category/$")({
  loader: ({ params }) => {
    const parts = (params._splat ?? "").split("/").filter(Boolean);
    const cat = getCategory(parts[parts.length - 1] ?? "");
    if (!cat) throw notFound();
    return { slug: cat.slug };
  },
  head: ({ loaderData }) => {
    const c = loaderData ? getCategory(loaderData.slug) : undefined;
    if (!c) return { meta: [{ title: "Category unavailable | DICS" }, { name: "robots", content: "noindex" }] };
    const name = categoryLabel(c);
    return {
      meta: seo(name, c.description || `Browse ${productsIn(c).length} ${name} products available from DICS. Request a quote for pricing and availability.`),
      links: [{ rel: "canonical", href: `https://dicsglobal.com/product-category/${categoryPath(c)}/` }],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="container-site py-24 text-center">
      <h1 className="text-3xl font-bold">Category not found</h1>
      <Button asChild className="mt-6"><Link to="/products">Browse all products</Link></Button>
    </div>
  ),
});

function CategoryPage() {
  const { slug } = Route.useLoaderData();
  const cat = getCategory(slug)!;
  const chain = lineage(cat);
  const subs = childrenOf(cat);
  const isAcDrives = cat.slug === AC_DRIVES_SLUG;
  const list = isAcDrives ? acDriveGroups.flatMap((g) => g.items) : productsIn(cat);
  return (
    <>
      <PageHeader
        title={categoryLabel(cat)}
        eyebrow={`${list.length} products`}
        intro={cat.description || undefined}
        crumbs={[{ label: "Products", to: "/products" }, ...chain.map((c) => ({ label: c.name, to: "/product-category/$", params: { _splat: categoryPath(c) } }))]}
      />
      {cat.slug === "fuji-drives-inverters" && (
        <section className="container-site py-10 md:py-16">
          <div className="grid items-center gap-10 rounded-2xl border border-border bg-muted/30 p-6 md:grid-cols-2 md:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Fuji Electric · Drives & Inverters
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                Precision Motor Control for Industrial Applications
              </h2>

              <p className="mt-5 leading-7 text-muted-foreground">
                Explore Fuji Electric FRENIC drive solutions for industrial
                motor control applications. DICS Global helps businesses
                identify suitable drives and inverters based on their
                machinery, operating requirements and application needs.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/request-a-quote">
                    Request a Quote
                  </Link>
                </Button>

                <Button asChild variant="outline">
                  <a href="#fuji-products">
                    Explore Products
                  </a>
                </Button>
              </div>

              <p className="mt-5 text-sm text-muted-foreground">
                Industrial automation products and engineering services
                from DICS Global since 1996.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl bg-background">
              <img
                src={cat.image}
                alt="Fuji Electric drives and inverters"
                className="h-64 w-full object-contain p-5 md:h-80"
                loading="eager"
              />
            </div>
          </div>
        </section>
      )}
      {subs.length > 0 && !isAcDrives && (
        <section className="container-site py-12">
          <h2 className="text-2xl font-bold">Subcategories</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {subs.map((s) => <CategoryCard key={s.slug} c={{ ...s, name: categoryLabel(s) }} image={s.image ?? productsIn(s)[0]?.images[0]} />)}
          </div>
        </section>
      )}
      {isAcDrives ? (
        acDriveGroups.map((g, i) => (
          <section key={g.id} id={g.id} className={`container-site pb-16 ${i === 0 ? "pt-12" : "pt-4"}`}>
            <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div>
                <h2 className="text-2xl font-bold">{g.title}</h2>
                <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{g.intro}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-primary">{g.items.length} products</span>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {g.items.map((p) => <ProductCard key={p.slug} p={p} />)}
            </div>
          </section>
        ))
      ) : (
        <section
    id={cat.slug === "fuji-drives-inverters" ? "fuji-products" : undefined}
    className="container-site pb-16 pt-4"
  >
          <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
            <h2 className="text-2xl font-bold">Products in {categoryLabel(cat)}</h2>
            <Link to="/products" search={{ category: chain[0]?.slug }} className="text-sm font-semibold text-primary hover:underline">Search within this range</Link>
          </div>
          {list.length === 0 ? (
            <p className="mt-8 text-muted-foreground">No products are listed here yet. <Link to="/request-a-quote" className="text-primary hover:underline">Send your requirement</Link> and our team will help.</p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((p) => <ProductCard key={p.slug} p={p} />)}
            </div>
          )}
        </section>
      )}
      <EnquiryBand />
    </>
  );
}
