export const getSessionCookieOptions = (maxAge = 1000 * 60 * 60 * 24 * 7) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  const options = {
    httpOnly: true,
    signed: true,
    maxAge: maxAge,
    secure: isProduction,
    sameSite: isProduction ? (process.env.COOKIE_SAME_SITE || "none") : "lax",
  };

  // If a cookie domain is explicitly specified (e.g., ".debanshupati.dev" to share between api.debanshupati.dev and debanshupati.dev)
  if (process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
  }

  return options;
};

export const getClearCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    signed: true,
    secure: isProduction,
    sameSite: isProduction ? (process.env.COOKIE_SAME_SITE || "none") : "lax",
  };

  if (process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
  }

  return options;
};
