import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import CarImageCarousel from "@/components/car-image-carousel";
import PaymentCalculator from "@/components/payment-calculator";
import VinDecoder from "@/components/vin-decoder";
import PriceHistory from "@/components/price-history";
import SocialShare from "@/components/social-share";
import CarMetaTags from "@/components/car-meta-tags";
import FloatingShareButton from "@/components/floating-share-button";

import SocialProofBadges from "@/components/social-proof-badges";
import { useAnalytics } from "@/hooks/use-analytics";
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar,
  Fuel,
  Settings,
  Palette,
  Route,
  CheckCircle,
  AlertCircle,
  FileText,
  Share2
} from "lucide-react";
import type { Car } from "@shared/schema";

export default function CarDetails() {
  useScrollToTop(); // Scroll to top when navigating to this page
  
  const [, params] = useRoute("/cars/:id");
  const carId = params?.id ? parseInt(params.id) : null;

  const { data: car, isLoading, error } = useQuery<Car>({
    queryKey: [`/api/cars/${carId}`],
    enabled: !!carId,
  });

  // Initialize analytics tracking for this car
  const analytics = useAnalytics({ carId: carId || 0 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Car Not Found</h1>
            <p className="text-gray-600 mb-4">
              The car you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/cars">
              <Button>Back to Cars</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-2 border-green-300 px-4 py-2 text-base font-bold shadow-sm";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-2 border-yellow-300 px-4 py-2 text-base font-bold shadow-sm";
      case "sold":
        return "bg-red-100 text-red-800 border-2 border-red-300 px-4 py-2 text-base font-bold shadow-sm";
      default:
        return "bg-gray-100 text-gray-800 border-2 border-gray-300 px-4 py-2 text-base font-bold shadow-sm";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "pending":
        return "Pending Sale";
      case "sold":
        return "Sold";
      default:
        return status;
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Meta tags for social sharing */}
      <CarMetaTags car={car} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/cars">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Cars
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car Image Carousel */}
          <div className="space-y-4">
            <CarImageCarousel 
              images={car.images || ['/api/placeholder/600/400']}
              carName={`${car.year} ${car.make} ${car.model}`}
              price={formatPrice(car.price)}
            />
          </div>

          {/* Car Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {car.year} {car.make} {car.model}
                </h1>
                <Badge className={getStatusColor(car.status)}>
                  {getStatusText(car.status)}
                </Badge>
              </div>
              <p className="text-3xl font-bold text-primary mb-4">
                {formatPrice(car.price)}
              </p>
              
              {/* Social Share Button and Social Proof */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SocialShare car={car} onShare={() => analytics.trackShare()} />
                  <span className="text-sm text-gray-500">Share this car with friends</span>
                </div>
                <SocialProofBadges car={car} />
              </div>

            </div>

            {/* Key Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Model Year</p>
                        <p className="font-semibold">{car.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Route className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Mileage</p>
                        <p className="font-semibold">{formatMileage(car.mileage)} miles</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Transmission</p>
                        <p className="font-semibold">{car.transmission}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Fuel className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Fuel Type</p>
                        <p className="font-semibold">{car.fuelType}</p>
                      </div>
                    </div>
                    {car.engine && (
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Engine</p>
                          <p className="font-semibold">{car.engine}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Palette className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Exterior Color</p>
                        <p className="font-semibold">{car.color}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Condition</p>
                        <p className="font-semibold capitalize">{car.condition}</p>
                      </div>
                    </div>
                    {car.drivetrain && (
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Drivetrain</p>
                          <p className="font-semibold">{car.drivetrain}</p>
                        </div>
                      </div>
                    )}
                    {car.bodyStyle && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Body Style</p>
                          <p className="font-semibold">{car.bodyStyle}</p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Performance & Efficiency */}
                {(car.mpgCity || car.mpgHighway || car.safetyRating) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold mb-4">Performance & Safety</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {car.mpgCity && (
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{car.mpgCity}</p>
                          <p className="text-sm text-gray-600">City MPG</p>
                        </div>
                      )}
                      {car.mpgHighway && (
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{car.mpgHighway}</p>
                          <p className="text-sm text-gray-600">Highway MPG</p>
                        </div>
                      )}
                      {car.safetyRating && (
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">{car.safetyRating}★</p>
                          <p className="text-sm text-gray-600">Safety Rating</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>



            {/* Contact Actions */}
            <div className="space-y-4">
              <Separator />
              <div className="flex flex-col sm:flex-row gap-4">
                {car.status === "available" ? (
                  <>
                    <a href="tel:(615) 896-1080" className="flex-1">
                      <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl md:text-base text-lg">
                        <Phone className="mr-2 h-5 w-5" />
                        Call About This Car
                      </Button>
                    </a>
                    <Link href="/contact" className="flex-1">
                      <Button size="lg" variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 md:text-base text-lg">
                        <Mail className="mr-2 h-5 w-5" />
                        Send Message
                      </Button>
                    </Link>
                  </>
                ) : car.status === "pending" ? (
                  <Button size="lg" disabled className="flex-1 py-4 px-6 text-lg font-semibold bg-yellow-100 text-yellow-800 border-2 border-yellow-300">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Sale Pending
                  </Button>
                ) : (
                  <div className="flex-1">
                    <Button size="lg" disabled className="w-full py-4 px-6 text-lg font-semibold bg-red-100 text-red-800 border-2 border-red-300">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      This Car Has Been Sold
                    </Button>
                    <Link href="/cars" className="block mt-3">
                      <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white py-3 px-4 rounded-lg transition-all duration-200">
                        View Similar Cars
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information Section - Blue header like in image */}
        <div className="mt-12">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
            <h2 className="text-xl font-bold">Vehicle Information</h2>
          </div>
          <div className="bg-gray-50 rounded-b-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Make:</span>
                  <span className="font-medium">{car.make}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{car.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-medium">{car.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trim:</span>
                  <span className="font-medium">{car.trim || 'Standard'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-medium capitalize">{car.condition}</span>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Technical Specs</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Engine:</span>
                  <span className="font-medium">{car.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transmission:</span>
                  <span className="font-medium">{car.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Drivetrain:</span>
                  <span className="font-medium">{car.drivetrain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className="font-medium">{car.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Body Style:</span>
                  <span className="font-medium">{car.bodyStyle}</span>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Exterior Color:</span>
                  <span className="font-medium">{car.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interior Color:</span>
                  <span className="font-medium">{car.interiorColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium">{car.numberOfSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doors:</span>
                  <span className="font-medium">{car.numberOfDoors}</span>
                </div>
                {car.vin && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">VIN:</span>
                    <span className="font-medium text-xs">{car.vin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>


          </div>
        </div>

        {/* Key Features Section */}
        {car.features && car.features.length > 0 && (
          <div className="mt-12 bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {car.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Section */}
        {car.description && (
          <div className="mt-12 bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
            <p className="text-gray-700 leading-relaxed">{car.description}</p>
          </div>
        )}

        {/* Contact Actions */}
        <div className="mt-12 space-y-4">
          <Separator />
          <div className="flex flex-col sm:flex-row gap-4">
            {car.status === "available" ? (
              <>
                <a href="tel:(615) 896-1080" className="flex-1">
                  <Button 
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl md:text-base text-lg"
                    onClick={() => analytics.trackPhone()}
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call About This Car
                  </Button>
                </a>
                <Link href="/contact" className="flex-1">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 md:text-base text-lg"
                    onClick={() => analytics.trackContact()}
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </Link>
              </>
            ) : car.status === "pending" ? (
              <Button size="lg" disabled className="flex-1 py-4 px-6 text-lg font-semibold bg-yellow-100 text-yellow-800 border-2 border-yellow-300">
                <AlertCircle className="mr-2 h-5 w-5" />
                Sale Pending
              </Button>
            ) : (
              <div className="flex-1">
                <Button size="lg" disabled className="w-full py-4 px-6 text-lg font-semibold bg-red-100 text-red-800 border-2 border-red-300">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  This Car Has Been Sold
                </Button>
                <Link href="/cars" className="block mt-3">
                  <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white py-3 px-4 rounded-lg transition-all duration-200">
                    View Similar Cars
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Price History Section */}
        <div className="mt-12">
          <PriceHistory carId={car.id} currentPrice={car.price} />
        </div>

        {/* VIN Decoder and Payment Calculator Section */}
        <div className="mt-12 space-y-8">
          {car.status === "available" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <VinDecoder initialVin={car.vin || ""} />
              <PaymentCalculator vehiclePrice={car.price} />
            </div>
          )}
        </div>


      </div>
      
      {/* Floating Share Button */}
      <FloatingShareButton car={car} />
    </div>
  );
}
