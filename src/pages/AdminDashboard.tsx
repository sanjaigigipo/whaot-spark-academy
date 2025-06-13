
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
import { toast } from '@/hooks/use-toast';
import { Users, LogOut, UserPlus, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface TeacherApplicationData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  age: string;
  cityState: string;
  subjects: string[];
  expectedHourlyRate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  // ... all other fields from the application
}

// Mock data for demonstration
const MOCK_APPLICATIONS: TeacherApplicationData[] = [
  {
    id: '1',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phoneNumber: '+91 9876543210',
    age: '28',
    cityState: 'Mumbai, Maharashtra',
    subjects: ['Mathematics', 'Physics', 'Coding for Kids'],
    expectedHourlyRate: '800',
    status: 'pending',
    submittedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    fullName: 'Rahul Kumar',
    email: 'rahul.k@email.com',
    phoneNumber: '+91 9876543211',
    age: '32',
    cityState: 'Delhi, India',
    subjects: ['English', 'Creative Writing', 'Public Speaking'],
    expectedHourlyRate: '1000',
    status: 'approved',
    submittedAt: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    fullName: 'Anita Patel',
    email: 'anita.patel@email.com',
    phoneNumber: '+91 9876543212',
    age: '26',
    cityState: 'Ahmedabad, Gujarat',
    subjects: ['Art', 'Drawing', 'Creative Thinking'],
    expectedHourlyRate: '600',
    status: 'rejected',
    submittedAt: '2024-01-13T09:20:00Z'
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
                          <DialogContent className="max-w-4xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>Application Details - {selectedApplication?.fullName}</DialogTitle>
                              <DialogDescription>
                                Complete teacher application information
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-96">
                              {selectedApplication && (
                                <div className="space-y-4 p-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <strong>Full Name:</strong> {selectedApplication.fullName}
                                    </div>
                                    <div>
                                      <strong>Email:</strong> {selectedApplication.email}
                                    </div>
                                    <div>
                                      <strong>Phone:</strong> {selectedApplication.phoneNumber}
                                    </div>
                                    <div>
                                      <strong>Age:</strong> {selectedApplication.age}
                                    </div>
                                    <div>
                                      <strong>Location:</strong> {selectedApplication.cityState}
                                    </div>
                                    <div>
                                      <strong>Expected Rate:</strong> ₹{selectedApplication.expectedHourlyRate}/hr
                                    </div>
                                  </div>
                                  <div>
                                    <strong>Subjects:</strong>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {selectedApplication.subjects.map((subject) => (
                                        <Badge key={subject} variant="secondary">
                                          {subject}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  {/* Video placeholder */}
                                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                    <p className="text-sm text-gray-600">Demo Video (Would be displayed here in real implementation)</p>
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
