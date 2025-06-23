import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import CarCard from "@/components/car-card";
import SimpleCarFilters from "@/components/simple-car-filters";
import ImprovedCarFilters from "@/components/improved-car-filters";
import CarComparison from "@/components/car-comparison";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import type { Car, CarFilters as CarFiltersType } from "@shared/schema";

export default function Cars() {
  useScrollToTop(); // Scroll to top when navigating to this page
  
  const [location] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<Partial<CarFiltersType>>({});
  const [pendingFilters, setPendingFilters] = useState<Partial<CarFiltersType>>({});
  const [appliedFilters, setAppliedFilters] = useState<Partial<CarFiltersType>>({});

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters: Partial<CarFiltersType> = {};
    
    if (urlParams.get('make')) initialFilters.make = urlParams.get('make')!;
    if (urlParams.get('model')) initialFilters.model = urlParams.get('model')!;
    if (urlParams.get('minPrice')) initialFilters.minPrice = Number(urlParams.get('minPrice'));
    if (urlParams.get('maxPrice')) initialFilters.maxPrice = Number(urlParams.get('maxPrice'));
    if (urlParams.get('minYear')) initialFilters.minYear = Number(urlParams.get('minYear'));
    if (urlParams.get('maxYear')) initialFilters.maxYear = Number(urlParams.get('maxYear'));
    if (urlParams.get('maxMileage')) initialFilters.maxMileage = Number(urlParams.get('maxMileage'));
    if (urlParams.get('fuelType')) {
      const fuelTypes = urlParams.getAll('fuelType');
      initialFilters.fuelType = fuelTypes;
    }
    
    setFilters(initialFilters);
  }, [location]);

  const { data: carsData, isLoading } = useQuery<{ cars: Car[], total: number }>({
    queryKey: ["/api/cars", { ...filters, page: currentPage, sortBy, limit: 12 }],
  });

  const cars = carsData?.cars || [];
  const totalCars = carsData?.total || 0;
  const totalPages = Math.ceil(totalCars / 12);

  const handleFiltersChange = (newFilters: Partial<CarFiltersType>) => {
    setPendingFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = (newFilters: Partial<CarFiltersType>) => {
    setFilters(newFilters);
    setAppliedFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPendingFilters({});
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Car Inventory
            </h1>
            <p className="text-xl text-gray-600">
              Browse our extensive collection of quality used cars
            </p>
          </div>
          
          {/* Automotive Loading Animation */}
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="car-loading text-6xl">🚗</div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-600">Loading inventory...</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-96 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Our Car Inventory
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Browse our extensive collection of quality used cars. Found {totalCars} vehicles matching your criteria.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showAdvancedFilters ? 'Simple' : 'Advanced'}
                </Button>
              </div>
              
              {showAdvancedFilters ? (
                <ImprovedCarFilters 
                  filters={appliedFilters} 
                  onApplyFilters={handleApplyFilters}
                  onReset={handleResetFilters}
                />
              ) : (
                <SimpleCarFilters 
                  filters={filters}
                  onFiltersChange={handleApplyFilters}
                />
              )}
            </div>
          </div>

          {/* Car Listings */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                <span className="font-semibold">{totalCars}</span> cars found
              </p>
              <Select value={sortBy || "newest"} onValueChange={handleSortChange}>
                <SelectTrigger className="w-56 bg-white border-primary/20 hover:border-primary/40 focus:border-primary shadow-sm hover:shadow-md transition-all duration-200">
                  <SelectValue placeholder="Sort by: Newest" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-xl border-primary/10">
                  <SelectItem value="newest" className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-150">Sort by: Newest Added</SelectItem>
                  <SelectItem value="oldest" className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-150">Sort by: Oldest Added</SelectItem>
                  <SelectItem value="price_asc" className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-150">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc" className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-150">Price: High to Low</SelectItem>
                  <SelectItem value="year_desc" className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-150">Year: Newest First</SelectItem>
                  <SelectItem value="year_asc" className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-150">Year: Oldest First</SelectItem>
                  <SelectItem value="mileage_asc" className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-150">Mileage: Low to High</SelectItem>
                  <SelectItem value="mileage_desc" className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-150">Mileage: High to Low</SelectItem>
                  <SelectItem value="popular" className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-150">Most Popular</SelectItem>
                  <SelectItem value="recently_viewed" className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-150">Recently Viewed</SelectItem>
                  <SelectItem value="alphabetical" className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-150">A-Z (Make/Model)</SelectItem>
                  <SelectItem value="best_value" className="hover:bg-primary/5 focus:bg-primary/10 transition-colors duration-150">Best Value</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {cars.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cars.map((car, index) => (
                    <div key={car.id} className={`fade-in stagger-${Math.min((index % 6) + 1, 6)}`}>
                      <CarCard car={car} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Car Comparison Tool */}
        <div className="mt-12">
          <CarComparison />
        </div>
      </div>
    </div>
  );
}
