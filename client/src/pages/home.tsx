import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CarCard from "@/components/car-card";
import ServiceCard from "@/components/service-card";
import TestimonialCard from "@/components/testimonial-card";
import TestimonialCarousel from "@/components/testimonial-carousel";
import { Search, Car, Wrench, Users, Award } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import type { Car as CarType, Service, Testimonial } from "@shared/schema";

export default function Home() {
  useScrollToTop(); // Scroll to top when navigating to this page
  
  const [, setLocation] = useLocation();
  const [searchMake, setSearchMake] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchResults, setSearchResults] = useState<CarType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get all cars for dynamic filtering
  const { data: allCarsData } = useQuery<{ cars: CarType[], total: number }>({
    queryKey: ["/api/cars", { limit: 100 }],
  });

  const { data: carsData, isLoading: carsLoading } = useQuery<{ cars: CarType[], total: number }>({
    queryKey: ["/api/cars", { limit: 6, status: "available" }],
  });

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials", { approved: true }],
  });

  const featuredCars = carsData?.cars || [];
  const featuredServices = services?.slice(0, 6) || [];
  const approvedTestimonials = testimonials || [];

  // Generate dynamic filters from database
  const availableMakes = useMemo(() => {
    if (!allCarsData?.cars) return [];
    const makes: string[] = [];
    const seen = new Set<string>();
    
    allCarsData.cars.forEach(car => {
      if (car.make && !seen.has(car.make)) {
        seen.add(car.make);
        makes.push(car.make);
      }
    });
    
    return makes.sort();
  }, [allCarsData]);

  const availableModels = useMemo(() => {
    if (!allCarsData?.cars) return [];
    const models: string[] = [];
    const seen = new Set<string>();
    let filteredCars = allCarsData.cars;
    
    if (searchMake && searchMake !== "any") {
      filteredCars = allCarsData.cars.filter(car => car.make === searchMake);
    }
    
    filteredCars.forEach(car => {
      if (car.model && !seen.has(car.model)) {
        seen.add(car.model);
        models.push(car.model);
      }
    });
    
    return models.sort();
  }, [allCarsData, searchMake]);

  // Fuzzy search implementation
  const fuzzyMatch = (text: string, search: string): boolean => {
    if (!text || !search) return true;
    const normalizedText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedSearch = search.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalizedText.includes(normalizedSearch);
  };

  // Real-time search functionality
  useEffect(() => {
    if (!searchMake && !searchModel && !maxPrice) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const allCars = allCarsData?.cars || [];
    
    const filtered = allCars.filter(car => {
      // Make filter with fuzzy matching
      if (searchMake && searchMake !== "any") {
        if (!fuzzyMatch(car.make, searchMake)) return false;
      }
      
      // Model filter with fuzzy matching
      if (searchModel && searchModel !== "any") {
        if (!fuzzyMatch(car.model, searchModel)) return false;
      }
      
      // Price filter
      if (maxPrice && maxPrice !== "any") {
        const price = parseFloat(car.price);
        const maxPriceNum = parseFloat(maxPrice);
        if (price > maxPriceNum) return false;
      }
      
      return car.status === "available";
    });

    setSearchResults(filtered);
    setIsSearching(false);
  }, [searchMake, searchModel, maxPrice, allCarsData]);

  const handleQuickSearch = () => {
    const params = new URLSearchParams();
    if (searchMake && searchMake !== "any") params.set("make", searchMake);
    if (searchModel && searchModel !== "any") params.set("model", searchModel);
    if (maxPrice && maxPrice !== "any") params.set("maxPrice", maxPrice);
    
    setLocation(`/cars?${params.toString()}`);
  };

  return (
    <div className="min-h-screen page-transition">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=1080&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-white z-10">
          <div className="text-center">
            <h1 className="hero-title mb-8 text-white font-extrabold" style={{
              textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9), 1px 1px 3px rgba(0, 0, 0, 0.7)',
              color: '#ffffff',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: '900'
            }}>
              The Integrity Auto & Body
            </h1>
            <p className="text-lead md:text-2xl mb-12 text-white font-semibold max-w-4xl mx-auto" style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 1px 1px 2px rgba(0, 0, 0, 0.6)',
              color: '#ffffff',
              fontSize: 'clamp(1.125rem, 2.5vw, 1.75rem)',
              fontWeight: '600'
            }}>
              Quality used cars and expert repair services all in one place
            </p>
            
            {/* Quick Search Bar */}
            <Card className="max-w-4xl mx-auto shadow-2xl slide-up relative z-10 bg-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={searchMake} onValueChange={setSearchMake}>
                    <SelectTrigger className="bg-white relative z-20">
                      <SelectValue placeholder="Any Make" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="any">Any Make</SelectItem>
                      {availableMakes.map(make => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={searchModel} onValueChange={setSearchModel}>
                    <SelectTrigger className="bg-white relative z-20">
                      <SelectValue placeholder="Any Model" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="any">Any Model</SelectItem>
                      {availableModels.map(model => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={maxPrice} onValueChange={setMaxPrice}>
                    <SelectTrigger className="bg-white relative z-20">
                      <SelectValue placeholder="Max Price" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="any">Any Price</SelectItem>
                      <SelectItem value="10000">Under $10,000</SelectItem>
                      <SelectItem value="20000">Under $20,000</SelectItem>
                      <SelectItem value="30000">Under $30,000</SelectItem>
                      <SelectItem value="50000">Under $50,000</SelectItem>
                      <SelectItem value="75000">Under $75,000</SelectItem>
                      <SelectItem value="100000">Under $100,000</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={handleQuickSearch} 
                    className="bg-primary hover:bg-primary-hover text-primary-foreground relative z-20 btn-automotive px-8 py-3 text-lg font-semibold"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Search Cars
                  </Button>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </section>

      {/* About Section - Royal Priesthood */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-8 text-white font-bold" style={{
            color: '#ffffff',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700'
          }}>ROYAL PRIESTHOOD</h2>
          
          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-white" style={{
              color: '#ffffff',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              lineHeight: '1.75'
            }}>
              We believe in treating all of our customers like royalty. When you come to Integrity 
              Auto and Body it is our mission to make you feel right at home. Our motto is{" "}
              <strong className="underline font-semibold">"We're BIG enough to share, yet, Small enough to care."</strong>{" "}
              We aim to take care of your vehicle needs at a fair price. Our job is to make sure that our customers are 
              happy, and have reliable transportation. The standard we hold is high, we never cut 
              corners or take short cuts, we always bring you the highest quality possible.
            </p>
            
            <p className="text-white" style={{
              color: '#ffffff',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              lineHeight: '1.75'
            }}>
              We maintain our high quality standard by taking good care of our employees, so 
              that they may in return take good care of our customers. Here at Integrity Auto and 
              Body we're one big family.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title text-foreground mb-4">
              Featured Vehicles
            </h2>
            <p className="text-lead text-muted-foreground">
              Hand-picked quality cars from our inventory
            </p>
          </div>

          {carsLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="car-loading text-5xl">🚗</div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-600">Loading featured vehicles...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredCars.map((car: CarType, index: number) => (
                <div key={car.id} className={`fade-in stagger-${Math.min(index + 1, 6)}`}>
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/cars">
              <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg">
                View All Cars
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-secondary-foreground">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Car Sales */}
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="h-12 w-12 text-primary-foreground" />
              </div>
              <h3 className="card-title mb-4 text-primary">CAR SALES</h3>
              <p className="text-muted-foreground mb-6">
                If you're in the market for a new car, be sure to shop with Integrity for the best deals around.
              </p>
              <ul className="space-y-2 text-left">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  New Cars
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Used Cars
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Seller Financing
                </li>
              </ul>
            </div>

            {/* Car Repairs */}
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Wrench className="h-12 w-12 text-primary-foreground" />
              </div>
              <h3 className="card-title mb-4 text-primary">CAR REPAIRS</h3>
              <p className="text-muted-foreground mb-6">
                Our highly trained mechanics are ready to restore your vehicle back to it's former glory.
              </p>
              <ul className="space-y-2 text-left">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Computer Diagnostics
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Maintenance Inspection
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Rebuild Transmissions
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Transmission Service
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Transmission Swaps
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Oil Changes
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Tune Ups
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Fluid Services
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Paint and Body Work (Insurance or Personal)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Engine Swaps
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Brakes and Rotors
                </li>
              </ul>
            </div>

            {/* Limo Services */}
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-primary-foreground" />
              </div>
              <h3 className="card-title mb-4 text-primary">LIMO SERVICES</h3>
              <p className="text-muted-foreground mb-6">
                Going out somewhere special? Let us help make your next outing an event to never forget with our professional limo service.
              </p>
              <div className="text-center">
                <Link href="/contact">
                  <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                    Contact for Details
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {approvedTestimonials.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title text-foreground mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lead text-muted-foreground">
                Real reviews from satisfied customers
              </p>
            </div>

            <TestimonialCarousel 
              testimonials={approvedTestimonials} 
              autoplay={true} 
              autoplayInterval={6000} 
            />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
            Ready to Find Your Next Car?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Browse our extensive inventory or schedule a service appointment today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars">
              <Button size="lg" className="bg-background hover:bg-secondary text-foreground px-8 py-4 text-lg font-semibold shadow-lg border border-border">
                Browse Cars
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-4 text-lg font-semibold">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
