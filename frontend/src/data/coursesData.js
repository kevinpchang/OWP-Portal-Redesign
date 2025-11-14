//course/mock data, subject to change as we integrate API & database -NickG

export const activeCourses = [
  { 
    id: 1, 
    title: "Operation of Wastewater Treatment Plants, Vol 2", 
    progress: "50%",
    expires: "10/11/2025"
  },
  { 
    id: 5, 
    title: "Safety Procedures for Operators", 
    progress: "30%",
    expires: "03/28/2026"
   } 
];

export const completedCourses = [
  { 
    id: 2, 
    title: "Operation of Wastewater Treatment Plants, Vol 1", 
    status: "Pass", 
    completed: "5/5/2025" 
  }
];

export const recommendedCourses = [
  {
    id: 3,
    title: "Operation of Wastewater Treatment Plants, Vol 3",
    description: "1st Edition, 2023",
    chapterCount: 3,
    chapters: [
      "Introduction to Wastewater Treatment",
      "Effluent Discharge and Reuse",
      "Odor Control"
    ],
    longDescription: "This course uses the following chapters from Operation of Wastewater Treatment Plants, Volume 3: Chapter 1, “Introduction to Wastewater Treatment”; Chapter 2, “Effluent Discharge and Reuse”; and Chapter 3, “Odor Control”. This course is designed to give operators an overview of wastewater treatment plants and effluent discharge and reuse processes as well as train operators to prevent and control odors from wastewater facilities. "
  }
];