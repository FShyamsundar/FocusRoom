const DEFAULT_DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

const normalizeOrigins = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const getAllowedOrigins = () => {
  const configuredOrigins = normalizeOrigins(process.env.CLIENT_URL);

  if (process.env.NODE_ENV === "production") {
    return configuredOrigins;
  }

  return [...new Set([...DEFAULT_DEV_ORIGINS, ...configuredOrigins])];
};

export const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = getAllowedOrigins();

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};
