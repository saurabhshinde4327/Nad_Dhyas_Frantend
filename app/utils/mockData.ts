export interface StudentAnalytics {
    id: string;
    name: string;
    course: string;
    progress: number;
    status: 'Active' | 'Completed' | 'Dropped';
    lastActive: string;
    branchId?: string;
}

export const mockStudentAnalytics: StudentAnalytics[] = [
    {
        id: '1',
        name: 'Aarav Patel',
        course: 'Classical Vocal',
        progress: 75,
        status: 'Active',
        lastActive: '2025-11-30',
        branchId: '1', // Karamveer
    },
    {
        id: '2',
        name: 'Ishita Sharma',
        course: 'Playback Singing',
        progress: 40,
        status: 'Active',
        lastActive: '2025-11-28',
        branchId: '2', // Godoli
    },
    {
        id: '3',
        name: 'Rohan Gupta',
        course: 'Guitar Basics',
        progress: 90,
        status: 'Completed',
        lastActive: '2025-11-15',
        branchId: '3', // Krantismurti
    },
    {
        id: '4',
        name: 'Meera Singh',
        course: 'Piano Masterclass',
        progress: 20,
        status: 'Dropped',
        lastActive: '2025-10-20',
        branchId: '4', // Karad
    },
    {
        id: '5',
        name: 'Vihaan Kumar',
        course: 'Tabla Rhythms',
        progress: 60,
        status: 'Active',
        lastActive: '2025-12-01',
        branchId: '1', // Karamveer
    },
];

export interface DashboardStats {
    totalStudents: number;
    activeCourses: string[];
    todaysClasses: number;
    upcomingEvents: number;
    feePendingStudents: number;
    newAdmissions: number;
    teachersCount: number;
}

export const mockDashboardStats: DashboardStats = {
    totalStudents: 150,
    activeCourses: ['Classical Vocal', 'Tabla', 'Sitar', 'Harmonium', 'Flute', 'Kathak'],
    todaysClasses: 12,
    upcomingEvents: 3,
    feePendingStudents: 25,
    newAdmissions: 8,
    teachersCount: 15,
};

export interface BranchStats {
    id: string;
    name: string;
    totalAdmissions: number;
    pendingFees: number;
    pendingBalanace: number; // For "pending expensive" (assuming expenses)
    pendingExpenses: number;
}

export const mockHeadDashboardStats: BranchStats[] = [
    {
        id: '1',
        name: 'Karamveer Branch Incharge',
        totalAdmissions: 45,
        pendingFees: 125000,
        pendingBalanace: 0,
        pendingExpenses: 15000,
    },
    {
        id: '2',
        name: 'Godoli Branch Incharge',
        totalAdmissions: 32,
        pendingFees: 85000,
        pendingBalanace: 0,
        pendingExpenses: 8000,
    },
    {
        id: '3',
        name: 'Krantismurti Branch Incharge',
        totalAdmissions: 28,
        pendingFees: 60000,
        pendingBalanace: 0,
        pendingExpenses: 5000,
    },
    {
        id: '4',
        name: 'Karad Branch Incharge',
        totalAdmissions: 55,
        pendingFees: 150000,
        pendingBalanace: 0,
        pendingExpenses: 20000,
    }
];

export interface BranchExpense {
    id: string;
    branchId: string;
    description: string;
    amount: number;
    date: string; // YYYY-MM-DD
    status: 'Pending' | 'Approved' | 'Rejected';
}

export const mockBranchExpenses: BranchExpense[] = [
    { id: '1', branchId: '1', description: 'Instrument Repair', amount: 5000, date: '2025-11-10', status: 'Pending' },
    { id: '2', branchId: '1', description: 'Electricity Bill', amount: 2500, date: '2025-12-05', status: 'Pending' },
    { id: '3', branchId: '1', description: 'Event Snacks', amount: 1500, date: '2025-10-20', status: 'Approved' },
    { id: '4', branchId: '2', description: 'New Harmonium', amount: 8000, date: '2025-11-15', status: 'Pending' },
    { id: '5', branchId: '3', description: 'Hall Rental', amount: 3000, date: '2025-12-01', status: 'Pending' },
    { id: '6', branchId: '4', description: 'Teacher Salary Advance', amount: 10000, date: '2025-11-25', status: 'Pending' },
    { id: '7', branchId: '4', description: 'Marketing Flyers', amount: 2000, date: '2025-10-05', status: 'Approved' },
];
