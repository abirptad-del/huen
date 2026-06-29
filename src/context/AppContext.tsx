import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Category,
  Product,
  Order,
  Customer,
  SiteSettings,
  HomepageSection,
  HomepageSectionProduct,
} from "../types";
import { supabase } from "../supabase";
import { useAuth } from "./AuthContext";
import {
  fallbackCategories,
  fallbackProducts,
  fallbackHomepageSections,
  fallbackHomepageSectionProducts,
  fallbackTopCategories,
} from "../data/fallbackData";

const initialSettings: SiteSettings = {
  storeName: "Mokkah Fabrics",
  logoText: "Mokkah Fabrics",
  heroHeadline: "Discover Premium Quality",
  heroSubheadline:
    "We bring you the finest collection of trending styles and comfortable wear, designed to make you stand out.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
  announcementText: "FREE SHIPPING ON ORDERS OVER ৳5000",
  contactEmail: "info@mokkahfabrics.com",
  contactPhone: "+8809639279024",
  address:
    "মাকসুদ টাওয়ার লেভেল ৬, NCC ব্যাংকের নিচে ৬৫ এলিফ্যান্ট রোড, ঢাকা ১২0৫।",
  facebookUrl: "#",
  instagramUrl: "#",
  customCss: "",
};

interface AppContextType {
  categories: Category[];
  productsTrending: Product[];
  productsNew: Product[];
  allProducts: Product[];
  settings: SiteSettings;
  orders: Order[];
  customers: Customer[];
  homepageSections: HomepageSection[];
  sectionProducts: HomepageSectionProduct[];
  topCategories: any[];
  loading: boolean;
  refreshData: () => Promise<void>;
  cart?: any[];
  isDemoMode: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsTrending, setProductsTrending] = useState<Product[]>([]);
  const [productsNew, setProductsNew] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>(
    [],
  );
  const [sectionProducts, setSectionProducts] = useState<
    HomepageSectionProduct[]
  >([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchData = async () => {
    try {
      // Categories
      const { data: cats, error: catsError } = await supabase.from("categories").select("*");
      if (catsError) throw catsError;
      
      if (cats && cats.length > 0) {
        cats.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCategories(cats);
      } else {
        throw new Error("No categories found");
      }

      // Products
      const { data: prods, error: prodsError } = await supabase.from("products").select("*");
      if (prodsError) throw prodsError;
      
      if (prods && prods.length > 0) {
        const mappedProds = prods.map((p) => ({
          ...p,
          images: p.images || p.colors || [],
        }));
        setAllProducts(mappedProds);
        setProductsTrending(mappedProds.filter((p) => p.isTrending));
        const newProds = [...mappedProds].sort(
          (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
        );
        setProductsNew(newProds);
      } else {
        throw new Error("No products found");
      }

      // Settings
      const { data: sets } = await supabase
        .from("settings")
        .select("*")
        .eq("id", "store")
        .single();

      // Custom CSS
      const { data: cssData } = await supabase
        .from("homepage_content")
        .select("data")
        .eq("id", "custom_css")
        .single();

      if (sets || cssData) {
        setSettings(prev => ({ 
          ...prev, 
          ...(sets || {}),
          ...(cssData?.data || {})
        }));
      }

      // Homepage Sections
      const { data: sectionsData } = await supabase
        .from("homepage_sections")
        .select("*")
        .order("display_order", { ascending: true });
      if (sectionsData) {
        setHomepageSections(sectionsData);
      }

      // Section Products
      const { data: sectionProdsData } = await supabase
        .from("homepage_section_products")
        .select("*")
        .order("display_order", { ascending: true });
      if (sectionProdsData) {
        setSectionProducts(sectionProdsData);
      }

      // Top Categories
      const { data: tcData } = await supabase
        .from("homepage_content")
        .select("*")
        .eq("sectionType", "top_category")
        .order("order", { ascending: true });
      if (tcData) {
        setTopCategories(tcData);
      }
      
      setIsDemoMode(false);
    } catch (err) {
      console.warn("Supabase fetch failed, entering local Demo Mode with fallback data:", err);
      setIsDemoMode(true);
      
      // Load fallback categories
      setCategories(fallbackCategories as Category[]);
      
      // Load fallback products
      const mappedProds = fallbackProducts.map((p: any) => ({
        ...p,
        images: p.images || p.colors || [p.imageUrl],
      }));
      setAllProducts(mappedProds as Product[]);
      setProductsTrending(mappedProds.filter((p) => p.isTrending) as Product[]);
      const newProds = [...mappedProds].sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
      );
      setProductsNew(newProds as Product[]);
      
      // Load fallback settings
      setSettings(initialSettings);
      
      // Load fallback sections
      setHomepageSections(fallbackHomepageSections as HomepageSection[]);
      setSectionProducts(fallbackHomepageSectionProducts as HomepageSectionProduct[]);
      setTopCategories(fallbackTopCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (loading || isDemoMode) return;

    let channel: any;
    try {
      channel = supabase
        .channel("public-db-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "categories" },
          () => fetchData(),
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "products" },
          () => fetchData(),
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "settings" },
          () => fetchData(),
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "homepage_sections" },
          () => fetchData(),
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "homepage_section_products" },
          () => fetchData(),
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "homepage_content" },
          () => fetchData(),
        )
        .subscribe();
    } catch (e) {
      console.warn("Failed to subscribe to public database changes:", e);
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.warn("Failed to unsubscribe public channel:", e);
        }
      }
    };
  }, [loading, isDemoMode]);

  useEffect(() => {
    if (loading || isDemoMode) return;

    const isAdmin =
      profile?.isAdmin ||
      user?.email === "ecommercemanagement25@gmail.com" ||
      user?.email === "admin@mokkahfabrics.com";
    let channel: any;

    if (isAdmin) {
      const fetchAdminData = async () => {
        try {
          const { data: ords } = await supabase.from("orders").select("*");
          if (ords) setOrders(ords);

          const { data: custsData } = await supabase.from("users").select("*");
          if (custsData) {
            const custs = custsData
              .filter((c) => c.email)
              .map((c) => ({
                id: c.uid,
                name: c.displayName || c.email.split("@")[0],
                email: c.email,
                orders: 0,
                totalSpent: 0,
              }));
            setCustomers(custs);
          }
        } catch (e) {
          console.warn("Failed to fetch admin data:", e);
        }
      };

      fetchAdminData();

      try {
        channel = supabase
          .channel("admin-db-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "orders" },
            () => fetchAdminData(),
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "users" },
            () => fetchAdminData(),
          )
          .subscribe();
      } catch (e) {
        console.warn("Failed to subscribe to admin database changes:", e);
      }
    } else {
      setOrders([]);
      setCustomers([]);
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.warn("Failed to unsubscribe admin channel:", e);
        }
      }
    };
  }, [user, profile, loading, isDemoMode]);

  return (
    <AppContext.Provider
      value={{
        categories,
        productsTrending,
        productsNew,
        allProducts,
        settings,
        orders,
        customers,
        homepageSections,
        sectionProducts,
        topCategories,
        loading,
        refreshData: fetchData,
        isDemoMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
