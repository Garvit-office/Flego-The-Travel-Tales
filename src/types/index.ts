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

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}git add 