// types/location.ts
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  address: string;
  placeId: string;
  coordinates: Coordinates;
  countryCode: string;
}

export interface LocationValidation {
  allowedCountries?: string[];
  maxDistance?: number;
}
