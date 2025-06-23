import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import type { Testimonial } from "@shared/schema";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

export default function TestimonialCarousel({ 
  testimonials, 
  autoplay = true, 
  autoplayInterval = 10000 
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance testimonials
  useEffect(() => {
    if (!autoplay || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, testimonials.length]);

  const nextTestimonial = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevTestimonial = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToTestimonial = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No testimonials available</p>
      </div>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Testimonial Display */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-lg">
        <CardContent className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Quote Icon */}
            <div className="text-blue-600 dark:text-blue-400">
              <Quote className="h-12 w-12" />
            </div>

            {/* Testimonial Content */}
            <div 
              className={`transition-all duration-300 ease-in-out ${
                isTransitioning ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
              }`}
            >
              <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 max-w-3xl">
                "{currentTestimonial.comment}"
              </blockquote>

              {/* Rating */}
              <div className="flex justify-center mb-4">
                {renderStars(currentTestimonial.rating)}
              </div>

              {/* Author Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {currentTestimonial.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentTestimonial.role}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-between mt-6">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            disabled={isTransitioning}
            className="rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                disabled={isTransitioning}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-blue-600 scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            disabled={isTransitioning}
            className="rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Progress Indicator */}
      {autoplay && testimonials.length > 1 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-100"
              style={{
                width: `${((currentIndex + 1) / testimonials.length) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Testimonial Counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {testimonials.length}
        </span>
      </div>
    </div>
  );
}