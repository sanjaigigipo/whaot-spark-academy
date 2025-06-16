
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, CheckCircle, Clock } from 'lucide-react';
import whaotLogo from '../.././public/favicon.ico';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src={whaotLogo} alt="Whaot Logo" className="h-10 w-10 rounded-full" />
              <h1 className="text-2xl font-bold text-gray-900">Whaot Teachers</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            👩‍🏫 Teach with Whaot – Show Us Your Spark
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            You're just one hour away from potentially joining Whaot – a live learning platform 
            that empowers children (ages 8–18) with skills that truly matter.
          </p>
        </div>

        {/* Process Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              📝 What You'll Be Doing (Total Time: ~60 mins)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">1</span>
              <div>
                <strong>Quick Questions</strong> – Tell us about your background and availability (15 mins)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">2</span>
              <div>
                <strong>Teaching Style & Personality</strong> – Short written responses (10 mins)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">3</span>
              <div>
                <strong>Demo Video Recording</strong> – Record a 50-minute class (5–8 mins intro + 40–45 mins teaching)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">4</span>
              <div>
                <strong>Final Submission</strong> – Submit everything in one go
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Camera Ready Checklist */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🧭 Before You Begin – Get Ready!</CardTitle>
            <CardDescription>
              To make the most of this application, please ensure the following:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Bright lighting (natural light or ring light)',
                'Clear audio (mic/earphones, no background noise)',
                'Clean, quiet background',
                'Stable camera at eye level',
                'Neat, presentable appearance',
                'Teaching props, notebook, slides ready',
                'Strong internet connection'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600 font-medium">
              Think of this as your first Whaot class – bring your best energy!
            </p>
          </CardContent>
        </Card>

        {/* CTA Button */}
        <div className="text-center">
          <Link to="/teacher-application">
            <Button size="lg" className="px-8 py-4 text-lg">
              Start Your Application
            </Button>
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            🙌 Our team will review your submission within 5–7 working days
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
