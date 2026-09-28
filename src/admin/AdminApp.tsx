import React, { useState, useEffect } from 'react';
import {
  AdminUser,
  AdminProduct,
  AdminCategory,
  AdminOrder,
  AdminCustomer,
  AdminCoupon,
  AdminReview,
  StoreSettings,
  getAdminAuthUser,
  setAdminAuthUser,
  getAdminProducts,
  getAdminCategories,
  getAdminOrders,
  getAdminCustomers,
  getAdminCoupons,
  getAdminReviews,
  getStoreSettings,
} from './adminStore';
import {
  fetchCategoriesFromDb,
  saveCategoryToDb,
  fetchProductsFromDb,
  saveProductToDb,
  deleteProductFromDb,
  fetchOrdersFromDb,
  updateOrderStatusInDb,
  fetchCustomersFromDb,
  fetchCouponsFromDb,
  saveCouponToDb,
  deleteCouponFromDb,
  fetchReviewsFromDb,
  updateReviewStatusInDb,
  fetchStoreSettingsFromDb,
  updateStoreSettingsInDb,
} from '../lib/supabaseService';
import { getAdminCurrentPath, navigateAdmin } from './adminRouting';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { CustomersPage } from './pages/CustomersPage';
import { CouponsPage } from './pages/CouponsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { SettingsPage } from './pages/SettingsPage';

