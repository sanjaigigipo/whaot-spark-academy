
import axios from 'axios';

const API_BASE_URL = '/api'; // Configure your API base URL

// Admin API calls
export const adminAPI = {
  login: async (email, password) => {
    try {
      // TODO: Replace with actual API call
      console.log('Admin login API call:', { email, password });
      
      // Mock response for development
      if (email === 'sanjai@gigipo.com' && password === 'sanjai6303') {
        return {
          email: 'sanjai@gigipo.com',
          role: 'super_admin',
          createdAt: new Date()
        };
      }
      return null;
    } catch (error) {
      console.error('Admin login error:', error);
      return null;
    }
  },

  createAdmin: async (adminData) => {
    try {
      // TODO: Replace with actual API call
      console.log('Create admin API call:', adminData);
      return true;
    } catch (error) {
      console.error('Create admin error:', error);
      return false;
    }
  },

  getAllAdmins: async () => {
    try {
      // TODO: Replace with actual API call
      console.log('Get all admins API call');
      return [];
    } catch (error) {
      console.error('Get all admins error:', error);
      return [];
    }
  }
};

// Teacher Application API calls
export const teacherAPI = {
  submitApplication: async (applicationData, videoBlob) => {
    try {
      // TODO: Upload video to GCS and get URL
      const videoFileName = `${Date.now()}_${applicationData.email}.webm`;
      console.log('Uploading video:', videoFileName);
      
      // TODO: Replace with actual video upload
      const videoUrl = `https://storage.googleapis.com/bucket/videos/${videoFileName}`;
      
      const fullApplicationData = {
        ...applicationData,
        videoUrl,
        status: 'pending',
        submittedAt: new Date()
      };
      
      // TODO: Replace with actual API call
      console.log('Submit application API call:', fullApplicationData);
      return true;
    } catch (error) {
      console.error('Submit application error:', error);
      return false;
    }
  },

  getAllApplications: async () => {
    try {
      // TODO: Replace with actual API call
      console.log('Get all applications API call');
      
      // Mock data for development
      return [
        {
          _id: '1',
          fullName: 'Priya Sharma',
          email: 'priya.sharma@email.com',
          phoneNumber: '+91 9876543210',
          cityState: 'Mumbai, Maharashtra',
          subjects: ['Mathematics', 'Physics'],
          expectedHourlyRate: '₹500-700',
          status: 'pending',
          submittedAt: new Date('2024-01-15'),
          age: '28',
          gender: 'Female',
          preferredLanguage: 'English',
          highestQualification: "Master's in Mathematics",
          collegeUniversity: 'University of Mumbai',
          yearOfPostGraduation: '2018',
          teachingExperience: 'Taught at local coaching center for 3 years',
          currentEmployment: 'Private tutor',
          onlineTeachingExperience: 'Yes',
          toolsPlatforms: 'Zoom, Google Meet',
          excitementAboutTeaching: 'I love seeing the moment when concepts click for students...',
          biggestStrength: 'Patience and ability to explain complex concepts simply',
          creativeExample: 'Used cooking analogies to teach fractions',
          managingDistractedChild: 'Use interactive games and frequent breaks',
          expertTopic: 'Algebra - I can make it fun with real-world applications',
          partTimeWillingness: 'Yes',
          earlyMorningWillingness: 'Yes',
          preferredTimeSlots: ['Evening (5–9 PM)', 'Morning (6–10 AM)'],
          classesPerWeek: '10-15',
          otherCommitments: 'Weekend family time',
          videoUrl: 'https://storage.googleapis.com/bucket/videos/sample1.webm'
        }
      ];
    } catch (error) {
      console.error('Get all applications error:', error);
      return [];
    }
  },

  updateApplicationStatus: async (applicationId, status, reviewedBy) => {
    try {
      // TODO: Replace with actual API call
      console.log('Update application status API call:', { applicationId, status, reviewedBy });
      return true;
    } catch (error) {
      console.error('Update application status error:', error);
      return false;
    }
  }
};
