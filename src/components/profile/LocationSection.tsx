import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/badge';
import { MapPin, Loader2, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import type { LocationData } from '@/src/types/location';

interface Props {

  initialLocations: LocationData[];

  onLocationSelect: (locationData: LocationData[]) => Promise<void>;

}

const LocationSection = ({ initialLocations = [] }: Props) => {
  const [locations, setLocations] = useState<LocationData[]>(initialLocations);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePlaceSelect = useCallback(async () => {
    if (!autoCompleteRef.current || !inputRef.current) return;
    if (locations.length >= 5) {
      toast.error('Maximum 5 locations allowed');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const place = autoCompleteRef.current.getPlace();
      if (!place.geometry?.location) {
        toast.error('Please select a location from the dropdown');
        return;
      }

      const countryComponent = place.address_components?.find(
        component => component.types.includes('country')
      );
      
      if (!countryComponent?.short_name) {
        toast.error('Unable to determine country');
        return;
      }

      const newLocation: LocationData = {
        address: place.formatted_address || '',
        placeId: place.place_id || '',
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
        countryCode: countryComponent.short_name
      };

      const locationExists = locations.some(loc => loc.placeId === newLocation.placeId);
      if (locationExists) {
        toast.error('This location has already been added');
        return;
      }

      await toast.promise(
        updateLocations([...locations, newLocation]),
        {
          loading: 'Adding location...',
          success: 'Location added',
          error: 'Failed to add location'
        }
      );
      
      if (inputRef.current) inputRef.current.value = '';
      setIsAddingLocation(false);
    } catch (error) {
      console.error('Failed to add location:', error);
    } finally {
      setIsLoading(false);
    }
  }, [locations]);

  useEffect(() => {
    if (initialLocations.length > 0) return;
    
    const controller = new AbortController();
    
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/profile/location', {
          signal: controller.signal
        });
        const data = await response.json();
        if (data.locations) {
          setLocations(data.locations);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return;
        toast.error('Failed to load locations');
      }
    };

    fetchLocations();
    return () => controller.abort();
  }, [initialLocations]);

  const updateLocations = async (newLocations: LocationData[]) => {
    try {
      const response = await fetch('/api/profile/location', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locations: newLocations })
      });
      
      if (!response.ok) throw new Error('Failed to update locations');
      
      const data = await response.json();
      setLocations(data.locations || newLocations);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const removeLocation = async (placeId: string) => {
    try {
      const location = locations.find(loc => loc.placeId === placeId);
      if (!location) return;

      await toast.promise(
        updateLocations(locations.filter(loc => loc.placeId !== placeId)),
        {
          loading: 'Removing location...',
          success: `Removed ${location.address}`,
          error: 'Failed to remove location'
        }
      );
    } catch (error) {
      console.error('Failed to remove location:', error);
    }
  };

  useEffect(() => {
    if (!isAddingLocation) return;

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
  }, [isAddingLocation, handlePlaceSelect]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Operating Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {locations.map((location) => (
              <Badge
                key={location.placeId}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {location.address}
                <button
                  onClick={() => removeLocation(location.placeId)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {!isAddingLocation && locations.length < 5 && (
              <button
                onClick={() => setIsAddingLocation(true)}
                className="flex items-center gap-1 px-3 py-1 border rounded-full hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                Add location
              </button>
            )}
          </div>

          {isAddingLocation && (
            <form className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter city, region, or country"
                className="flex-1 p-2 border rounded-md"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsAddingLocation(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(LocationSection);