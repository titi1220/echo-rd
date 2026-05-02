export type CaseStatus =
  | "pending"
  | "active"
  | "urgent"
  | "found_safe"
  | "archived"
  | "rejected"
  | "duplicate"
  | "needs_more_info";

export type SightingStatus = "new" | "reviewing" | "credible" | "false_lead" | "forwarded" | "archived";
export type AdminRole = "super_admin" | "moderator" | "editor";

export type MissingCase = {
  id: string;
  slug: string;
  full_name: string;
  nickname?: string;
  age: number;
  gender: "female" | "male" | "non_binary" | "unknown";
  height: string;
  photo_url: string;
  province: string;
  municipality: string;
  location_last_seen: string;
  date_last_seen: string;
  time_last_seen: string;
  clothing_description: string;
  physical_traits: string;
  circumstances: string;
  contact_name: string;
  contact_phone: string;
  whatsapp: string;
  email: string;
  police_report: boolean;
  urgency_level: "standard" | "high" | "critical";
  status: CaseStatus;
  verified: boolean;
  demo: boolean;
  created_at: string;
  updated_at: string;
};

export type Sighting = {
  id: string;
  case_id: string;
  location_text: string;
  province: string;
  date_seen: string;
  time_seen: string;
  description: string;
  image_url?: string;
  video_url?: string;
  external_link?: string;
  maps_link?: string;
  sender_name?: string;
  sender_phone?: string;
  whatsapp?: string;
  email?: string;
  anonymous: boolean;
  priority: "low" | "medium" | "high";
  status: SightingStatus;
  created_at: string;
};
