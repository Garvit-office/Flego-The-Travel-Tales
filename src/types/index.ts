export type TravelStyle =
  | "Backpacking"
  | "Trekking"
  | "Cultural"
  | "Adventure"
  | "Luxury";

export const TRAVEL_STYLES: TravelStyle[] = [
  "Backpacking",
  "Trekking",
  "Cultural",
  "Adventure",
  "Luxury",
];

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  style: TravelStyle;
  spotsLeft: number;
  joinedUsers: string[];
  hostId: string;
}