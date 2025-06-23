import {
  cars,
  services,
  testimonials,
  serviceBookings,
  contactMessages,
  adminCredentials,
  carPriceHistory,
  type Car,
  type InsertCar,
  type Service,
  type InsertService,
  type Testimonial,
  type InsertTestimonial,
  type ServiceBooking,
  type InsertServiceBooking,
  type ContactMessage,
  type InsertContactMessage,
  type AdminCredentials,
  type InsertAdminCredentials,
  type CarFilters,
  type CarPriceHistory,
  type InsertCarPriceHistory
} from "@shared/schema";
import { db } from "./db";
import { pool } from "./db";
import { eq, and, gte, lte, ilike, inArray, desc, asc, sql } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Cars
  async getCars(filters: CarFilters): Promise<{ cars: Car[], total: number }> {
    console.log("Database getCars called with filters:", filters);
    const conditions = [];
    
    // Handle make filter - can be string or array
    if (filters.make) {
      if (Array.isArray(filters.make) && filters.make.length > 0) {
        conditions.push(inArray(cars.make, filters.make));
      } else if (typeof filters.make === 'string' && filters.make.trim() && filters.make !== 'any') {
        conditions.push(eq(cars.make, filters.make));
      }
    }
    
    if (filters.model) {
      conditions.push(ilike(cars.model, `%${filters.model}%`));
    }
    
    if (filters.minYear) {
      conditions.push(gte(cars.year, filters.minYear));
    }
    
    if (filters.maxYear) {
      conditions.push(lte(cars.year, filters.maxYear));
    }
    
    if (filters.minPrice && filters.minPrice > 0) {
      conditions.push(gte(sql`CAST(${cars.price} AS NUMERIC)`, filters.minPrice));
    }
    
    if (filters.maxPrice && filters.maxPrice > 0) {
      conditions.push(lte(sql`CAST(${cars.price} AS NUMERIC)`, filters.maxPrice));
    }
    
    if (filters.minMileage) {
      conditions.push(gte(cars.mileage, filters.minMileage));
    }
    
    if (filters.maxMileage) {
      conditions.push(lte(cars.mileage, filters.maxMileage));
    }
    
    // Handle fuel type filter - ensure array has elements
    if (filters.fuelType && Array.isArray(filters.fuelType) && filters.fuelType.length > 0) {
      conditions.push(inArray(cars.fuelType, filters.fuelType));
    }

    if (filters.transmission && filters.transmission.length > 0) {
      conditions.push(inArray(cars.transmission, filters.transmission));
    }

    if (filters.drivetrain && filters.drivetrain.length > 0) {
      conditions.push(inArray(cars.drivetrain, filters.drivetrain));
    }

    if (filters.bodyStyle && filters.bodyStyle.length > 0) {
      conditions.push(inArray(cars.bodyStyle, filters.bodyStyle));
    }

    if (filters.color && filters.color.length > 0) {
      conditions.push(inArray(cars.color, filters.color));
    }

    if (filters.interiorColor && filters.interiorColor.length > 0) {
      conditions.push(inArray(cars.interiorColor, filters.interiorColor));
    }

    if (filters.condition && filters.condition.length > 0) {
      conditions.push(inArray(cars.condition, filters.condition));
    }

    if (filters.numberOfSeats) {
      conditions.push(eq(cars.numberOfSeats, filters.numberOfSeats));
    }

    if (filters.numberOfDoors) {
      conditions.push(eq(cars.numberOfDoors, filters.numberOfDoors));
    }

    if (filters.minMpgCity) {
      conditions.push(gte(cars.mpgCity, filters.minMpgCity));
    }

    if (filters.maxMpgCity) {
      conditions.push(lte(cars.mpgCity, filters.maxMpgCity));
    }

    if (filters.minSafetyRating && cars.safetyRating) {
      conditions.push(sql`${cars.safetyRating} >= ${filters.minSafetyRating}`);
    }

    if (filters.minDealerRating && cars.dealerRating) {
      conditions.push(sql`${cars.dealerRating} >= ${filters.minDealerRating}`);
    }

    if (filters.maxDaysOnMarket) {
      conditions.push(lte(cars.daysOnMarket, filters.maxDaysOnMarket));
    }

    if (filters.vehicleHistory && filters.vehicleHistory.length > 0) {
      conditions.push(inArray(cars.vehicleHistory, filters.vehicleHistory));
    }

    if (filters.financing !== undefined) {
      conditions.push(eq(cars.financing, filters.financing));
    }

    if (filters.features && filters.features.length > 0) {
      // Check if car features array contains any of the requested features
      filters.features.forEach(feature => {
        conditions.push(sql`${cars.features} @> ARRAY[${feature}]`);
      });
    }

    if (filters.trim) {
      conditions.push(ilike(cars.trim, `%${filters.trim}%`));
    }

    if (filters.engine) {
      conditions.push(ilike(cars.engine, `%${filters.engine}%`));
    }

    if (filters.status) {
      conditions.push(eq(cars.status, filters.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Handle sorting with comprehensive options
    let orderByClause;
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          orderByClause = asc(sql`CAST(REPLACE(REPLACE(${cars.price}, '$', ''), ',', '') AS NUMERIC)`);
          break;
        case 'price_desc':
          orderByClause = desc(sql`CAST(REPLACE(REPLACE(${cars.price}, '$', ''), ',', '') AS NUMERIC)`);
          break;
        case 'year_desc':
          orderByClause = desc(cars.year);
          break;
        case 'year_asc':
          orderByClause = asc(cars.year);
          break;
        case 'mileage_asc':
          orderByClause = asc(cars.mileage);
          break;
        case 'mileage_desc':
          orderByClause = desc(cars.mileage);
          break;
        case 'newest':
          orderByClause = desc(cars.createdAt);
          break;
        case 'oldest':
          orderByClause = asc(cars.createdAt);
          break;
        case 'popular':
          // Sort by total views from analytics (need to join with car_analytics)
          orderByClause = desc(sql`COALESCE((SELECT total_views FROM car_analytics WHERE car_id = ${cars.id}), 0)`);
          break;
        case 'recently_viewed':
          // Sort by most recent view timestamp
          orderByClause = desc(sql`COALESCE((SELECT MAX(viewed_at) FROM car_view_log WHERE car_id = ${cars.id}), ${cars.createdAt})`);
          break;
        case 'alphabetical':
          orderByClause = asc(sql`${cars.make} || ' ' || ${cars.model}`);
          break;
        case 'best_value':
          // Sort by best value (lowest price per year ratio)
          orderByClause = asc(sql`CAST(REPLACE(REPLACE(${cars.price}, '$', ''), ',', '') AS NUMERIC) / GREATEST(${cars.year}, 1990)`);
          break;
        case 'safety_rating':
          orderByClause = desc(cars.safetyRating);
          break;
        case 'dealer_rating':
          orderByClause = desc(cars.dealerRating);
          break;
        default:
          orderByClause = desc(cars.createdAt);
      }
    } else {
      orderByClause = desc(cars.createdAt);
    }

    const [carsResult, totalResult] = await Promise.all([
      db.select().from(cars).where(whereClause).limit(filters.limit || 12).offset(((filters.page || 1) - 1) * (filters.limit || 12)).orderBy(orderByClause),
      db.select({ count: sql`count(*)` }).from(cars).where(whereClause)
    ]);

    return {
      cars: carsResult,
      total: Number(totalResult[0]?.count || 0)
    };
  }

  async getCar(id: number): Promise<Car | undefined> {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return car;
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const [car] = await db
      .insert(cars)
      .values({
        ...insertCar,
        status: insertCar.status || "available",
        condition: insertCar.condition || "used",
        images: insertCar.images || [],
        features: insertCar.features || [],
        createdAt: new Date()
      })
      .returning();
    return car;
  }

  async updateCar(id: number, carUpdate: Partial<InsertCar>): Promise<Car | undefined> {
    // Get current car data to track price changes
    const currentCar = await this.getCar(id);
    
    const [car] = await db
      .update(cars)
      .set(carUpdate)
      .where(eq(cars.id, id))
      .returning();
    
    // Track price changes
    if (carUpdate.price && currentCar && currentCar.price !== carUpdate.price) {
      const oldPriceNum = parseFloat(currentCar.price.replace(/[^0-9.-]+/g, ""));
      const newPriceNum = parseFloat(carUpdate.price.replace(/[^0-9.-]+/g, ""));
      const reason = newPriceNum > oldPriceNum ? "Price increased" : "Price decreased";
      await this.trackPriceChange(id, currentCar.price, carUpdate.price, reason);
    }
    
    return car;
  }

  async deleteCar(id: number): Promise<boolean> {
    const result = await db.delete(cars).where(eq(cars.id, id));
    return (result.rowCount || 0) > 0;
  }

  async updateCarStatus(id: number, status: string): Promise<Car | undefined> {
    const [car] = await db
      .update(cars)
      .set({ status })
      .where(eq(cars.id, id))
      .returning();
    return car;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(asc(services.id));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values({
        ...insertService,
        features: insertService.features || [],
        isActive: insertService.isActive !== undefined ? insertService.isActive : true
      })
      .returning();
    return service;
  }

  async updateService(id: number, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
    const [service] = await db
      .update(services)
      .set(serviceUpdate)
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Testimonials
  async getTestimonials(approved?: boolean): Promise<Testimonial[]> {
    const whereClause = approved !== undefined ? eq(testimonials.isApproved, approved) : undefined;
    return await db.select().from(testimonials).where(whereClause).orderBy(desc(testimonials.createdAt));
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values({
        ...insertTestimonial,
        isApproved: insertTestimonial.isApproved !== undefined ? insertTestimonial.isApproved : false,
        createdAt: new Date()
      })
      .returning();
    return testimonial;
  }

  async updateTestimonial(id: number, testimonialUpdate: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .update(testimonials)
      .set(testimonialUpdate)
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Service Bookings
  async getServiceBookings(): Promise<ServiceBooking[]> {
    return await db.select().from(serviceBookings).orderBy(desc(serviceBookings.createdAt));
  }

  async getServiceBooking(id: number): Promise<ServiceBooking | undefined> {
    const [booking] = await db.select().from(serviceBookings).where(eq(serviceBookings.id, id));
    return booking;
  }

  async createServiceBooking(insertBooking: InsertServiceBooking): Promise<ServiceBooking> {
    const [booking] = await db
      .insert(serviceBookings)
      .values({
        ...insertBooking,
        status: "pending",
        createdAt: new Date()
      })
      .returning();
    return booking;
  }

  async updateServiceBookingStatus(id: number, status: string): Promise<ServiceBooking | undefined> {
    const [booking] = await db
      .update(serviceBookings)
      .set({ status })
      .where(eq(serviceBookings.id, id))
      .returning();
    return booking;
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    } catch (error) {
      console.error('Contact messages fetch error:', error);
      throw error;
    }
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    try {
      const [message] = await db
        .insert(contactMessages)
        .values(insertMessage)
        .returning();
      return message;
    } catch (error) {
      console.error('Contact message creation error:', error);
      throw error;
    }
  }

  async updateContactMessageStatus(id: number, status: string): Promise<ContactMessage | undefined> {
    const [message] = await db
      .update(contactMessages)
      .set({ status })
      .where(eq(contactMessages.id, id))
      .returning();
    return message;
  }

  // Admin Authentication
  async getAdminByUsername(username: string): Promise<AdminCredentials | undefined> {
    const [admin] = await db
      .select()
      .from(adminCredentials)
      .where(and(eq(adminCredentials.username, username), eq(adminCredentials.isActive, true)));
    return admin;
  }

  async createAdminCredentials(credentials: InsertAdminCredentials): Promise<AdminCredentials> {
    const [admin] = await db
      .insert(adminCredentials)
      .values(credentials)
      .returning();
    return admin;
  }

  async updateAdminPassword(username: string, passwordHash: string): Promise<AdminCredentials | undefined> {
    const [admin] = await db
      .update(adminCredentials)
      .set({ 
        passwordHash,
        updatedAt: new Date()
      })
      .where(eq(adminCredentials.username, username))
      .returning();
    return admin;
  }

  // Price history tracking
  async trackPriceChange(carId: number, oldPrice: string | null, newPrice: string, reason?: string): Promise<void> {
    try {
      await db.execute(sql`
        INSERT INTO car_price_history ("carId", "oldPrice", "newPrice", reason)
        VALUES (${carId}, ${oldPrice}, ${newPrice}, ${reason || "Price updated"})
      `);
    } catch (error) {
      console.error('Error tracking price change:', error);
    }
  }

  async getPriceHistory(carId: number): Promise<CarPriceHistory[]> {
    try {
      const result = await db.execute(sql`
        SELECT id, "carId", "oldPrice", "newPrice", reason, "changedAt"
        FROM car_price_history
        WHERE "carId" = ${carId}
        ORDER BY "changedAt" ASC
      `);
      
      const history = result.rows.map(row => ({
        id: row.id as number,
        carId: row.carId as number,
        oldPrice: row.oldPrice as string | null,
        newPrice: row.newPrice as string,
        reason: row.reason as string | null,
        changedAt: new Date(row.changedAt as string)
      }));

      // If no history exists, create initial listing price entry
      if (history.length === 0) {
        const car = await this.getCar(carId);
        if (car) {
          // Add initial listing price to history
          await this.trackPriceChange(carId, null, car.price, "Initial listing price");
          return [{
            id: 0,
            carId: carId,
            oldPrice: null,
            newPrice: car.price,
            reason: "Initial listing price",
            changedAt: new Date()
          }];
        }
      }

      return history;
    } catch (error) {
      console.error('Price history query error:', error);
      return [];
    }
  }
}