export const AdminApp: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(getAdminAuthUser);
  const [currentPath, setCurrentPath] = useState<string>(getAdminCurrentPath);

  // Store States initialized from local storage then refreshed from Supabase
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>(getAdminCategories);
  const [orders, setOrders] = useState<AdminOrder[]>(getAdminOrders);
  const [customers, setCustomers] = useState<AdminCustomer[]>(getAdminCustomers);
  const [coupons, setCoupons] = useState<AdminCoupon[]>(getAdminCoupons);
  const [reviews, setReviews] = useState<AdminReview[]>(getAdminReviews);
  const [settings, setSettings] = useState<StoreSettings>(getStoreSettings);

  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [isSupabaseMissing, setIsSupabaseMissing] = useState(false);

  // Initial Data Fetch from Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (isMounted) {
        setIsLoadingProducts(true);
        setProductsError(null);
        setIsSupabaseMissing(false);
      }

      const { isSupabaseConfigured } = await import('../lib/supabase');
      if (!isSupabaseConfigured()) {
        if (isMounted) {
          setIsSupabaseMissing(true);
          setIsLoadingProducts(false);
        }
        return;
      }

      try {
        const [cats, prods, ords, custs, coups, revs, sttngs] = await Promise.all([
          fetchCategoriesFromDb().catch(() => []),
          fetchProductsFromDb(),
          fetchOrdersFromDb().catch(() => []),
          fetchCustomersFromDb().catch(() => []),
          fetchCouponsFromDb().catch(() => []),
          fetchReviewsFromDb().catch(() => []),
          fetchStoreSettingsFromDb().catch(() => getStoreSettings()),
        ]);
        if (isMounted) {
          if (cats) setCategories(cats);
          if (prods) setProducts(prods);
          if (ords) setOrders(ords);
          if (custs) setCustomers(custs);
          if (coups) setCoupons(coups);
          if (revs) setReviews(revs);
          if (sttngs) setSettings(sttngs);
          setIsLoadingProducts(false);
        }
      } catch (err: any) {
        console.warn('Initial admin data fetch error:', err);
        if (isMounted) {
          setProductsError(err.message || 'Failed to retrieve products from database.');
          setIsLoadingProducts(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for browser popstate / back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getAdminCurrentPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update document title for Admin 360
  useEffect(() => {
    document.title = 'hue n vibes - Admin 360 Control Center';
  }, []);

  // Product CRUD
  const handleSaveProduct = async (product: AdminProduct) => {
    const tempId = product.id;
    const existingIndex = products.findIndex((p) => p.id === tempId);
    let tempUpdated: AdminProduct[];
    if (existingIndex >= 0) {
      tempUpdated = [...products];
      tempUpdated[existingIndex] = product;
    } else {
      tempUpdated = [product, ...products];
    }
    setProducts(tempUpdated);

    try {
      const savedProduct = await saveProductToDb(product);
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p.id === tempId || p.id === savedProduct.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = savedProduct;
          return next;
        }
        return [savedProduct, ...prev];
      });
    } catch (err) {
      console.error('Failed to save product completely:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    await deleteProductFromDb(productId);
  };

  const handleToggleProductStatus = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const newStatus: AdminProduct['status'] =
      target.status === 'Published' ? 'Draft' : 'Published';
    const updatedProduct = { ...target, status: newStatus };

    const updated = products.map((p) => (p.id === productId ? updatedProduct : p));
    setProducts(updated);

    try {
      const savedProduct = await saveProductToDb(updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId || p.id === savedProduct.id ? savedProduct : p))
      );
    } catch (err) {
      console.error('Failed to toggle product status:', err);
    }
  };

  // Category CRUD
  const handleSaveCategory = async (category: AdminCategory) => {
    const existingIndex = categories.findIndex((c) => c.id === category.id);
    let updated: AdminCategory[];
    if (existingIndex >= 0) {
      updated = [...categories];
      updated[existingIndex] = category;
    } else {
      updated = [...categories, category];
    }
    setCategories(updated);
    await saveCategoryToDb(category);
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: AdminOrder['status']) => {
    const updated = orders.map((o) => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return {
          ...o,
          status: newStatus,
          paymentStatus: newStatus === 'Delivered' ? ('Paid' as const) : o.paymentStatus,
        };
      }
      return o;
    });
    setOrders(updated);
    await updateOrderStatusInDb(orderId, newStatus);
  };

  // Coupons
  const handleSaveCoupon = async (coupon: AdminCoupon) => {
    const updated = [coupon, ...coupons.filter((c) => c.id !== coupon.id)];
    setCoupons(updated);
    await saveCouponToDb(coupon);
  };

  const handleDeleteCoupon = async (id: string) => {
    const updated = coupons.filter((c) => c.id !== id);
    setCoupons(updated);
    await deleteCouponFromDb(id);
  };

  // Reviews
  const handleUpdateReviewStatus = async (id: string, status: AdminReview['status']) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, status } : r));
    setReviews(updated);
    await updateReviewStatusInDb(id, status);
  };

  // Settings
  const handleSaveSettings = async (newSettings: StoreSettings) => {
    setSettings(newSettings);
    await updateStoreSettingsInDb(newSettings);
  };

  // Logout
  const handleLogout = () => {
    setAdminAuthUser(null);
    setCurrentUser(null);
  };

  // If not authenticated, always show AdminLogin
  if (!currentUser) {
    return <AdminLogin onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // Count pending orders for badge
  const pendingCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Processing'
  ).length;

  // Render subpage according to currentPath
  const renderCurrentPage = () => {
    if (isLoadingProducts) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-[14px] p-8 border border-gray-200/70 shadow-xs">
          <div className="w-10 h-10 border-4 border-[#1299E8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-700 mt-4">Connecting to database...</p>
          <p className="text-xs text-gray-500 mt-1">Retrieving latest product catalog from Supabase.</p>
        </div>
      );
    }

    if (isSupabaseMissing) {
      return (
        <div className="bg-red-50/50 border border-red-200 rounded-[14px] p-6 max-w-2xl mx-auto my-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-red-100 text-red-700 rounded-lg shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-950 text-base">Supabase Connection Misconfigured</h3>
              <p className="text-sm text-gray-600 mt-1">
                The connection variables <code className="font-mono bg-red-50 px-1 py-0.5 rounded text-red-800">VITE_SUPABASE_URL</code> or <code className="font-mono bg-red-50 px-1 py-0.5 rounded text-red-800">VITE_SUPABASE_ANON_KEY</code> are missing or set to placeholder values.
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Please make sure your environment variables are configured with valid credentials of your Supabase project. LocalStorage fallback catalog has been permanently disabled.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (productsError) {
      return (
        <div className="bg-amber-50/50 border border-amber-200 rounded-[14px] p-6 max-w-2xl mx-auto my-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-950 text-base">Database Request Failed</h3>
              <p className="text-sm text-gray-600 mt-1">
                An error occurred while fetching the product catalog from your database:
              </p>
              <div className="mt-2 bg-white p-3 rounded-lg border border-amber-200 text-xs font-mono text-amber-900 overflow-x-auto">
                {productsError}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Fallback offline cache has been removed. Please check your Supabase project connection and try again.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // 1. Dashboard: "/" or "/dashboard"
    if (currentPath === '/' || currentPath === '/dashboard' || currentPath === '') {
      return <DashboardPage products={products} orders={orders} customers={customers} />;
    }

    // 2. New Product: "/products/new"
    if (currentPath === '/products/new') {
      return (
        <ProductFormPage
          productId="new"
          categories={categories}
          products={products}
          onSaveProduct={handleSaveProduct}
        />
      );
    }

    // 3. Edit Product: "/products/:id/edit"
    const editProductMatch = currentPath.match(/^\/products\/(.+)\/edit$/);
    if (editProductMatch) {
      const prodId = editProductMatch[1];
      return (
        <ProductFormPage
          productId={prodId}
          categories={categories}
          products={products}
          onSaveProduct={handleSaveProduct}
        />
      );
    }

    // 4. Products list: "/products"
    if (currentPath === '/products') {
      return (
        <ProductsPage
          products={products}
          categories={categories}
          onDeleteProduct={handleDeleteProduct}
          onToggleStatus={handleToggleProductStatus}
        />
      );
    }

    // 5. Categories: "/categories"
    if (currentPath === '/categories') {
      return (
        <CategoriesPage
          categories={categories}
          onSaveCategory={handleSaveCategory}
        />
      );
    }

    // 6. Order Details: "/orders/:id"
    const orderDetailMatch = currentPath.match(/^\/orders\/(.+)$/);
    if (orderDetailMatch && orderDetailMatch[1] !== '') {
      const ordId = orderDetailMatch[1];
      return (
        <OrderDetailPage
          orderId={ordId}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      );
    }

    // 7. Orders list: "/orders"
    if (currentPath === '/orders') {
      return (
        <OrdersPage
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      );
    }

    // 8. Customers: "/customers"
    if (currentPath === '/customers') {
      return <CustomersPage customers={customers} />;
    }

    // 9. Coupons: "/coupons"
    if (currentPath === '/coupons') {
      return (
        <CouponsPage
          coupons={coupons}
          onSaveCoupon={handleSaveCoupon}
          onDeleteCoupon={handleDeleteCoupon}
        />
      );
    }

    // 10. Reviews: "/reviews"
    if (currentPath === '/reviews') {
      return (
        <ReviewsPage
          reviews={reviews}
          onUpdateReviewStatus={handleUpdateReviewStatus}
        />
      );
    }

    // 11. Settings: "/settings"
    if (currentPath === '/settings') {
      return (
        <SettingsPage
          settings={settings}
          onSaveSettings={handleSaveSettings}
        />
      );
    }

    // Fallback: Dashboard
    return <DashboardPage products={products} orders={orders} customers={customers} />;
  };

  return (
    <AdminLayout
      currentPath={currentPath}
      user={currentUser}
      pendingOrdersCount={pendingCount}
      onLogout={handleLogout}
    >
      {renderCurrentPage()}
    </AdminLayout>
  );
};
