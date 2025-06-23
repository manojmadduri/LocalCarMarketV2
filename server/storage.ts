import type { 
  Car, 
  InsertCar, 
  Service, 
  InsertService, 
  Testimonial, 
  InsertTestimonial,
  ServiceBooking,
  InsertServiceBooking,
  ContactMessage,
  InsertContactMessage,
  AdminCredentials,
  InsertAdminCredentials,
  CarFilters,
  CarPriceHistory 
} from "@shared/schema";

export interface IStorage {
  // Cars
  getCars(filters: CarFilters): Promise<{ cars: Car[], total: number }>;
  getCar(id: number): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined>;
  deleteCar(id: number): Promise<boolean>;
  updateCarStatus(id: number, status: string): Promise<Car | undefined>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  // Testimonials
  getTestimonials(approved?: boolean): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  // Service Bookings
  getServiceBookings(): Promise<ServiceBooking[]>;
  getServiceBooking(id: number): Promise<ServiceBooking | undefined>;
  createServiceBooking(booking: InsertServiceBooking): Promise<ServiceBooking>;
  updateServiceBookingStatus(id: number, status: string): Promise<ServiceBooking | undefined>;

  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessageStatus(id: number, status: string): Promise<ContactMessage | undefined>;

  // Admin Authentication
  getAdminByUsername(username: string): Promise<AdminCredentials | undefined>;
  createAdminCredentials(credentials: InsertAdminCredentials): Promise<AdminCredentials>;
  updateAdminPassword(username: string, passwordHash: string): Promise<AdminCredentials | undefined>;

  // Price History
  trackPriceChange(carId: number, oldPrice: string | null, newPrice: string, reason?: string): Promise<void>;
  getPriceHistory(carId: number): Promise<CarPriceHistory[]>;
}

// Import and use the database storage implementation
import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();