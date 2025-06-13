
export interface AdminUser {
  _id?: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
}

export interface TeacherApplication {
  _id?: string;
  // Basic Information
  fullName: string;
  phoneNumber: string;
  email: string;
  age: string;
  gender: string;
  cityState: string;
  preferredLanguage: string;
  highestQualification: string;
  collegeUniversity: string;
  yearOfPostGraduation: string;
  
  // Education & Experience
  subjects: string[];
  teachingExperience: string;
  currentEmployment: string;
  onlineTeachingExperience: string;
  toolsPlatforms: string;
  
  // Teaching Style & Personality
  excitementAboutTeaching: string;
  biggestStrength: string;
  creativeExample: string;
  managingDistractedChild: string;
  expertTopic: string;
  
  // Availability & Preferences
  expectedHourlyRate: string;
  partTimeWillingness: string;
  earlyMorningWillingness: string;
  preferredTimeSlots: string[];
  otherCommitments: string;
  classesPerWeek: string;
  
  // Video and Status
  videoUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}
