// Force Google DNS
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const FoodListing = require("./models/FoodListing");
const DeliveryRequest = require("./models/DeliveryRequest");

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany();
    await FoodListing.deleteMany();
    await DeliveryRequest.deleteMany();
    console.log("Cleared existing data.");

    // Create Sample Users
    // 3 Stores
    const stores = await User.insertMany([
      { name: "John Store Manager", email: "store1@example.com", password: "password123", role: "store", phone: "555-0101", address: "123 Market St", organizationName: "Fresh Foods Bakery" },
      { name: "Sarah Produce", email: "store2@example.com", password: "password123", role: "store", phone: "555-0102", address: "456 Produce Ln", organizationName: "Green Grocers" },
      { name: "Mike Deli", email: "store3@example.com", password: "password123", role: "store", phone: "555-0103", address: "789 Deli Blvd", organizationName: "Mike's Deli" }
    ]);

    // 3 Shelters
    const shelters = await User.insertMany([
      { name: "Anna Shelter Coord", email: "shelter1@example.com", password: "password123", role: "shelter", phone: "555-0201", address: "321 Hope Ave", organizationName: "Hope Haven Shelter" },
      { name: "David Outreach", email: "shelter2@example.com", password: "password123", role: "shelter", phone: "555-0202", address: "654 Care St", organizationName: "City Care Mission" },
      { name: "Emma Relief", email: "shelter3@example.com", password: "password123", role: "shelter", phone: "555-0203", address: "987 Relief Rd", organizationName: "Family Relief Center" }
    ]);

    // 3 Volunteers
    const volunteers = await User.insertMany([
      { name: "Tom Driver", email: "volunteer1@example.com", password: "password123", role: "volunteer", phone: "555-0301", address: "111 Volunteer Way" },
      { name: "Lisa Rider", email: "volunteer2@example.com", password: "password123", role: "volunteer", phone: "555-0302", address: "222 Helping St" },
      { name: "James Walker", email: "volunteer3@example.com", password: "password123", role: "volunteer", phone: "555-0303", address: "333 Kindness Ave" }
    ]);

    console.log("Users created.");

    // Note: Due to the pre-save hook, insertMany bypasses the hook for password hashing in Mongoose unless properly configured,
    // but for testing login with bcrypt, we need to loop and save, OR manually hash. Mongoose 9 `insertMany` doesn't run `pre('save')`.
    // Let's clear and re-create properly with .create() so passwords hash.
    await User.deleteMany();
    
    // Hash passwords properly using User.create
    const store1 = await User.create({ name: "John Store Manager", email: "store1@example.com", password: "password123", role: "store", phone: "555-0101", address: "123 Market St", organizationName: "Fresh Foods Bakery" });
    const store2 = await User.create({ name: "Sarah Produce", email: "store2@example.com", password: "password123", role: "store", phone: "555-0102", address: "456 Produce Ln", organizationName: "Green Grocers" });
    const store3 = await User.create({ name: "Mike Deli", email: "store3@example.com", password: "password123", role: "store", phone: "555-0103", address: "789 Deli Blvd", organizationName: "Mike's Deli" });
    
    const shelter1 = await User.create({ name: "Anna Shelter Coord", email: "shelter1@example.com", password: "password123", role: "shelter", phone: "555-0201", address: "321 Hope Ave", organizationName: "Hope Haven Shelter" });
    const shelter2 = await User.create({ name: "David Outreach", email: "shelter2@example.com", password: "password123", role: "shelter", phone: "555-0202", address: "654 Care St", organizationName: "City Care Mission" });
    const shelter3 = await User.create({ name: "Emma Relief", email: "shelter3@example.com", password: "password123", role: "shelter", phone: "555-0203", address: "987 Relief Rd", organizationName: "Family Relief Center" });

    const vol1 = await User.create({ name: "Tom Driver", email: "volunteer1@example.com", password: "password123", role: "volunteer", phone: "555-0301", address: "111 Volunteer Way" });
    const vol2 = await User.create({ name: "Lisa Rider", email: "volunteer2@example.com", password: "password123", role: "volunteer", phone: "555-0302", address: "222 Helping St" });
    const vol3 = await User.create({ name: "James Walker", email: "volunteer3@example.com", password: "password123", role: "volunteer", phone: "555-0303", address: "333 Kindness Ave" });

    const admin1 = await User.create({ name: "System Admin", email: "admin1@example.com", password: "password123", role: "admin", phone: "555-9999", address: "HQ Tech Hub" });

    // Create Food Listings
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 24);

    const food1 = await FoodListing.create({ store: store1._id, name: "Assorted Breads", quantity: "20 loaves", expiryTime: futureDate, pickupLocation: "Back Loading Dock", description: "Freshly baked today." });
    const food2 = await FoodListing.create({ store: store2._id, name: "Organic Apples", quantity: "2 Crates", expiryTime: futureDate, pickupLocation: "Front Entrance", description: "Slightly bruised but perfectly edible." });
    const food3 = await FoodListing.create({ store: store3._id, name: "Turkey Sandwiches", quantity: "15 units", expiryTime: futureDate, pickupLocation: "Deli Counter", description: "Pre-packaged sandwiches." });
    const food4 = await FoodListing.create({ store: store1._id, name: "Pastries & Croissants", quantity: "2 large boxes", expiryTime: futureDate, pickupLocation: "Back Loading Dock", description: "End of day leftovers." });
    const food5 = await FoodListing.create({ store: store2._id, name: "Carrots & Celery", quantity: "15 lbs", expiryTime: futureDate, pickupLocation: "Front Entrance", description: "Vegetables in good condition." });

    console.log("Food listings created.");

    // Create Delivery Requests
    // Request 1: Claimed by Shelter 1, waiting for Volunteer
    food1.status = "claimed"; await food1.save();
    const req1 = await DeliveryRequest.create({ foodListing: food1._id, shelter: shelter1._id, status: "waiting" });

    // Request 2: Claimed by Shelter 2, Assigned to Volunteer 1
    food2.status = "claimed"; await food2.save();
    const req2 = await DeliveryRequest.create({ foodListing: food2._id, shelter: shelter2._id, volunteer: vol1._id, status: "assigned" });

    // Request 3: Claimed by Shelter 1, Picked-up by Volunteer 2
    food3.status = "picked-up"; await food3.save();
    const req3 = await DeliveryRequest.create({ foodListing: food3._id, shelter: shelter1._id, volunteer: vol2._id, status: "picked-up" });

    // Request 4: Claimed by Shelter 3, Delivered by Volunteer 3
    food4.status = "delivered"; await food4.save();
    const req4 = await DeliveryRequest.create({ foodListing: food4._id, shelter: shelter3._id, volunteer: vol3._id, status: "delivered" });

    console.log("Delivery requests created.");
    console.log("Database Seeded Successfully!");
    
    // Output logins for user testing
    console.log("\n--- TEST ACCOUNTS ---");
    console.log("Store: store1@example.com / password123");
    console.log("Shelter: shelter1@example.com / password123");
    console.log("Volunteer: volunteer1@example.com / password123");
    console.log("Admin: admin1@example.com / password123");

  } catch (err) {
    console.error("Failed to seed database:", err);
  } finally {
    process.exit();
  }
};

seedDatabase();
