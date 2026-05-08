require("dotenv").config();
const app  = require("./src/app.js");
const prisma = require("./src/lib/prisma.js");

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    // Database connection
    await prisma.$connect();
    console.log("✅ Database terhubung");

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Gagal terhubung ke database:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n⚠️  ${signal} diterima. Menutup server...`);
  await prisma.$disconnect();
  console.log("🔌 Database terputus. Server berhenti.");
  process.exit(0);
};

process.on("SIGINT",  () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  process.exit(1);
});

start();