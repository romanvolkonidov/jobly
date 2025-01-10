import { User } from '@prisma/client';

export interface MediaUploadProps {
  portfolioImages: string[];
  setPortfolioImages: (images: string[]) => void;
  setImageUrl: (url: string) => void;
  setPortfolioVideo: (url: string | null) => void;
  setUser: (user: User | null | ((prev: User | null) => User | null)) => void;
}

export interface ProfileActionsProps {
  
  setUser: (user: User | null) => void;
  aboutMe: string;
  setPortfolioImages: React.Dispatch<React.SetStateAction<string[]>>;
  setPortfolioVideo: React.Dispatch<React.SetStateAction<string | null>>;
  skills?: string[];  // Add this

}
export interface LocationData {
  address: string;
  placeId: string;
  coordinates: { lat: number; lng: number };
  countryCode: string;
}
