export type Role = "student" | "merchant";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: Role;
  merchant_id?: string | null;
}

export interface Venue {
  id: string;
  name: string;
  category: string[];
  city: string;
  district: string;
  address?: string;
  phone?: string;
  businessHours?: string;
  paymentMethods?: string[];
  description?: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  color?: string;
  courses?: Course[];
  coaches?: Coach[];
  reviews?: Review[];
}

export interface Course {
  id: string;
  venueId: string;
  name: string;
  price: number;
  description?: string;
}

export interface Coach {
  id: string;
  venueId: string;
  name: string;
  yearsOfExperience: number;
  bio?: string;
}

export interface Review {
  id: string;
  venueId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  courseId: string;
  contactName: string;
  gender?: string;
  age?: number;
  phone: string;
  note?: string;
  status: BookingStatus;
  createdAt: string;
  venueName?: string;
  courseName?: string;
}
