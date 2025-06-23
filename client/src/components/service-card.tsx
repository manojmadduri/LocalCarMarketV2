import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Wrench } from "lucide-react";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  onBookService?: () => void;
}

export default function ServiceCard({ service, onBookService }: ServiceCardProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const getIconComponent = (iconClass: string) => {
    // Default to wrench icon if no specific icon class is provided
    return <Wrench className="h-6 w-6 text-primary" />;
  };

  return (
    <Card className="car-card-hover overflow-hidden h-full">
      {/* Service Image */}
      <div className="aspect-[4/3] bg-gray-200 relative">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : service.image ? (
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              {getIconComponent(service.icon)}
              <p className="text-sm text-gray-600 mt-2">Service Image</p>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="capitalize">
            {service.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start mb-3">
          {getIconComponent(service.icon)}
          <h3 className="text-xl font-semibold text-gray-900 ml-3">
            {service.name}
          </h3>
        </div>
        
        <p className="text-gray-600 mb-4 flex-grow text-sm leading-relaxed">
          {service.description}
        </p>

        {/* Service Details */}
        <div className="space-y-2 mb-4">
          {service.duration && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span>{service.duration}</span>
            </div>
          )}
          
          {service.features && service.features.length > 0 && (
            <div className="space-y-1">
              {service.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price and Action */}
        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-lg font-bold text-primary">
                Starting at {formatPrice(service.startingPrice)}
              </span>
            </div>
          </div>
          
          <Button 
            className="w-full mt-3 form-button-primary"
            onClick={onBookService}
          >
            Book Service
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
