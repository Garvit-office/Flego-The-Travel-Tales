export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // hashed — never sent to the client
  bio: string;
  createdAt: string;
}

/** User shape safe to send in API responses — password stripped. */
export type PublicUser = Omit<User, "password">;

export type TravelStyle =
  | "Backpacking"
  | "Trekking"
  | "Cultural"
  | "Adventure"
  | "Luxury";

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

/** Decoded JWT payload — set at sign time in lib/auth.ts. */
export interface AuthTokenPayload {
  id: number;
  email: string;
  name: string;
}

export interface NewTripInput {
  title: string;
  destination: string;
  dates: string;
  budget: string;
  spots: number;
  style: TravelStyle;
  description: string;
}
