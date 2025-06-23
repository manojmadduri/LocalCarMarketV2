import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { uploadCarImage, deleteCarImage } from "@/lib/supabase";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  carId: string;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, carId, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const imageUrl = await uploadCarImage(file, carId);
        setUploadProgress(((index + 1) / files.length) * 100);
        return imageUrl;
      });

      const newImageUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...newImageUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please check your Supabase configuration.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      await deleteCarImage(imageUrl);
      onImagesChange(images.filter(url => url !== imageUrl));
    } catch (error) {
      console.error('Error deleting image:', error);
      // Still remove from UI even if deletion fails
      onImagesChange(images.filter(url => url !== imageUrl));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Car Images</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploading && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Uploading images...</div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {images.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{images.length} image(s) uploaded</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              {showGrid ? "Show Carousel" : "Show Grid"}
            </Button>
          </div>
          
          {showGrid ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((imageUrl, index) => (
                <Card key={index} className="relative group">
                  <CardContent className="p-2">
                    <div className="relative aspect-square">
                      <img
                        src={imageUrl}
                        alt={`Car image ${index + 1}`}
                        className="w-full h-full object-cover rounded cursor-pointer"
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setShowGrid(false);
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(imageUrl);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="relative">
              <Card>
                <CardContent className="p-4">
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={images[selectedImageIndex]}
                      alt={`Car image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveImage(images[selectedImageIndex])}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {selectedImageIndex === 0 && (
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Primary Image
                      </div>
                    )}
                  </div>
                  
                  {images.length > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1)}
                        disabled={images.length <= 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        {selectedImageIndex + 1} of {images.length}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0)}
                        disabled={images.length <= 1}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                  
                  {images.length > 1 && (
                    <div className="flex space-x-2 mt-3 overflow-x-auto">
                      {images.map((imageUrl, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden ${
                            index === selectedImageIndex ? 'border-blue-500' : 'border-gray-300'
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img
                            src={imageUrl}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center mb-4">
              No images uploaded yet
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload First Image
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="text-sm text-gray-500">
        {images.length} of {maxImages} images uploaded
      </div>
    </div>
  );
}