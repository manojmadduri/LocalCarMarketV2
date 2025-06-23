import { useEffect } from "react";
import type { Car } from "@shared/schema";

interface CarMetaTagsProps {
  car: Car;
}

export default function CarMetaTags({ car }: CarMetaTagsProps) {
  useEffect(() => {
    const currentUrl = window.location.href;
    const shareTitle = `${car.year} ${car.make} ${car.model} - ${car.price}`;
    const shareDescription = `${car.condition} ${car.year} ${car.make} ${car.model} with ${car.mileage.toLocaleString()} miles. ${car.fuelType} engine, ${car.transmission} transmission. Available at The Integrity Auto and Body.`;
    const shareImage = car.images && car.images.length > 0 ? car.images[0] : '';

    // Update page title
    document.title = `${shareTitle} | The Integrity Auto and Body`;

    // Create or update meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const updateNameMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Open Graph tags
    updateMetaTag('og:title', shareTitle);
    updateMetaTag('og:description', shareDescription);
    updateMetaTag('og:url', currentUrl);
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:site_name', 'The Integrity Auto and Body');
    
    if (shareImage) {
      updateMetaTag('og:image', shareImage);
      updateMetaTag('og:image:width', '1200');
      updateMetaTag('og:image:height', '630');
      updateMetaTag('og:image:alt', `${car.year} ${car.make} ${car.model}`);
    }

    // Twitter Card tags
    updateNameMetaTag('twitter:card', 'summary_large_image');
    updateNameMetaTag('twitter:title', shareTitle);
    updateNameMetaTag('twitter:description', shareDescription);
    if (shareImage) {
      updateNameMetaTag('twitter:image', shareImage);
    }

    // Standard meta tags
    updateNameMetaTag('description', shareDescription);
    updateNameMetaTag('keywords', `${car.make}, ${car.model}, ${car.year}, used car, ${car.fuelType}, ${car.transmission}, ${car.color}, car dealership`);

    // Cleanup function to restore default meta tags when component unmounts
    return () => {
      document.title = 'The Integrity Auto and Body - Quality Used Cars & Auto Services';
      
      const defaultDescription = 'Discover quality used cars and professional auto services at The Integrity Auto and Body. Browse our inventory of reliable vehicles and schedule maintenance services.';
      updateNameMetaTag('description', defaultDescription);
      
      // Remove Open Graph tags
      const ogTags = ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt'];
      ogTags.forEach(tag => {
        const meta = document.querySelector(`meta[property="${tag}"]`);
        if (meta) meta.remove();
      });

      // Remove Twitter tags
      const twitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
      twitterTags.forEach(tag => {
        const meta = document.querySelector(`meta[name="${tag}"]`);
        if (meta) meta.remove();
      });
    };
  }, [car]);

  return null; // This component doesn't render anything visible
}