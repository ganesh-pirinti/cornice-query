export type AttendanceStatus = 'safe' | 'warning' | 'critical';
export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface EnrolledCourse {
  code: string;
  name: string;
  attended: number;
  total: number;
  targetPercentage: number;
}

export interface StudentProfile {
  name: string;
  regNo: string;
  program: string;
  status: string;
  busRoute: string;
}

export interface BuildingNode {
  id: string;
  name: string;
  code: string;
  type: 'academic' | 'admin' | 'facility' | 'hostel';
  hasActiveIssue?: boolean;
  issueCount?: number;
}

export interface RawStudentPing {
  id: string;
  studentReg: string;
  text: string;
  location: string;
  timestamp: string;
}

export interface DeduplicatedAssetIssue {
  assetId: string;
  assetName: string;
  location: string;
  totalRawReports: number;
  firstReported: string;
  priority: PriorityLevel;
  assignedTeam: string;
  affectedLecture: string;
  affectedStudentsCount: number;
  status: 'Investigating' | 'Dispatched' | 'Rerouted' | 'Resolved';
  rawPings: RawStudentPing[];
}

export interface StudentScheduleItem {
  id: string;
  time: string;
  subject: string;
  code: string;
  room: string;
  block: string;
  instructor: string;
  attendancePercentage: number;
  attendanceStatus: AttendanceStatus;
  isRelocated?: boolean;
  originalRoom?: string;
  originalBlock?: string;
  walkTimeMins?: number;
  contextNote?: string;
}

export interface MobilityConflictItem {
  id: string;
  labTitle: string;
  labEndTime: string;
  busRoute: string;
  busDepartureTime: string;
  departureGate: string;
  walkTimeMins: number;
  missDurationMins: number;
  holdRequested?: boolean;
}

export interface CampusOpportunityItem {
  id: string;
  title: string;
  time: string;
  location: string;
  matchingElective: string;
  freeWindow: string;
  rsvped?: boolean;
}

// Backwards compatibility interfaces
export interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  dueTime: string;
  urgency: 'critical' | 'warning' | 'normal';
}

export interface CampusEventItem {
  id: string;
  title: string;
  category: string;
  time: string;
  location: string;
  capacity: number;
  registeredCount: number;
  distanceMins: number;
  matchingInterests: string[];
  recommended: boolean;
  reasonText: string;
}

export interface BusScheduleItem {
  id: string;
  routeNumber: string;
  destination: string;
  departureTime: string;
  status: string;
  platform: string;
}

export interface ComplaintReport {
  id: string;
  studentId: string;
  block: string;
  room: string;
  issueType: string;
  timestamp: string;
}

export interface ComplaintCluster {
  id: string;
  block: string;
  room: string;
  issueType: string;
  reportCount: number;
  firstReported: string;
  status: 'Unresolved' | 'Assigned' | 'Resolved';
  priority: PriorityLevel;
  suggestedAction: string;
  recentReports: ComplaintReport[];
}

export interface ContextNudge {
  id: string;
  type: 'ATTENDANCE' | 'VENUE' | 'EVENT' | 'ASSIGNMENT' | 'TRANSPORT' | 'OPERATIONS';
  title: string;
  description: string;
  badge: string;
  time: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
}
