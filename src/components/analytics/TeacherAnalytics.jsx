
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Mock data based on the uploaded image
const cityStateData = [
  { name: 'Surat', value: 3, percentage: 25 },
  { name: 'Pune, Maharashtra', value: 1, percentage: 8.3 },
  { name: 'Mavelikara, Kerala', value: 1, percentage: 8.3 },
  { name: 'Kota, Rajasthan', value: 1, percentage: 8.3 },
  { name: 'Madhya Pradesh', value: 1, percentage: 8.3 },
  { name: 'Indore, Madhya Pradesh', value: 1, percentage: 8.3 },
  { name: 'Farrukhabad, Uttar Pradesh', value: 1, percentage: 8.3 },
  { name: 'Coimbatore', value: 1, percentage: 8.3 },
  { name: 'Chennai', value: 1, percentage: 8.3 },
  { name: 'Chabasa, Jharkhand', value: 1, percentage: 8.3 }
];

const qualificationData = [
  { name: "Master's Degree", value: 45, count: 18 },
  { name: "Bachelor's Degree", value: 35, count: 14 },
  { name: 'PhD', value: 12, count: 5 },
  { name: 'Diploma', value: 8, count: 3 }
];

const subjectData = [
  { name: 'Mathematics', count: 25 },
  { name: 'English', count: 22 },
  { name: 'Science', count: 20 },
  { name: 'Coding for Kids', count: 18 },
  { name: 'Creative Writing', count: 15 },
  { name: 'Public Speaking', count: 12 },
  { name: 'Chess', count: 10 },
  { name: 'Drawing', count: 8 }
];

const applicationTrendData = [
  { month: 'Jan', applications: 5 },
  { month: 'Feb', applications: 8 },
  { month: 'Mar', applications: 12 },
  { month: 'Apr', applications: 15 },
  { month: 'May', applications: 22 },
  { month: 'Jun', applications: 18 }
];

const statusData = [
  { name: 'Pending Review', value: 45, count: 18 },
  { name: 'Approved', value: 30, count: 12 },
  { name: 'Rejected', value: 15, count: 6 },
  { name: 'Under Review', value: 10, count: 4 }
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f'];

export const TeacherAnalytics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* City & State Distribution */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>City & State Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityStateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={10}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Application Status */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Qualifications */}
      <Card>
        <CardHeader>
          <CardTitle>Highest Qualifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={qualificationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {qualificationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Popular Subjects */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Teaching Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} fontSize={10} />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Application Trends */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Application Trends (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
