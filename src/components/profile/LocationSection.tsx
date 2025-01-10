'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/Card';
import { MapPin, Loader2, Edit2, X } from 'lucide-react';
import type { LocationData } from '@/src/types/location';

interface LocationSectionProps {
  initialLocation?: LocationData | null;
  onLocationSelect?: (locationData: LocationData) => Promise<void>;
}

const LocationSection = ({ initialLocation, onLocationSelect }: LocationSectionProps) => {
  const [location, setLocation] = useState(initialLocation?.address || '');
  const [isEditing, setIsEditing] = useState(!initialLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePlaceSelect = async () => {
    if (!autoCompleteRef.current || !inputRef.current) return;
    
    setIsLoading(true);
    setError(null);
  
    try {
      const place = autoCompleteRef.current.getPlace();
      if (!place.geometry?.location) {
        setError('Please select a location from the dropdown');
        setIsLoading(false);
        return;
      }

      // Extract the country code from address components
      const countryComponent = place.address_components?.find(
        component => component.types.includes('country')
      );
      
      if (!countryComponent?.short_name) {
        setError('Unable to determine country');
        setIsLoading(false);
        return;
      }

      const locationData: LocationData = {
        address: place.formatted_address || '',
        placeId: place.place_id || '',
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
        countryCode: countryComponent.short_name
      };

      if (onLocationSelect) {
        await onLocationSelect(locationData);
      }

      setLocation(locationData.address);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save location');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isEditing) return;

    const handleGoogleLoad = () => {
      if (!inputRef.current) return;
      
      autoCompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ['geometry', 'place_id', 'formatted_address', 'address_components'],
      });
      
      autoCompleteRef.current.addListener('place_changed', handlePlaceSelect);
    };

    if (typeof google !== 'undefined') {
      handleGoogleLoad();
    } else {
      window.addEventListener('google-maps-loaded', handleGoogleLoad);
    }

    return () => {
      window.removeEventListener('google-maps-loaded', handleGoogleLoad);
      if (autoCompleteRef.current) {
        google.maps.event.clearInstanceListeners(autoCompleteRef.current);
      }
    };
  }, [isEditing]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Operating Location
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the area where you provide services (city, region, or country). This helps clients find professionals in their area.
        </p>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              defaultValue={location}
              placeholder="Enter city, region, or country"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              ) : (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span>{location || 'No location set'}</span>
            <button 
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default LocationSection;