// app/types/index.ts

export interface Club {
  id: string;
  name_en: string;
  name_ja: string;
  category: string;
  description_en: string;
  description_ja: string;
  tags: string[];
  logoUrl?: string;
  status?: string;
  leaderIds?: string[];
  createdAt?: any;
  updatedAt?: any;

  // Bilingual structured information fields
  activity_en?: string;
  activity_ja?: string;
  level_en?: string;
  level_ja?: string;
  schedule_en?: string;
  schedule_ja?: string;
  scheduleInfo_en?: string;
  scheduleInfo_ja?: string;
  location_en?: string;
  location_ja?: string;
  mainPlaces_en?: string;
  mainPlaces_ja?: string;
  equipment_en?: string;
  equipment_ja?: string;
  membershipFee_en?: string;
  membershipFee_ja?: string;
  payment_en?: string;
  payment_ja?: string;
}

export interface CampusEvent {
  id: string;
  clubId: string;
  clubName: string; // Can be adapted if club names also separate en/ja in the future
  category: string;
  title_en: string;
  title_ja: string;
  location_en: string;
  location_ja: string;
  startTime: Date;
  endTime: Date;
}

// Added this based on your app/dashboard/events/[id]/page.tsx requirements
export interface ClubEvent {
  id: string;
  clubId: string;
  title_en: string;
  title_ja: string;
  description_en?: string;
  description_ja?: string;
  startTime: Date;
  endTime: Date;
  location_en: string;
  location_ja: string;
  isPublic: boolean;
}

export interface Facility {
  id: string;
  name_en: string;
  name_ja: string;
  description_en: string;
  description_ja: string;
  building: string;
  floor: string;
  roomNumber: string;
  imageUrl?: string;
  facilities: string[];
  hours_en: string;
  hours_ja: string;
  tags: string[];
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: any; // Firestore Timestamp
  clubId?: string;
}