import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyticsService } from "./analytics-service";
import { 
  insertCarSchema, 
  insertServiceSchema, 
  insertTestimonialSchema,
  insertServiceBookingSchema,
  insertContactMessageSchema,
  carFiltersSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Cars routes
  app.get("/api/cars", async (req, res) => {
    try {
      // Handle array parameters from query strings
      const parseArrayParam = (param: any) => {
        if (!param) return undefined;
        return Array.isArray(param) ? param : [param];
      };

      console.log("Raw query params:", req.query);
      
      const filters = {
        make: req.query.make && req.query.make !== 'any' ? String(req.query.make) : undefined,
        model: req.query.model ? String(req.query.model) : undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice && req.query.maxPrice !== 'any' ? Number(req.query.maxPrice) : undefined,
        minYear: req.query.minYear ? Number(req.query.minYear) : undefined,
        maxYear: req.query.maxYear ? Number(req.query.maxYear) : undefined,
        minMileage: req.query.minMileage ? Number(req.query.minMileage) : undefined,
        maxMileage: req.query.maxMileage ? Number(req.query.maxMileage) : undefined,
        minMpgCity: req.query.minMpgCity ? Number(req.query.minMpgCity) : undefined,
        maxMpgCity: req.query.maxMpgCity ? Number(req.query.maxMpgCity) : undefined,
        minSafetyRating: req.query.minSafetyRating ? Number(req.query.minSafetyRating) : undefined,
        minDealerRating: req.query.minDealerRating ? Number(req.query.minDealerRating) : undefined,
        maxDaysOnMarket: req.query.maxDaysOnMarket ? Number(req.query.maxDaysOnMarket) : undefined,
        financing: req.query.financing ? req.query.financing === 'true' : undefined,
        fuelType: parseArrayParam(req.query.fuelType),
        transmission: parseArrayParam(req.query.transmission),
        drivetrain: parseArrayParam(req.query.drivetrain),
        bodyStyle: parseArrayParam(req.query.bodyStyle),
        color: parseArrayParam(req.query.color),
        interiorColor: parseArrayParam(req.query.interiorColor),
        condition: parseArrayParam(req.query.condition),
        vehicleHistory: parseArrayParam(req.query.vehicleHistory),
        features: parseArrayParam(req.query.features),
        numberOfSeats: req.query.numberOfSeats ? Number(req.query.numberOfSeats) : undefined,
        numberOfDoors: req.query.numberOfDoors ? Number(req.query.numberOfDoors) : undefined,
        status: req.query.status ? String(req.query.status) : undefined,
        sortBy: req.query.sortBy as any,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 12,
      };
      
      console.log("Processed filters:", filters);
      
      const result = await storage.getCars(filters);
      res.json(result);
    } catch (error) {
      console.error("Filter parsing error:", error);
      res.status(400).json({ message: "Invalid filter parameters", error: String(error) });
    }
  });

  app.get("/api/cars/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const car = await storage.getCar(id);
      
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.json(car);
    } catch (error) {
      res.status(400).json({ message: "Invalid car ID" });
    }
  });

  app.post("/api/cars", async (req, res) => {
    try {
      const carData = insertCarSchema.parse(req.body);
      const car = await storage.createCar(carData);
      res.status(201).json(car);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid car data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create car" });
    }
  });

  app.put("/api/cars/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const carData = insertCarSchema.partial().parse(req.body);
      const car = await storage.updateCar(id, carData);
      
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.json(car);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid car data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update car" });
    }
  });

  app.put("/api/cars/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["available", "pending", "sold"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const car = await storage.updateCarStatus(id, status);
      
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.json(car);
    } catch (error) {
      res.status(500).json({ message: "Failed to update car status" });
    }
  });

  app.delete("/api/cars/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCar(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete car" });
    }
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getService(id);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      res.status(400).json({ message: "Invalid service ID" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  app.put("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const serviceData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, serviceData);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteService(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Service bookings routes
  app.get("/api/service-bookings", async (req, res) => {
    try {
      const bookings = await storage.getServiceBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service bookings" });
    }
  });

  app.post("/api/service-bookings", async (req, res) => {
    try {
      const bookingData = insertServiceBookingSchema.parse(req.body);
      const booking = await storage.createServiceBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create service booking" });
    }
  });

  app.put("/api/service-bookings/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const booking = await storage.updateServiceBookingStatus(id, status);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const approved = req.query.approved === "true" ? true : req.query.approved === "false" ? false : undefined;
      const testimonials = await storage.getTestimonials(approved);
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.put("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonialData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(id, testimonialData);
      
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTestimonial(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // Contact messages routes
  app.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Contact messages fetch error:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.post("/api/contact-messages", async (req, res) => {
    try {
      console.log("Contact message request body:", req.body);
      const messageData = insertContactMessageSchema.parse(req.body);
      console.log("Parsed contact message data:", messageData);
      const message = await storage.createContactMessage(messageData);
      console.log("Contact message created successfully:", message);
      res.status(201).json(message);
    } catch (error) {
      console.error("Contact message error:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.put("/api/contact-messages/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["unread", "read", "responded"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const message = await storage.updateContactMessageStatus(id, status);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to update message status" });
    }
  });

  // VIN Decoder API
  app.get("/api/vin/:vin", async (req, res) => {
    try {
      const vin = req.params.vin;
      
      // Validate VIN format (17 characters, alphanumeric except I, O, Q)
      const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
      if (!vinRegex.test(vin)) {
        return res.status(400).json({ message: "Invalid VIN format" });
      }

      // Use NHTSA VIN Decoder API (free government API)
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
      const data = await response.json();
      
      if (!data.Results) {
        return res.status(404).json({ message: "VIN not found" });
      }

      // Parse the results into a more usable format
      const vinData: any = {};
      data.Results.forEach((item: any) => {
        if (item.Value && item.Value !== "Not Applicable" && item.Value !== "") {
          const key = item.Variable.replace(/\s+/g, '').replace(/[^\w]/g, '');
          vinData[key] = item.Value;
        }
      });

      res.json({
        vin: vin,
        make: vinData.Make || "",
        model: vinData.Model || "",
        year: vinData.ModelYear || "",
        bodyStyle: vinData.BodyClass || "",
        engine: vinData.EngineConfiguration || "",
        fuelType: vinData.FuelTypePrimary || "",
        transmission: vinData.TransmissionStyle || "",
        drivetrain: vinData.DriveType || "",
        vehicleType: vinData.VehicleType || "",
        manufacturer: vinData.Manufacturer || "",
        plantCountry: vinData.PlantCountry || "",
        series: vinData.Series || "",
        trim: vinData.Trim || "",
        errorCode: data.ErrorCode || "",
        errorText: data.ErrorText || ""
      });
    } catch (error) {
      console.error("VIN Decoder error:", error);
      res.status(500).json({ message: "Failed to decode VIN" });
    }
  });

  // Payment Calculator API
  app.post("/api/calculate-payment", async (req, res) => {
    try {
      const { 
        vehiclePrice, 
        downPayment = 0, 
        tradeInValue = 0, 
        interestRate = 5.99, 
        loanTermMonths = 60 
      } = req.body;

      if (!vehiclePrice || vehiclePrice <= 0) {
        return res.status(400).json({ message: "Vehicle price is required and must be positive" });
      }

      const price = parseFloat(vehiclePrice);
      const down = parseFloat(downPayment) || 0;
      const tradeIn = parseFloat(tradeInValue) || 0;
      const rate = parseFloat(interestRate) || 5.99;
      const term = parseInt(loanTermMonths) || 60;

      // Calculate loan amount
      const loanAmount = price - down - tradeIn;

      if (loanAmount <= 0) {
        return res.json({
          monthlyPayment: 0,
          totalLoanAmount: loanAmount,
          totalInterest: 0,
          totalPayments: price,
          downPaymentPercent: ((down + tradeIn) / price * 100).toFixed(1)
        });
      }

      // Calculate monthly payment using standard loan formula
      const monthlyRate = rate / 100 / 12;
      const monthlyPayment = monthlyRate > 0 
        ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
        : loanAmount / term;

      const totalPayments = monthlyPayment * term;
      const totalInterest = totalPayments - loanAmount;

      res.json({
        vehiclePrice: price,
        downPayment: down,
        tradeInValue: tradeIn,
        loanAmount: loanAmount,
        interestRate: rate,
        loanTermMonths: term,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalPayments: Math.round(totalPayments * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        downPaymentPercent: ((down + tradeIn) / price * 100).toFixed(1),
        aprEstimate: rate
      });
    } catch (error) {
      console.error("Payment calculation error:", error);
      res.status(500).json({ message: "Failed to calculate payment" });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const admin = await storage.getAdminByUsername(username);
      
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Simple password verification (in production, use bcrypt)
      if (password !== admin.passwordHash) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate session token
      const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      res.json({ 
        success: true, 
        message: "Authentication successful", 
        token: sessionToken,
        user: { username: admin.username }
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  app.post("/api/admin/setup", async (req, res) => {
    try {
      const { username, password, recoveryCode } = req.body;
      
      if (!username || !password || !recoveryCode) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if admin already exists
      const existingAdmin = await storage.getAdminByUsername(username);
      if (existingAdmin) {
        return res.status(409).json({ message: "Admin user already exists" });
      }

      // In production, hash the password with bcrypt
      const adminCredentials = {
        username,
        passwordHash: password, // Should be hashed
        recoveryCode,
        isActive: true
      };

      const admin = await storage.createAdminCredentials(adminCredentials);
      
      res.status(201).json({ 
        success: true, 
        message: "Admin credentials created successfully",
        username: admin.username
      });
    } catch (error) {
      console.error("Admin setup error:", error);
      res.status(500).json({ message: "Failed to create admin credentials" });
    }
  });

  app.post("/api/admin/change-password", async (req, res) => {
    try {
      const { username, newPassword } = req.body;
      
      if (!username || !newPassword) {
        return res.status(400).json({ message: "Username and new password are required" });
      }

      // In production, hash the password with bcrypt
      const updatedAdmin = await storage.updateAdminPassword(username, newPassword);
      
      if (!updatedAdmin) {
        return res.status(404).json({ message: "Admin user not found" });
      }

      res.json({ 
        success: true, 
        message: "Password updated successfully" 
      });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  // Backup restore endpoint
  app.post("/api/restore", async (req, res) => {
    try {
      const backupData = req.body;
      
      if (!backupData || !backupData.cars) {
        return res.status(400).json({ message: "Invalid backup data" });
      }

      let restoredCount = 0;
      let skippedCount = 0;
      const errors = [];

      // Restore cars with VIN-based duplicate detection
      if (backupData.cars && backupData.cars.cars) {
        for (const carData of backupData.cars.cars) {
          try {
            // Check if car with same VIN already exists
            const existingCars = await storage.getCars({ page: 1, limit: 1000 });
            const duplicateVin = existingCars.cars.find(car => car.vin === carData.vin);
            
            if (duplicateVin) {
              skippedCount++;
              continue;
            }

            // Remove ID to let database generate new one
            const { id, createdAt, updatedAt, ...carToRestore } = carData;
            await storage.createCar(carToRestore);
            restoredCount++;
          } catch (error) {
            errors.push(`Failed to restore car VIN ${carData.vin}: ${error.message}`);
          }
        }
      }

      res.json({
        success: true,
        message: "Backup restored successfully",
        restoredCount,
        skippedCount,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error) {
      console.error("Restore error:", error);
      res.status(500).json({ message: "Failed to restore backup" });
    }
  });

  // Database backup endpoint
  app.get("/api/backup", async (req, res) => {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        cars: await storage.getCars({ page: 1, limit: 1000 }),
        services: await storage.getServices(),
        testimonials: await storage.getTestimonials(),
        serviceBookings: await storage.getServiceBookings(),
        contactMessages: await storage.getContactMessages(),
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="integrity_auto_backup_${new Date().toISOString().split('T')[0]}.json"`);
      res.json(backupData);
    } catch (error) {
      console.error("Backup error:", error);
      res.status(500).json({ message: "Failed to create backup" });
    }
  });

  // Price history endpoint
  app.get("/api/cars/:id/price-history", async (req, res) => {
    try {
      const carId = parseInt(req.params.id);
      const priceHistory = await storage.getPriceHistory(carId);
      res.json(priceHistory);
    } catch (error) {
      console.error("Price history fetch error:", error);
      res.status(500).json({ message: "Failed to fetch price history" });
    }
  });

  // Analytics tracking endpoints
  app.post("/api/analytics/view/:carId", async (req, res) => {
    try {
      const carId = parseInt(req.params.carId);
      const { sessionId, userAgent, ipAddress, referrer } = req.body;
      
      await analyticsService.trackCarView(carId, sessionId, userAgent, ipAddress, referrer);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking view:", error);
      res.status(500).json({ message: "Failed to track view" });
    }
  });

  app.post("/api/analytics/contact/:carId", async (req, res) => {
    try {
      const carId = parseInt(req.params.carId);
      await analyticsService.trackContactInquiry(carId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking contact:", error);
      res.status(500).json({ message: "Failed to track contact" });
    }
  });

  app.post("/api/analytics/phone/:carId", async (req, res) => {
    try {
      const carId = parseInt(req.params.carId);
      await analyticsService.trackPhoneClick(carId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking phone click:", error);
      res.status(500).json({ message: "Failed to track phone click" });
    }
  });

  app.post("/api/analytics/share/:carId", async (req, res) => {
    try {
      const carId = parseInt(req.params.carId);
      await analyticsService.trackShare(carId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking share:", error);
      res.status(500).json({ message: "Failed to track share" });
    }
  });

  app.get("/api/analytics/:carId", async (req, res) => {
    try {
      const carId = parseInt(req.params.carId);
      const analytics = await analyticsService.getCarAnalytics(carId);
      res.json(analytics);
    } catch (error) {
      console.error("Error getting analytics:", error);
      res.status(500).json({ message: "Failed to get analytics" });
    }
  });

  app.put("/api/analytics/time/:carId", async (req, res) => {
    try {
      const carId = parseInt(req.params.carId);
      const { sessionId, timeSpent } = req.body;
      await analyticsService.updateTimeSpent(carId, sessionId, timeSpent);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating time spent:", error);
      res.status(500).json({ message: "Failed to update time spent" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
