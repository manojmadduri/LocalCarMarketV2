import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, X, Search, RotateCcw } from "lucide-react";
import type { CarFilters, Car } from "@shared/schema";

interface ImprovedCarFiltersProps {
  filters: Partial<CarFilters>;
  onApplyFilters: (filters: Partial<CarFilters>) => void;
  onReset: () => void;
}

export default function ImprovedCarFilters({ filters, onApplyFilters, onReset }: ImprovedCarFiltersProps) {
  const [tempFilters, setTempFilters] = useState<Partial<CarFilters>>(filters);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    price: true,
    specs: false,
    features: false,
  });

  // Get all cars for dynamic filtering
  const { data: allCarsData } = useQuery<{ cars: Car[], total: number }>({
    queryKey: ["/api/cars", { limit: 1000 }], // Get all cars for filtering
  });

  // Generate dynamic make list from database
  const availableMakes = (() => {
    if (!allCarsData?.cars) return [];
    const makes = new Set<string>();
    allCarsData.cars.forEach(car => {
      if (car.make?.trim()) {
        makes.add(car.make.trim());
      }
    });
    return Array.from(makes).sort();
  })();

  // Generate dynamic model list based on selected makes
  const availableModels = (() => {
    if (!allCarsData?.cars) return [];
    const selectedMakes = tempFilters.make as string[] || [];
    let filteredCars = allCarsData.cars;
    
    if (selectedMakes.length > 0) {
      filteredCars = allCarsData.cars.filter(car => 
        selectedMakes.includes(car.make?.trim() || '')
      );
    }
    
    const models = new Set<string>();
    filteredCars.forEach(car => {
      if (car.model?.trim()) {
        models.add(car.model.trim());
      }
    });
    return Array.from(models).sort();
  })();

  // Update temp filters when props change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateTempFilter = (key: keyof CarFilters, value: any) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilter = (key: keyof CarFilters, value: string, checked: boolean) => {
    const currentArray = (tempFilters[key] as string[]) || [];
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    updateTempFilter(key, newArray.length > 0 ? newArray : undefined);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage) + ' miles';
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    // Scroll to top when filters are applied
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setTempFilters({});
    onReset();
  };

  // Use dynamic makes from database instead of hardcoded list
  // Generate dynamic options from database
  const fuelTypes = (() => {
    if (!allCarsData?.cars) return ["Gasoline", "Hybrid", "Electric", "Diesel"];
    const types = new Set<string>();
    allCarsData.cars.forEach(car => {
      if (car.fuelType?.trim()) types.add(car.fuelType.trim());
    });
    return Array.from(types).sort();
  })();

  const transmissions = (() => {
    if (!allCarsData?.cars) return ["Automatic", "Manual", "CVT"];
    const types = new Set<string>();
    allCarsData.cars.forEach(car => {
      if (car.transmission?.trim()) types.add(car.transmission.trim());
    });
    return Array.from(types).sort();
  })();

  const drivetrains = (() => {
    if (!allCarsData?.cars) return ["FWD", "RWD", "AWD", "4WD"];
    const types = new Set<string>();
    allCarsData.cars.forEach(car => {
      if (car.drivetrain?.trim()) types.add(car.drivetrain.trim());
    });
    return Array.from(types).sort();
  })();

  const bodyStyles = (() => {
    if (!allCarsData?.cars) return ["Sedan", "SUV", "Hatchback", "Truck", "Coupe", "Convertible", "Wagon"];
    const types = new Set<string>();
    allCarsData.cars.forEach(car => {
      if (car.bodyStyle?.trim()) types.add(car.bodyStyle.trim());
    });
    return Array.from(types).sort();
  })();

  const colors = (() => {
    if (!allCarsData?.cars) return ["White", "Black", "Silver", "Gray", "Red", "Blue", "Green", "Brown", "Beige"];
    const types = new Set<string>();
    allCarsData.cars.forEach(car => {
      if (car.color?.trim()) types.add(car.color.trim());
    });
    return Array.from(types).sort();
  })();

  const conditions = (() => {
    if (!allCarsData?.cars) return ["New", "Used", "Certified"];
    const types = new Set<string>();
    allCarsData.cars.forEach(car => {
      if (car.condition?.trim()) types.add(car.condition.trim());
    });
    return Array.from(types).sort();
  })();

  // Extract real features from car data
  const features = (() => {
    if (!allCarsData?.cars) return ["Navigation", "Leather Seats", "Sunroof", "Backup Camera", "Heated Seats", "Bluetooth"];
    const featureSet = new Set<string>();
    allCarsData.cars.forEach(car => {
      if (car.features && Array.isArray(car.features)) {
        car.features.forEach(feature => {
          if (feature?.trim()) featureSet.add(feature.trim());
        });
      }
    });
    return Array.from(featureSet).sort();
  })();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Advanced Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Filters */}
        <Collapsible open={openSections.basic} onOpenChange={() => toggleSection('basic')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Basic Filters</span>
            {openSections.basic ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div>
              <Label>Make (Multiple Selection)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                {availableMakes.map(make => (
                  <label key={make} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={(tempFilters.make as string[] || []).includes(make)}
                      onCheckedChange={(checked) => handleArrayFilter('make', make, checked as boolean)}
                    />
                    <span className="text-sm">{make}</span>
                  </label>
                ))}
              </div>
              {(tempFilters.make as string[] || []).length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {(tempFilters.make as string[]).join(', ')}
                </div>
              )}
            </div>

            <div>
              <Label>Model</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                {availableModels.map(model => (
                  <label key={model} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={Array.isArray(tempFilters.model) ? tempFilters.model.includes(model) : tempFilters.model === model}
                      onCheckedChange={(checked) => handleArrayFilter('model', model, checked as boolean)}
                    />
                    <span className="text-sm">{model}</span>
                  </label>
                ))}
              </div>
              {availableModels.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">Select make(s) first to see available models</p>
              )}
            </div>

            <div>
              <Label>Condition</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {conditions.map(condition => (
                  <label key={condition} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={(tempFilters.condition as string[] || []).includes(condition)}
                      onCheckedChange={(checked) => handleArrayFilter('condition', condition, checked as boolean)}
                    />
                    <span className="text-sm">{condition}</span>
                  </label>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Price and Year Filters */}
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Price & Year</span>
            {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-6">
            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium">
                Price Range: {formatPrice(tempFilters.minPrice || 0)} - {formatPrice(tempFilters.maxPrice || 100000)}
              </Label>
              <div className="mt-3 mb-2">
                <Slider
                  value={[tempFilters.minPrice || 0, tempFilters.maxPrice || 100000]}
                  onValueChange={([min, max]) => {
                    updateTempFilter('minPrice', min > 0 ? min : undefined);
                    updateTempFilter('maxPrice', max < 100000 ? max : undefined);
                  }}
                  max={100000}
                  min={0}
                  step={1000}
                  className="w-full custom-range-slider"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>$0</span>
                <span>$100,000+</span>
              </div>
            </div>

            {/* Year Range */}
            <div>
              <Label className="text-sm font-medium">
                Year Range: {tempFilters.minYear || 2000} - {tempFilters.maxYear || new Date().getFullYear()}
              </Label>
              <div className="mt-3 mb-2">
                <Slider
                  value={[tempFilters.minYear || 2000, tempFilters.maxYear || new Date().getFullYear()]}
                  onValueChange={([min, max]) => {
                    updateTempFilter('minYear', min > 2000 ? min : undefined);
                    updateTempFilter('maxYear', max < new Date().getFullYear() ? max : undefined);
                  }}
                  max={new Date().getFullYear()}
                  min={2000}
                  step={1}
                  className="w-full custom-range-slider"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>2000</span>
                <span>{new Date().getFullYear()}</span>
              </div>
            </div>

            {/* Mileage Range */}
            <div>
              <Label className="text-sm font-medium">
                Mileage Range: {formatMileage(tempFilters.minMileage || 0)} - {formatMileage(tempFilters.maxMileage || 200000)}
              </Label>
              <div className="mt-3 mb-2">
                <Slider
                  value={[tempFilters.minMileage || 0, tempFilters.maxMileage || 200000]}
                  onValueChange={([min, max]) => {
                    updateTempFilter('minMileage', min > 0 ? min : undefined);
                    updateTempFilter('maxMileage', max < 200000 ? max : undefined);
                  }}
                  max={200000}
                  min={0}
                  step={5000}
                  className="w-full custom-range-slider"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 miles</span>
                <span>200,000+ miles</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Vehicle Specifications */}
        <Collapsible open={openSections.specs} onOpenChange={() => toggleSection('specs')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Vehicle Specifications</span>
            {openSections.specs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fuel Type</Label>
                <Select 
                  value={Array.isArray(tempFilters.fuelType) ? tempFilters.fuelType[0] : tempFilters.fuelType || "any"} 
                  onValueChange={(value) => updateTempFilter('fuelType', value === "any" ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Fuel Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Fuel Type</SelectItem>
                    {fuelTypes.map(fuel => (
                      <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Transmission</Label>
                <Select 
                  value={typeof tempFilters.transmission === 'string' ? tempFilters.transmission : "any"} 
                  onValueChange={(value) => updateTempFilter('transmission', value === "any" ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Transmission</SelectItem>
                    {transmissions.map(trans => (
                      <SelectItem key={trans} value={trans}>{trans}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Drivetrain</Label>
                <Select 
                  value={typeof tempFilters.drivetrain === 'string' ? tempFilters.drivetrain : "any"} 
                  onValueChange={(value) => updateTempFilter('drivetrain', value === "any" ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Drivetrain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Drivetrain</SelectItem>
                    {drivetrains.map(drive => (
                      <SelectItem key={drive} value={drive}>{drive}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Body Style</Label>
                <Select 
                  value={typeof tempFilters.bodyStyle === 'string' ? tempFilters.bodyStyle : "any"} 
                  onValueChange={(value) => updateTempFilter('bodyStyle', value === "any" ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Body Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Body Style</SelectItem>
                    {bodyStyles.map(body => (
                      <SelectItem key={body} value={body}>{body}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {colors.map(color => (
                  <label key={color} className="flex items-center space-x-2">
                    <Checkbox 
                      checked={(tempFilters.color as string[] || []).includes(color)}
                      onCheckedChange={(checked) => handleArrayFilter('color', color, checked as boolean)}
                    />
                    <span className="text-sm">{color}</span>
                  </label>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Features */}
        <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Features</span>
            {openSections.features ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {features.map(feature => (
                <label key={feature} className="flex items-center space-x-2">
                  <Checkbox 
                    checked={(tempFilters.features as string[] || []).includes(feature)}
                    onCheckedChange={(checked) => handleArrayFilter('features', feature, checked as boolean)}
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 border-t sticky bottom-0 bg-white p-4 -m-4">
          <Button 
            onClick={handleApply} 
            className="w-full"
            size="lg"
          >
            <Search className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
          <Button 
            onClick={handleReset} 
            variant="outline" 
            className="w-full"
            size="lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}