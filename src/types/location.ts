// types/location.ts


export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  address: string;
  placeId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  countryCode: string;
}


export interface LocationValidation {
  allowedCountries?: string[];
  maxDistance?: number;
}
