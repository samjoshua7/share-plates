const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // --- Debug: check URI is loaded ---
  if (!uri) {
    console.error("[DB] ❌ MONGO_URI is not set! Check your .env file and make sure dotenv.config() runs before connectDB().");
    process.exit(1);
  }

  // Mask password in URI for safe logging
  const maskedUri = uri.replace(/:([^@]+)@/, ":<password>@");
  console.log(`[DB] Attempting to connect to: ${maskedUri}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s timeout so error surfaces faster
      connectTimeoutMS: 10000,
    });
    console.log(`[DB] ✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("\n[DB] ❌ MongoDB connection FAILED");
    console.error(`[DB]    Error code    : ${error.code || "N/A"}`);
    console.error(`[DB]    Error message : ${error.message}`);

    // Specific hints per error type
    if (error.code === "ECONNREFUSED" || error.message.includes("ECONNREFUSED")) {
      console.error("[DB] 💡 HINT: DNS lookup / SRV query was refused.");
      console.error("         → Check your network / VPN / firewall.");
      console.error("         → Make sure your IP is whitelisted in MongoDB Atlas (Network Access).");
      console.error("         → If using a local MongoDB, ensure mongod is running.");
    } else if (error.code === "ENOTFOUND" || error.message.includes("ENOTFOUND")) {
      console.error("[DB] 💡 HINT: Hostname not found.");
      console.error("         → Double-check the cluster hostname in MONGO_URI.");
      console.error(`         → URI being used: ${maskedUri}`);
    } else if (error.message.includes("Authentication failed") || error.message.includes("bad auth")) {
      console.error("[DB] 💡 HINT: Authentication failed.");
      console.error("         → Verify the username and password in MONGO_URI.");
      console.error("         → Make sure the DB user exists in MongoDB Atlas.");
    } else if (error.message.includes("ETIMEDOUT") || error.message.includes("timed out")) {
      console.error("[DB] 💡 HINT: Connection timed out.");
      console.error("         → Your IP may not be whitelisted in MongoDB Atlas.");
      console.error("         → Check Network Access → Add IP (0.0.0.0/0 for testing).");
    } else {
      console.error("[DB]    Full error   :", error);
    }

    console.error("");
    process.exit(1);
  }
};

module.exports = connectDB;
