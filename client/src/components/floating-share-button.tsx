import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import SocialShare from "@/components/social-share";
import type { Car } from "@shared/schema";

interface FloatingShareButtonProps {
  car: Car;
  showAfterScroll?: number;
}

export default function FloatingShareButton({ car, showAfterScroll = 300 }: FloatingShareButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfterScroll) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAfterScroll]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <SocialShare 
        car={car}
        trigger={
          <Button 
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        }
      />
    </div>
  );
}