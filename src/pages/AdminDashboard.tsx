
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Users, LogOut, UserPlus, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface TeacherApplicationData {
  id: string;
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
  
  // System fields
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  videoUrl?: string;
}

// Enhanced mock data with complete information
const MOCK_APPLICATIONS: TeacherApplicationData[] = [
  {
    id: '1',
    // Basic Information
    fullName: 'Priya Sharma',
    phoneNumber: '+91 9876543210',
    email: 'priya.sharma@email.com',
    age: '28',
    gender: 'female',
    cityState: 'Mumbai, Maharashtra',
    preferredLanguage: 'English, Hindi',
    highestQualification: 'M.Sc Computer Science',
    collegeUniversity: 'University of Mumbai',
    yearOfPostGraduation: '2018',
    
    // Education & Experience
    subjects: ['Mathematics', 'Physics', 'Coding for Kids'],
    teachingExperience: 'Taught at local coaching center for 3 years, handled students from grade 8-12',
    currentEmployment: 'Software Developer at TCS. Looking to transition to teaching as it\'s my passion',
    onlineTeachingExperience: 'yes',
    toolsPlatforms: 'Zoom, Google Meet, Microsoft Teams',
    
    // Teaching Style & Personality
    excitementAboutTeaching: 'I love seeing the "aha!" moment when students finally understand a concept. Teaching kids this age is exciting because they\'re so curious and eager to learn.',
    biggestStrength: 'Patience and ability to explain complex concepts in simple terms using real-world examples',
    creativeExample: 'I taught fractions using pizza slices and chocolate bars, making it visual and relatable for students',
    managingDistractedChild: 'I would use interactive games, ask them direct questions, and incorporate their interests into the lesson to regain attention',
    expertTopic: 'Mathematics - I can make even the most complex mathematical concepts easy to understand through visual aids and practical examples',
    
    // Availability & Preferences
    expectedHourlyRate: '800',
    partTimeWillingness: 'yes',
    earlyMorningWillingness: 'yes',
    preferredTimeSlots: ['Evening (5–9 PM)', 'Morning (6–10 AM)'],
    otherCommitments: 'Currently working full-time but planning to transition to part-time teaching',
    classesPerWeek: '15',
    
    // System fields
    status: 'pending',
    submittedAt: '2024-01-15T10:30:00Z',
    videoUrl: 'demo-video-1.mp4'
  },
  {
    id: '2',
    // Basic Information
    fullName: 'Rahul Kumar',
    phoneNumber: '+91 9876543211',
    email: 'rahul.k@email.com',
    age: '32',
    gender: 'male',
    cityState: 'Delhi, India',
    preferredLanguage: 'English',
    highestQualification: 'M.A English Literature',
    collegeUniversity: 'Delhi University',
    yearOfPostGraduation: '2015',
    
    // Education & Experience
    subjects: ['English', 'Creative Writing', 'Public Speaking'],
    teachingExperience: 'High school English teacher for 5 years at St. Mary\'s School',
    currentEmployment: 'Full-time teacher looking to explore online teaching opportunities',
    onlineTeachingExperience: 'yes',
    toolsPlatforms: 'Zoom, Google Classroom, Moodle',
    
    // Teaching Style & Personality
    excitementAboutTeaching: 'Language opens up worlds. I love helping students express themselves better and discover the joy of reading and writing.',
    biggestStrength: 'Storytelling and making literature come alive for students',
    creativeExample: 'I created a mock trial activity for teaching Shakespeare\'s plays, where students acted as lawyers defending characters',
    managingDistractedChild: 'I incorporate movement and role-playing to keep kinesthetic learners engaged',
    expertTopic: 'Creative Writing - I can help students find their unique voice and express their creativity through various writing forms',
    
    // Availability & Preferences
    expectedHourlyRate: '1000',
    partTimeWillingness: 'yes',
    earlyMorningWillingness: 'no',
    preferredTimeSlots: ['Afternoon (12–4 PM)', 'Evening (5–9 PM)'],
    otherCommitments: 'Currently teaching at school but available for evening classes',
    classesPerWeek: '10',
    
    // System fields
    status: 'approved',
    submittedAt: '2024-01-14T15:45:00Z',
    videoUrl: 'demo-video-2.mp4'
  },
  {
    id: '3',
    // Basic Information
    fullName: 'Anita Patel',
    phoneNumber: '+91 9876543212',
    email: 'anita.patel@email.com',
    age: '26',
    gender: 'female',
    cityState: 'Ahmedabad, Gujarat',
    preferredLanguage: 'Hindi, Gujarati, English',
    highestQualification: 'M.F.A Fine Arts',
    collegeUniversity: 'NID Ahmedabad',
    yearOfPostGraduation: '2020',
    
    // Education & Experience
    subjects: ['Art', 'Drawing', 'Creative Thinking'],
    teachingExperience: 'Freelance art instructor for 2 years, conducted workshops for children',
    currentEmployment: 'Freelance graphic designer, looking to add teaching to my portfolio',
    onlineTeachingExperience: 'no',
    toolsPlatforms: 'Basic knowledge of Zoom',
    
    // Teaching Style & Personality
    excitementAboutTeaching: 'Art is a universal language that helps children express emotions and develop creativity beyond academic subjects.',
    biggestStrength: 'Visual communication and hands-on learning approach',
    creativeExample: 'I taught color theory using nature walks and collecting leaves, flowers to understand natural color palettes',
    managingDistractedChild: 'Art naturally engages most children, but I\'d use quick sketch games or color mixing experiments to refocus attention',
    expertTopic: 'Digital Art and Traditional Drawing - I can bridge the gap between traditional art techniques and modern digital tools',
    
    // Availability & Preferences
    expectedHourlyRate: '600',
    partTimeWillingness: 'yes',
    earlyMorningWillingness: 'no',
    preferredTimeSlots: ['Afternoon (12–4 PM)', 'Evening (5–9 PM)'],
    otherCommitments: 'Freelance projects but flexible schedule',
    classesPerWeek: '8',
    
    // System fields
    status: 'rejected',
    submittedAt: '2024-01-13T09:20:00Z',
    videoUrl: 'demo-video-3.mp4'
  }
];

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const [applications, setApplications] = useState<TeacherApplicationData[]>(MOCK_APPLICATIONS);
  const [selectedApplication, setSelectedApplication] = useState<TeacherApplicationData | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  const handleStatusChange = (applicationId: string, newStatus: 'approved' | 'rejected') => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus }
          : app
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Application ${newStatus} successfully.`,
    });
  };

  const handleCreateAdmin = () => {
    if (!newAdminEmail || !newAdminPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would make an API call
    console.log('Creating new admin:', { email: newAdminEmail, password: newAdminPassword });
    
    toast({
      title: "Admin Created",
      description: `New admin ${newAdminEmail} created successfully.`,
    });
    
    setNewAdminEmail('');
    setNewAdminPassword('');
  };

  const filteredApplications = applications.filter(app => 
    filterStatus === 'all' || app.status === filterStatus
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome, {admin?.email}</p>
              </div>
            </div>
            <Button onClick={logout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Teacher Applications</TabsTrigger>
            <TabsTrigger value="admin-management">Admin Management</TabsTrigger>
          </TabsList>

          {/* Teacher Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Applications</p>
                      <p className="text-2xl font-bold">{applications.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {applications.filter(a => a.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Approved</p>
                      <p className="text-2xl font-bold text-green-600">
                        {applications.filter(a => a.status === 'approved').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rejected</p>
                      <p className="text-2xl font-bold text-red-600">
                        {applications.filter(a => a.status === 'rejected').length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Applications</h2>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applications List */}
            <div className="grid gap-4">
              {filteredApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{application.fullName}</h3>
                          {getStatusBadge(application.status)}
                        </div>
                        <p className="text-gray-600">{application.email}</p>
                        <p className="text-sm text-gray-500">{application.cityState}・Age: {application.age}</p>
                        <p className="text-sm text-gray-500">Expected Rate: ₹{application.expectedHourlyRate}/hr</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {application.subjects.slice(0, 3).map((subject) => (
                            <Badge key={subject} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                          {application.subjects.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{application.subjects.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">Submitted: {formatDate(application.submittedAt)}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedApplication(application)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh]">
                            <DialogHeader>
                              <DialogTitle>Complete Application Details - {selectedApplication?.fullName}</DialogTitle>
                              <DialogDescription>
                                Full teacher application information and responses
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[70vh]">
                              {selectedApplication && (
                                <div className="space-y-6 p-4">
                                  {/* Basic Information */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 text-indigo-600">🧾 Basic Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div><strong>Full Name:</strong> {selectedApplication.fullName}</div>
                                      <div><strong>Email:</strong> {selectedApplication.email}</div>
                                      <div><strong>Phone:</strong> {selectedApplication.phoneNumber}</div>
                                      <div><strong>Age:</strong> {selectedApplication.age}</div>
                                      <div><strong>Gender:</strong> {selectedApplication.gender || 'Not specified'}</div>
                                      <div><strong>Location:</strong> {selectedApplication.cityState}</div>
                                      <div><strong>Preferred Language:</strong> {selectedApplication.preferredLanguage}</div>
                                      <div><strong>Highest Qualification:</strong> {selectedApplication.highestQualification}</div>
                                      <div><strong>College/University:</strong> {selectedApplication.collegeUniversity}</div>
                                      <div><strong>Year of Post-Graduation:</strong> {selectedApplication.yearOfPostGraduation}</div>
                                    </div>
                                  </div>

                                  {/* Education & Experience */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 text-green-600">🎓 Education & Experience</h3>
                                    <div className="space-y-3">
                                      <div>
                                        <strong>Subjects to teach:</strong>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {selectedApplication.subjects.map((subject) => (
                                            <Badge key={subject} variant="secondary">
                                              {subject}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <strong>Teaching Experience:</strong>
                                        <p className="mt-1 text-gray-700">{selectedApplication.teachingExperience}</p>
                                      </div>
                                      <div>
                                        <strong>Current Employment:</strong>
                                        <p className="mt-1 text-gray-700">{selectedApplication.currentEmployment}</p>
                                      </div>
                                      <div>
                                        <strong>Online Teaching Experience:</strong> {selectedApplication.onlineTeachingExperience}
                                      </div>
                                      <div>
                                        <strong>Tools/Platforms Used:</strong> {selectedApplication.toolsPlatforms}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Teaching Style & Personality */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 text-purple-600">💡 Teaching Style & Personality</h3>
                                    <div className="space-y-3">
                                      <div>
                                        <strong>What excites you about teaching kids aged 8–18?</strong>
                                        <p className="mt-1 text-gray-700">{selectedApplication.excitementAboutTeaching}</p>
                                      </div>
                                      <div>
                                        <strong>Biggest strength as a teacher:</strong>
                                        <p className="mt-1 text-gray-700">{selectedApplication.biggestStrength}</p>
                                      </div>
                                      <div>
                                        <strong>Creative teaching example:</strong>
                                        <p className="mt-1 text-gray-700">{selectedApplication.creativeExample}</p>
                                      </div>
                                      <div>
                                        <strong>Managing distracted children:</strong>
                                        <p className="mt-1 text-gray-700">{selectedApplication.managingDistractedChild}</p>
                                      </div>
                                      <div>
                                        <strong>Expert topic:</strong>
                                        <p className="mt-1 text-gray-700">{selectedApplication.expertTopic}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Availability & Preferences */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 text-orange-600">💸 Availability & Preferences</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div><strong>Expected Hourly Rate:</strong> ₹{selectedApplication.expectedHourlyRate}</div>
                                      <div><strong>Part-time willingness:</strong> {selectedApplication.partTimeWillingness}</div>
                                      <div><strong>Early morning availability:</strong> {selectedApplication.earlyMorningWillingness}</div>
                                      <div><strong>Classes per week:</strong> {selectedApplication.classesPerWeek}</div>
                                    </div>
                                    <div className="mt-3">
                                      <strong>Preferred time slots:</strong>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {selectedApplication.preferredTimeSlots.map((slot) => (
                                          <Badge key={slot} variant="outline">
                                            {slot}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    {selectedApplication.otherCommitments && (
                                      <div className="mt-3">
                                        <strong>Other commitments:</strong>
                                        <p className="mt-1 text-gray-700">{selectedApplication.otherCommitments}</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Video Section */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 text-red-600">🎥 Demo Video</h3>
                                    <div className="p-4 bg-gray-100 rounded-lg">
                                      {selectedApplication.videoUrl ? (
                                        <p className="text-sm text-gray-600">
                                          Video file: {selectedApplication.videoUrl}
                                          <br />
                                          (Video player would be integrated here in production)
                                        </p>
                                      ) : (
                                        <p className="text-sm text-gray-600">No video uploaded</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Application Status */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3">Application Status</h3>
                                    <div className="flex items-center gap-4">
                                      <div>Status: {getStatusBadge(selectedApplication.status)}</div>
                                      <div>Submitted: {formatDate(selectedApplication.submittedAt)}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>

                        {application.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(application.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(application.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Admin Management Tab */}
          <TabsContent value="admin-management" className="space-y-6">
            {admin?.role === 'super_admin' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Create New Admin
                  </CardTitle>
                  <CardDescription>
                    Add a new admin user to the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newAdminEmail">Email</Label>
                      <Input
                        id="newAdminEmail"
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="admin@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newAdminPassword">Password</Label>
                      <Input
                        id="newAdminPassword"
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateAdmin}>
                    Create Admin
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Current Admin Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">sanjai@gigipo.com</p>
                      <p className="text-sm text-gray-500">Super Admin</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
