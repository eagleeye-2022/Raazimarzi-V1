export const getAppUrl = () => {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  // Fallback (dev safety)
  if (!SITE_URL) {
    return "http://localhost:3001";
  }

  // Already an app subdomain → return as-is
  if (SITE_URL.includes("app.")) {
    return SITE_URL.startsWith("http")
      ? SITE_URL
      : `https://${SITE_URL}`;
  }

  // Remove protocol
  const cleanDomain = SITE_URL
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");

  return `https://app.${cleanDomain}`;
};
