/**
 * Hostname & Path Routing Utilities for Admin 360 & Customer Storefront
 */

export function isExplicitAdminHost(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  // Production dedicated subdomain:
  if (host === 'admin360.huenvibes.xyz' || host.startsWith('admin360.')) {
    return true;
  }
  // Alternate admin subdomains if any:
  if (host.startsWith('admin.') || host === 'admin.huenvibes.xyz') {
    return true;
  }
  return false;
}

export function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  
  // 1. Check Subdomain
  if (isExplicitAdminHost()) {
    return true;
  }

  // 2. Development / Localhost / Query testing fallback
  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();

  if (
    path.startsWith('/admin') ||
    host === 'admin360.localhost' ||
    host === 'admin.localhost' ||
    search.includes('admin=true') ||
    search.includes('view=admin')
  ) {
    return true;
  }

  return false;
}

/**
 * Normalizes the current admin sub-path.
 * If on admin360.huenvibes.xyz and path is "/products", returns "/products".
 * If in dev mode on localhost:3000 and path is "/admin/products", returns "/products".
 */
export function getAdminCurrentPath(): string {
  if (typeof window === 'undefined') return '/';
  let path = window.location.pathname;

  if (path.startsWith('/admin')) {
    path = path.replace(/^\/admin/, '') || '/';
  }

  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  return path;
}

/**
 * Builds the appropriate href/path for navigation
 */
export function formatAdminHref(subPath: string): string {
  const normalized = subPath.startsWith('/') ? subPath : '/' + subPath;
  if (isExplicitAdminHost() || window.location.hostname.includes('admin360')) {
    return normalized;
  }
  // If in dev / preview:
  if (normalized === '/' || normalized === '') {
    return '/admin';
  }
  return `/admin${normalized}`;
}

/**
 * Navigate to an admin route
 */
export function navigateAdmin(subPath: string) {
  if (typeof window === 'undefined') return;
  const targetUrl = formatAdminHref(subPath);
  window.history.pushState({}, '', targetUrl);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

/**
 * Opens Admin Portal from Customer Website with environment awareness
 */
export function openAdminPortal() {
  if (typeof window === 'undefined') return;
  const host = window.location.hostname.toLowerCase();
  
  // Production customer domain: open dedicated admin subdomain
  if (host === 'huenvibes.xyz' || host === 'www.huenvibes.xyz') {
    window.location.href = 'https://admin360.huenvibes.xyz';
    return;
  }
  
  // If already on admin subdomain:
  if (host === 'admin360.huenvibes.xyz' || host.startsWith('admin360.')) {
    navigateAdmin('/');
    return;
  }

  // Localhost / AI Studio preview environment: navigate directly to /admin
  window.history.pushState({}, '', '/admin');
  window.dispatchEvent(new PopStateEvent('popstate'));
}
