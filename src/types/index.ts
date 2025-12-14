export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: Severity;
  status: Status;
  location: Location;
  images: string[];
  dateReported: Date;
  reportedBy: string;
  assignedDepartment: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  district: string;
}

export type IssueCategory = 
  | 'pothole'
  | 'streetlight'
  | 'trash'
  | 'flooding'
  | 'graffiti'
  | 'damaged_signage'
  | 'broken_sidewalk'
  | 'water_leak'
  | 'electrical_hazard'
  | 'other';

export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'reported' | 'in_progress' | 'resolved' | 'closed';

export interface ReportFormData {
  description: string;
  images: File[];
  location: Location | null;
  manualAddress: string;
}