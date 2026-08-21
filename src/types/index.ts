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
  id: number;
  name: string;
  email: string;
  password: string;
  bio: string;
  createdAt: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  bio: string;
  createdAt: string;
}

export interface Trip {
  id: number;
  title: string;
  destination: string;
  dates: string;
  budget: string;
  style: TravelStyle;
  spots: number;
  spotsLeft: number;
  description: string;
  hostId: number;
  host: string;
  joinedUsers: number[];
  createdAt: string;
}

// Input data required when creating a new trip
export type NewTripInput = Omit<
  Trip,
  "id" | "hostId" | "host" | "joinedUsers" | "spotsLeft" | "createdAt"
>;

// Payload stored in and decoded from JWT tokens
export interface AuthTokenPayload {
  id: number;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}

export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  authorId: number;
  author: string;
  readTime: string;
  likes: number;
  likedBy: number[];
  comments: number;
  createdAt: string;
}