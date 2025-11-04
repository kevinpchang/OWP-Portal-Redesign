//course/mock data, subject to change as we integrate API & database -NickG

export interface ActiveCourse {
    id: number;
    title: string;
    progress: string;
}

export interface CompletedCourse {
    id: number;
    title: string;
    status: string;
}

export interface RecommendedCourse {
    id: number;
    title: string;
    description: string;
    chapters: string;
}

export const activeCourses: ActiveCourse [] = [
  { id: 1, title: "Operation of Wastewater Treatment Plants, Vol 2", progress: "50%" },
  { id: 5, title: "Safety Procedures for Operators", progress: "30%" } 
];

export const completedCourses: CompletedCourse[] = [
  { id: 2, title: "Operation of Wastewater Treatment Plants, Vol 1", status: "Pass" },
  { id: 4, title: "Operation of Wastewater Treatment Plants, Vol 2", status: "Fail" }
];

export const recommendedCourses: RecommendedCourse[] = [
  {
    id: 3,
    title: "Operation of Wastewater Treatment Plants, Vol 3",
    description: "1st Edition, 2023",
    chapters: "5 chapters"
  }
];