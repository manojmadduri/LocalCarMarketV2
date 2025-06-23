import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@shared/schema";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="car-card-hover h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex space-x-1">
            {renderStars(testimonial.rating)}
          </div>
        </div>

        {/* Quote */}
        <div className="relative flex-grow">
          <Quote className="h-6 w-6 text-gray-300 absolute -top-2 -left-1" />
          <p className="text-gray-700 text-sm leading-relaxed pl-6 italic">
            {testimonial.comment}
          </p>
        </div>

        {/* Customer Info */}
        <div className="flex items-center mt-6 pt-4 border-t border-gray-100">
          {testimonial.image ? (
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mr-3">
              <span className="text-sm font-semibold">
                {testimonial.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {testimonial.name}
            </p>
            <p className="text-xs text-gray-600">
              {testimonial.role}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
