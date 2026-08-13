const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectDB = require("./src/config/db");
const { startGoogleSeoAutoSync } = require("./src/utils/googleSeoSync");

const app = express();

const cdnStaticOptions = {
  setHeaders(res, filePath) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    if (/\.(css|json|txt|woff2?|ttf|eot|svg)$/i.test(filePath)) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }
  },
};

const normalizeOrigin = (value = "") => value.trim().replace(/\/$/, "");

const getOriginVariants = (value = "") => {
  const normalized = normalizeOrigin(value);

  if (!normalized) {
    return [];
  }

  try {
    const candidate = normalized.includes("://") ? normalized : `https://${normalized}`;
    const parsed = new URL(candidate);
    const variants = new Set([parsed.origin]);

    if (!["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname)) {
      variants.add(`https://${parsed.host}`);
      variants.add(`http://${parsed.host}`);
    }

    return Array.from(variants).map((origin) => normalizeOrigin(origin));
  } catch {
    return [normalized];
  }
};

const allowedOrigins = Array.from(
  new Set(
    [
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      process.env.BACKEND_URL,
      ...(process.env.CORS_ORIGINS || "").split(","),
    ]
      .flatMap((origin) => getOriginVariants(origin || ""))
      .filter(Boolean)
  )
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);
      if (!allowedOrigins.length || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/cdn/free", express.static(path.join(__dirname, "cdn/free"), cdnStaticOptions));
app.use("/cdn/pro", express.static(path.join(__dirname, "cdn/pro"), cdnStaticOptions));
app.get("/cdn/bundle-index.json", (req, res) => {
  res.sendFile(path.join(__dirname, "cdn", "bundle-index.json"));
});

try {
  app.use("/api/categories", require("./src/routes/categories.routes"));
} catch (err) {
  console.warn("categories.routes not found");
}

app.use("/api/icons", require("./src/routes/icons.routes"));

try {
  app.use("/api/users", require("./src/routes/users.routes"));
} catch (err) {
  console.warn("users.routes not found");
}

try {
  app.use("/api/tags", require("./src/routes/tags.routes"));
} catch (err) {
  console.warn("tags.routes not found");
}

try {
  app.use("/api/releases", require("./src/routes/releases.routes"));
} catch (err) {
  console.warn("releases.routes not found");
}

try {
  app.use("/api/promo", require("./src/routes/promo.routes"));
} catch (err) {
  console.warn("promo.routes not found");
}

try {
  app.use("/api/seo", require("./src/routes/seo.routes"));
} catch (err) {
  console.warn("seo.routes not found");
}

app.get("/", (req, res) => {
  res.send("Bangalicon API running...");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      startGoogleSeoAutoSync();
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
