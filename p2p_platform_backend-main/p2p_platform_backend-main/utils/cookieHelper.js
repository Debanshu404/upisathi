export const getSessionCookieOptions = (maxAge = 1000 * 60 * 60 * 24 * 7) => {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.RENDER === "true" ||
    Boolean(process.env.RENDER) ||
    process.env.COOKIE_SAME_SITE === "none";

  const options = {
    httpOnly: true,
    signed: true,
    maxAge: maxAge,
    secure: isProduction || process.env.COOKIE_SAME_SITE === "none",
    sameSite: isProduction ? (process.env.COOKIE_SAME_SITE || "none") : "lax",
    partitioned: true,
  };

  // Only apply domain if NOT running directly on Render default subdomain
  // (RFC 6265 prevents an onrender.com server from setting a cookie for debanshupati.dev)
  const cookieDomain = process.env.COOKIE_DOMAIN?.trim();
  if (cookieDomain && !process.env.RENDER) {
    options.domain = cookieDomain;
  }

  return options;
};

export const getClearCookieOptions = () => {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.RENDER === "true" ||
    Boolean(process.env.RENDER) ||
    process.env.COOKIE_SAME_SITE === "none";

  const options = {
    httpOnly: true,
    signed: true,
    secure: isProduction || process.env.COOKIE_SAME_SITE === "none",
    sameSite: isProduction ? (process.env.COOKIE_SAME_SITE || "none") : "lax",
    partitioned: true,
  };

  const cookieDomain = process.env.COOKIE_DOMAIN?.trim();
  if (cookieDomain && !process.env.RENDER) {
    options.domain = cookieDomain;
  }

  return options;
};

