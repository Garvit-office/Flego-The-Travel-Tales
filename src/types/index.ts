export type TravelStyle =
  | "adventure"
  | "relaxation"
  | "culture"
  | "nature"
  | "luxury"
  | "budget";

export interface User {
  id: string;
  name: string;
  email: string;
}