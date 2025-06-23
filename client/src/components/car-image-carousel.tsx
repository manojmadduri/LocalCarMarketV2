import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface CarImageCarouselProps {
  images: string[];
  carName: string;
  price?: string;
}

export default function CarImageCarousel({ images, carName, price }: CarImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle touch gestures for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      nextImage();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevImage();
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") setIsFullscreen(false);
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isFullscreen, currentIndex, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Image Display */}
      <Card className="relative overflow-hidden bg-black rounded-lg mb-0">
        <div className="aspect-video relative group">
          <img
            src={images[currentIndex]}
            alt={`${carName} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 cursor-pointer"
            onClick={() => setIsFullscreen(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          
          {/* Price Badge */}
          {price && (
            <Badge className="absolute top-4 left-4 bg-primary text-white text-lg px-3 py-1">
              {price}
            </Badge>
          )}

          {/* Fullscreen Button */}
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                size="sm"
                variant="secondary"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
                disabled={currentIndex === images.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </Card>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <img
                src={image}
                alt={`${carName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black">
          <DialogTitle className="sr-only">{carName} Image Gallery</DialogTitle>
          <div className="relative w-full h-[95vh] flex items-center justify-center">
            <img
              ref={imageRef}
              src={images[currentIndex]}
              alt={`${carName} - Image ${currentIndex + 1}`}
              className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                isZoomed ? "scale-150 cursor-move" : "cursor-zoom-in"
              }`}
              onClick={toggleZoom}
              style={{ transformOrigin: "center" }}
            />

            {/* Fullscreen Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleZoom}
                className="bg-black/70 text-white hover:bg-black/90"
              >
                {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsFullscreen(false)}
                className="bg-black/70 text-white hover:bg-black/90"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  size="lg"
                  variant="secondary"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white hover:bg-black/90"
                  onClick={prevImage}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white hover:bg-black/90"
                  onClick={nextImage}
                  disabled={currentIndex === images.length - 1}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Fullscreen Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                {currentIndex + 1} of {images.length}
              </div>
            )}

            {/* Fullscreen Thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-[90%] overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                      index === currentIndex
                        ? "border-white ring-2 ring-white/50"
                        : "border-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}