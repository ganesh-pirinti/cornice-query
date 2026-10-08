import type {
  StudentProfile,
  EnrolledCourse,
  BuildingNode,
  DeduplicatedAssetIssue,
  StudentScheduleItem,
  MobilityConflictItem,
  CampusOpportunityItem,
} from '../types/campusos';

export const SRM_STUDENT_PROFILE: StudentProfile = {
  name: 'Rahul Sharma',
  regNo: 'AP23110010482',
  program: 'B.Tech CSE (AIML), 2nd Year',
  status: 'Day Scholar',
  busRoute: 'Bus Route #4 - Vijayawada Benz Circle',
};

export const INITIAL_ENROLLED_COURSES: EnrolledCourse[] = [
  { code: 'CSE204', name: 'Operating Systems', attended: 18, total: 24, targetPercentage: 75 },
  { code: 'CSE301', name: 'Deep Learning', attended: 23, total: 26, targetPercentage: 75 },
  { code: 'ECE201', name: 'Digital Signal Processing', attended: 17, total: 21, targetPercentage: 75 },
  { code: 'MAT202', name: 'Linear Algebra', attended: 23, total: 25, targetPercentage: 75 },
  { code: 'ENG102', name: 'Technical Comm', attended: 17, total: 20, targetPercentage: 75 },
];

export const INITIAL_BUILDINGS: BuildingNode[] = [
  { id: 'bld-1', name: 'Admin Block', code: 'ADM', type: 'admin' },
  { id: 'bld-2', name: 'APJ Abdul Kalam Block', code: 'APJ', type: 'academic' },
  { id: 'bld-3', name: 'Block B (Tiered Classrooms)', code: 'BLK-B', type: 'academic', hasActiveIssue: true, issueCount: 12 },
  { id: 'bld-4', name: 'Block A (Faculty & Labs)', code: 'BLK-A', type: 'academic' },
  { id: 'bld-5', name: 'Block C (Lectures)', code: 'BLK-C', type: 'academic' },
  { id: 'bld-6', name: 'ALC Complex', code: 'ALC', type: 'academic' },
  { id: 'bld-7', name: 'Central Dining Hall', code: 'DINING', type: 'facility' },
  { id: 'bld-8', name: 'Ganga Hostel Tower', code: 'GANGA', type: 'hostel' },
  { id: 'bld-9', name: 'Krishna Hostel Tower', code: 'KRISHNA', type: 'hostel' },
];

export const INITIAL_DEDUPLICATED_ISSUE: DeduplicatedAssetIssue = {
  assetId: 'HVAC Unit #B2-AC-04',
  assetName: 'Compressor Unit 2 (Block B Level 2)',
  location: 'Block B - Level 2 (Room B-204)',
  totalRawReports: 12,
  firstReported: '48 mins ago',
  priority: 'HIGH',
  assignedTeam: 'Facilities Team Alpha',
  affectedLecture: 'CSE301 Deep Learning',
  affectedStudentsCount: 65,
  status: 'Investigating',
  rawPings: [
    { id: 'p-1', studentReg: 'AP23110010112', text: 'AC dripping in B-204', location: 'Room B-204', timestamp: '48m ago' },
    { id: 'p-2', studentReg: 'AP23110010250', text: 'Too hot in room 204', location: 'Room B-204', timestamp: '42m ago' },
    { id: 'p-3', studentReg: 'AP23110010319', text: 'B204 AC remote missing and no cooling', location: 'Block B 2nd Floor', timestamp: '35m ago' },
    { id: 'p-4', studentReg: 'AP23110010488', text: 'AC not cooling in Block B 2nd floor', location: 'Block B L2', timestamp: '29m ago' },
    { id: 'p-5', studentReg: 'AP23110010501', text: 'Extremely hot inside B204', location: 'B-204', timestamp: '24m ago' },
    { id: 'p-6', studentReg: 'AP23110010612', text: 'Compressor noise and burning smell near B204', location: 'Block B Level 2', timestamp: '18m ago' },
    { id: 'p-7', studentReg: 'AP23110010744', text: 'Sweating in 204 class', location: 'B204', timestamp: '15m ago' },
    { id: 'p-8', studentReg: 'AP23110010890', text: 'AC totally down B-204', location: 'Block B-204', timestamp: '11m ago' },
    { id: 'p-9', studentReg: 'AP23110010915', text: 'Please turn off fan or fix AC B204', location: 'B-204', timestamp: '8m ago' },
    { id: 'p-10', studentReg: 'AP23110011044', text: 'B-204 cooling zero', location: 'Block B 2nd floor', timestamp: '5m ago' },
    { id: 'p-11', studentReg: 'AP23110011109', text: 'Professor asking for AC fix in B204', location: 'Room B-204', timestamp: '3m ago' },
    { id: 'p-12', studentReg: 'AP23110011230', text: 'AC water leakage near B204 entrance', location: 'Block B L2 Corridor', timestamp: '1m ago' },
  ],
};

export const INITIAL_STUDENT_SCHEDULE: StudentScheduleItem = {
  id: 'sch-card-1',
  time: '10:00 AM - 11:30 AM',
  subject: 'CSE204 - Operating Systems',
  code: 'CSE204',
  room: 'A-201',
  block: 'Block A',
  instructor: 'Dr. K. R. Sharma',
  attendancePercentage: 74.2,
  attendanceStatus: 'critical',
  isRelocated: false,
  contextNote: 'Attendance is 74.2% (BELOW 75% MANDATORY CUTOFF). Missing this class drops you to 71.4% and revokes hall ticket eligibility.',
};

export const INITIAL_MOBILITY_CONFLICT: MobilityConflictItem = {
  id: 'mob-card-2',
  labTitle: 'Deep Learning Lab Submission',
  labEndTime: '4:30 PM',
  busRoute: 'Bus #4 (Vijayawada Benz Circle)',
  busDepartureTime: '5:15 PM',
  departureGate: 'Admin Gate',
  walkTimeMins: 12,
  missDurationMins: 2,
  holdRequested: false,
};

export const INITIAL_OPPORTUNITY: CampusOpportunityItem = {
  id: 'opp-card-3',
  title: 'Qiskit Quantum Computing Workshop',
  time: '5:30 PM',
  location: 'APJ Block Room 102',
  matchingElective: 'AIML Elective Interest',
  freeWindow: '5:00 PM – 6:30 PM',
  rsvped: false,
};
