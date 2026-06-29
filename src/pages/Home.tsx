import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { CategoryGrid } from "../components/CategoryGrid";
import { ProductSection } from "../components/ProductSection";
import { Footer } from "../components/Footer";
import { useAppContext } from "../context/AppContext";

export const Home = () => {
  const { homepageSections, sectionProducts, categories, allProducts, topCategories } =
    useAppContext();

  // Filter sections that are active
  const activeSections = homepageSections?.filter((s) => s.is_active) || [];
  const activeTopCategories = topCategories?.filter((c) => c.isActive) || [];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <Header />

      <main>
        <Hero />

        {/* LAYER 1: Category Showcase */}
        <CategoryGrid />

        {/* LAYER 2: TOP Categories */}
        {activeTopCategories.map((tc, index) => {
          const productIds: string[] = tc.data?.productIds || [];
          const products = productIds
            .map((id) => allProducts.find((p) => p.id === id))
            .filter(Boolean) as typeof allProducts;

          if (products.length === 0) return null;

          return (
            <ProductSection
              key={`tc-${tc.id}-${index}`}
              title={tc.title}
              products={products}
              theme="rose"
              viewMoreUrl={`/shop?category=${encodeURIComponent(tc.title.toLowerCase().replace(/\s+/g, '-'))}`}
            />
          );
        })}

        {/* LAYER 3: Normal Categories (Homepage Sections) */}
        {activeSections.map((section, index) => {
          // Get assigned product IDs for this section
          const productMappings = sectionProducts
            .filter((sp) => sp.section_id === section.id)
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

          const productIds = productMappings.map((sp) => sp.product_id);

          // Get products requested map
          const products = productIds
            .map((id) => allProducts.find((p) => p.id === id))
            .filter(Boolean) as typeof allProducts;

          const theme = index % 2 === 0 ? "purple" : "rose";

          return (
            <ProductSection
              key={`sec-${section.id}-${index}`}
              title={section.title}
              products={products}
              theme={theme}
              viewMoreUrl={`/shop?category=${encodeURIComponent(section.title.toLowerCase().replace(/\s+/g, '-'))}`}
            />
          );
        })}
      </main>

      <Footer />
    </div>
  );
};
