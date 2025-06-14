
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TeacherAnalytics } from '../components/analytics/TeacherAnalytics';
import { useAuth } from '../contexts/AuthContext';
import { teacherAPI, adminAPI } from '../services/api';
import { TeacherApplication } from '../types/api';
import { toast } from '@/hooks/use-toast';
import { Users, MoreHorizontal, LogOut, UserPlus, BarChart, Eye, CheckCircle, XCircle, Video } from 'lucide-react';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState<TeacherApplication | null>(null);
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'super_admin'>('admin');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await teacherAPI.getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleStatusChange = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const success = await teacherAPI.updateApplicationStatus(
        applicationId, 
        newStatus, 
        admin?.email || 'Unknown'
      );
      
      if (success) {
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId 
              ? { ...app, status: newStatus, reviewedAt: new Date(), reviewedBy: admin?.email }
              : app
          )
        );
        
        toast({
          title: "Status Updated",
          description: `Application has been ${newStatus}`,
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdminEmail || !newAdminPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await adminAPI.createAdmin({
        email: newAdminEmail,
        password: newAdminPassword,
        role: newAdminRole
      });

      if (success) {
        toast({
          title: "Admin Created",
          description: `New ${newAdminRole} account created successfully`,
        });
        
        setNewAdminEmail('');
        setNewAdminPassword('');
        setNewAdminRole('admin');
      } else {
        throw new Error('Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast({
        title: "Error",
        description: "Failed to create admin",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {admin?.email}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Teacher Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="admin-management">Admin Management</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Users className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Review</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {applications.filter(app => app.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Approved</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {applications.filter(app => app.status === 'approved').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Rejected</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {applications.filter(app => app.status === 'rejected').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applications Table */}
            <Card>
              <CardHeader>
                <CardTitle>Teacher Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Email</th>
                        <th className="text-left p-4">Location</th>
                        <th className="text-left p-4">Subjects</th>
                        <th className="text-left p-4">Rate</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Submitted</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application) => (
                        <tr key={application._id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{application.fullName}</td>
                          <td className="p-4 text-gray-600">{application.email}</td>
                          <td className="p-4 text-gray-600">{application.cityState}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {application.subjects.slice(0, 2).map(subject => (
                                <Badge key={subject} variant="secondary" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                              {application.subjects.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{application.subjects.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{application.expectedHourlyRate}</td>
                          <td className="p-4">{getStatusBadge(application.status)}</td>
                          <td className="p-4 text-gray-600">
                            {new Date(application.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem 
                                      onSelect={(e) => {
                                        e.preventDefault();
                                        setSelectedApplication(application);
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  {selectedApplication && (
                                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle>Application Details - {selectedApplication.fullName}</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div>
                                            <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                                            <div className="space-y-2">
                                              <p><strong>Name:</strong> {selectedApplication.fullName}</p>
                                              <p><strong>Email:</strong> {selectedApplication.email}</p>
                                              <p><strong>Phone:</strong> {selectedApplication.phoneNumber}</p>
                                              <p><strong>Age:</strong> {selectedApplication.age}</p>
                                              <p><strong>Gender:</strong> {selectedApplication.gender}</p>
                                              <p><strong>Location:</strong> {selectedApplication.cityState}</p>
                                              <p><strong>Language:</strong> {selectedApplication.preferredLanguage}</p>
                                              <p><strong>Qualification:</strong> {selectedApplication.highestQualification}</p>
                                              <p><strong>University:</strong> {selectedApplication.collegeUniversity}</p>
                                              <p><strong>Graduation Year:</strong> {selectedApplication.yearOfPostGraduation}</p>
                                            </div>
                                          </div>
                                          
                                          <div>
                                            <h3 className="text-lg font-semibold mb-3">Teaching Information</h3>
                                            <div className="space-y-2">
                                              <p><strong>Subjects:</strong> {selectedApplication.subjects.join(', ')}</p>
                                              <p><strong>Expected Rate:</strong> {selectedApplication.expectedHourlyRate}</p>
                                              <p><strong>Online Experience:</strong> {selectedApplication.onlineTeachingExperience}</p>
                                              <p><strong>Platforms Used:</strong> {selectedApplication.toolsPlatforms}</p>
                                              <p><strong>Part-time Willing:</strong> {selectedApplication.partTimeWillingness}</p>
                                              <p><strong>Early Morning:</strong> {selectedApplication.earlyMorningWillingness}</p>
                                              <p><strong>Classes/Week:</strong> {selectedApplication.classesPerWeek}</p>
                                              <p><strong>Time Slots:</strong> {selectedApplication.preferredTimeSlots.join(', ')}</p>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <h3 className="text-lg font-semibold mb-3">Teaching Experience & Style</h3>
                                          <div className="space-y-3">
                                            <div>
                                              <strong>Teaching Experience:</strong>
                                              <p className="mt-1 text-gray-700">{selectedApplication.teachingExperience}</p>
                                            </div>
                                            <div>
                                              <strong>Current Employment:</strong>
                                              <p className="mt-1 text-gray-700">{selectedApplication.currentEmployment}</p>
                                            </div>
                                            <div>
                                              <strong>Excitement About Teaching:</strong>
                                              <p className="mt-1 text-gray-700">{selectedApplication.excitementAboutTeaching}</p>
                                            </div>
                                            <div>
                                              <strong>Biggest Strength:</strong>
                                              <p className="mt-1 text-gray-700">{selectedApplication.biggestStrength}</p>
                                            </div>
                                            <div>
                                              <strong>Creative Teaching Example:</strong>
                                              <p className="mt-1 text-gray-700">{selectedApplication.creativeExample}</p>
                                            </div>
                                            <div>
                                              <strong>Managing Distracted Children:</strong>
                                              <p className="mt-1 text-gray-700">{selectedApplication.managingDistractedChild}</p>
                                            </div>
                                            <div>
                                              <strong>Expert Topic:</strong>
                                              <p className="mt-1 text-gray-700">{selectedApplication.expertTopic}</p>
                                            </div>
                                            <div>
                                              <strong>Other Commitments:</strong>
                                              <p className="mt-1 text-gray-700">{selectedApplication.otherCommitments || 'None mentioned'}</p>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <h3 className="text-lg font-semibold mb-3">Demo Video</h3>
                                          {selectedApplication.videoUrl ? (
                                            <div className="space-y-3">
                                              <div className="bg-gray-100 p-4 rounded-lg">
                                                <p className="flex items-center gap-2">
                                                  <Video className="h-4 w-4" />
                                                  Demo video available
                                                </p>
                                              </div>
                                              <video 
                                                controls 
                                                className="w-full max-w-2xl h-64 bg-black rounded-lg"
                                                src={selectedApplication.videoUrl}
                                              >
                                                Your browser does not support the video tag.
                                              </video>
                                              <p className="text-sm text-gray-600">
                                                Video URL: {selectedApplication.videoUrl}
                                              </p>
                                            </div>
                                          ) : (
                                            <p className="text-red-600">❌ No video uploaded</p>
                                          )}
                                        </div>
                                        
                                        <div className="flex gap-2 pt-4 border-t">
                                          <Button 
                                            onClick={() => handleStatusChange(selectedApplication._id!, 'approved')}
                                            className="bg-green-600 hover:bg-green-700"
                                            disabled={selectedApplication.status !== 'pending'}
                                          >
                                            Approve
                                          </Button>
                                          <Button 
                                            onClick={() => handleStatusChange(selectedApplication._id!, 'rejected')}
                                            variant="destructive"
                                            disabled={selectedApplication.status !== 'pending'}
                                          >
                                            Reject
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  )}
                                </Dialog>
                                
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(application._id!, 'approved')}
                                  disabled={application.status !== 'pending'}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(application._id!, 'rejected')}
                                  disabled={application.status !== 'pending'}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold">Teacher Application Analytics</h2>
            </div>
            <TeacherAnalytics />
          </TabsContent>

          <TabsContent value="admin-management" className="space-y-6">
            {admin?.role === 'super_admin' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Create New Admin
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adminEmail">Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="admin@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminPassword">Password</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="adminRole">Role</Label>
                    <Select value={newAdminRole} onValueChange={(value: 'admin' | 'super_admin') => setNewAdminRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateAdmin}>Create Admin</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
