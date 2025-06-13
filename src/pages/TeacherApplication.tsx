import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VideoRecorder } from '../components/VideoRecorder';
import { teacherAPI } from '../services/api';
import { toast } from '@/hooks/use-toast';
import { GraduationCap, ArrowLeft } from 'lucide-react';

interface TeacherApplication {
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
  
  // Video
  videoBlob: Blob | null;
}

const SUBJECTS = [
  'Abacus', 'AI & ML', 'Astronomy', 'Chess', 'Coding for Kids', 'Creative Thinking',
  'Digital Skills', 'Drawing', 'Emotional Intelligence', 'Entrepreneurship',
  'Financial Literacy', 'Leadership Skills', 'Self-Defence', 'Mindfulness',
  'Singing (Western)', 'Music Instrument', 'Carnatic (Singing)', 'Hindustani (Singing)',
  'Indian Knowledge (Slokas, Ramayan, Gita)', 'Olympiad Preparation', 'Public Speaking',
  'Spoken English', 'Vedic Maths', 'Creative Writing', 'Yoga'
];

const TIME_SLOTS = [
  'Morning (6–10 AM)', 'Afternoon (12–4 PM)', 'Evening (5–9 PM)', 
  'Late Night (9 PM onwards)', 'Flexible'
];

const CITIES = [
  'Ahmedabad, Gujarat', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu', 'Coimbatore, Tamil Nadu',
  'Delhi, Delhi', 'Farrukhhabad, Uttar Pradesh', 'Hyderabad, Telangana', 'Indore, Madhya Pradesh',
  'Jaipur, Rajasthan', 'Kota, Rajasthan', 'Kolkata, West Bengal', 'Maharashtra, Maharashtra',
  'Mumbai, Maharashtra', 'Pune, Maharashtra', 'Surat, Gujarat', 'Other'
];

const QUALIFICATIONS = [
  'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Diploma', 'Certificate Course', 'Other'
];

const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 
  'Bengali', 'Gujarati', 'Punjabi', 'Other'
];

const PLATFORMS = [
  'Zoom', 'Google Meet', 'Microsoft Teams', 'Jitsi Meet', 'Skype', 'WhatsApp Video',
  'Facebook Messenger', 'Discord', 'Other', 'None'
];

const TeacherApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TeacherApplication>({
    fullName: '', phoneNumber: '', email: '', age: '', gender: '', cityState: '',
    preferredLanguage: '', highestQualification: '', collegeUniversity: '', yearOfPostGraduation: '',
    subjects: [], teachingExperience: '', currentEmployment: '', onlineTeachingExperience: '',
    toolsPlatforms: '', excitementAboutTeaching: '', biggestStrength: '', creativeExample: '',
    managingDistractedChild: '', expertTopic: '', expectedHourlyRate: '', partTimeWillingness: '',
    earlyMorningWillingness: '', preferredTimeSlots: [], otherCommitments: '', classesPerWeek: '',
    videoBlob: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation for required fields
    const requiredFields = [
      'fullName', 'phoneNumber', 'email', 'age', 'cityState', 'preferredLanguage',
      'highestQualification', 'collegeUniversity', 'yearOfPostGraduation', 'teachingExperience',
      'onlineTeachingExperience', 'toolsPlatforms', 'excitementAboutTeaching', 'biggestStrength',
      'creativeExample', 'managingDistractedChild', 'expertTopic', 'expectedHourlyRate',
      'partTimeWillingness', 'earlyMorningWillingness', 'classesPerWeek'
    ];

    requiredFields.forEach(field => {
      if (!formData[field as keyof TeacherApplication] || (formData[field as keyof TeacherApplication] as string).trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.subjects.length === 0) {
      newErrors.subjects = 'Please select at least one subject';
    }

    if (formData.preferredTimeSlots.length === 0) {
      newErrors.preferredTimeSlots = 'Please select at least one time slot';
    }

    if (!formData.videoBlob) {
      newErrors.video = 'Please record your demo video';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { videoBlob, ...applicationData } = formData;
      
      if (!videoBlob) {
        throw new Error('Video is required');
      }

      const success = await teacherAPI.submitApplication(applicationData, videoBlob);
      
      if (success) {
        toast({
          title: "Application Submitted!",
          description: "Thank you for your application. We'll review it within 5-7 working days.",
        });
        navigate('/');
      } else {
        throw new Error('Failed to submit application');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      subjects: checked 
        ? [...prev.subjects, subject]
        : prev.subjects.filter(s => s !== subject)
    }));
  };

  const handleTimeSlotChange = (timeSlot: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferredTimeSlots: checked 
        ? [...prev.preferredTimeSlots, timeSlot]
        : prev.preferredTimeSlots.filter(s => s !== timeSlot)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Teacher Application</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>🧾 SECTION 1: Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                </div>
                
                <div>
                  <Label htmlFor="phoneNumber">Phone Number (WhatsApp preferred) *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Select value={formData.age} onValueChange={(value) => setFormData(prev => ({ ...prev, age: value }))}>
                    <SelectTrigger className={errors.age ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 43 }, (_, i) => i + 18).map(age => (
                        <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                </div>

                <div>
                  <Label>Gender (Optional)</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cityState">City & State *</Label>
                  <Select value={formData.cityState} onValueChange={(value) => setFormData(prev => ({ ...prev, cityState: value }))}>
                    <SelectTrigger className={errors.cityState ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select city & state" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cityState && <p className="text-red-500 text-sm">{errors.cityState}</p>}
                </div>

                <div>
                  <Label htmlFor="preferredLanguage">Preferred Language of Instruction *</Label>
                  <Select value={formData.preferredLanguage} onValueChange={(value) => setFormData(prev => ({ ...prev, preferredLanguage: value }))}>
                    <SelectTrigger className={errors.preferredLanguage ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.preferredLanguage && <p className="text-red-500 text-sm">{errors.preferredLanguage}</p>}
                </div>

                <div>
                  <Label htmlFor="highestQualification">Highest Qualification *</Label>
                  <Select value={formData.highestQualification} onValueChange={(value) => setFormData(prev => ({ ...prev, highestQualification: value }))}>
                    <SelectTrigger className={errors.highestQualification ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUALIFICATIONS.map(qual => (
                        <SelectItem key={qual} value={qual}>{qual}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.highestQualification && <p className="text-red-500 text-sm">{errors.highestQualification}</p>}
                </div>

                <div>
                  <Label htmlFor="collegeUniversity">College/University Attended *</Label>
                  <Input
                    id="collegeUniversity"
                    value={formData.collegeUniversity}
                    onChange={(e) => setFormData(prev => ({ ...prev, collegeUniversity: e.target.value }))}
                    className={errors.collegeUniversity ? 'border-red-500' : ''}
                  />
                  {errors.collegeUniversity && <p className="text-red-500 text-sm">{errors.collegeUniversity}</p>}
                </div>

                <div>
                  <Label htmlFor="yearOfPostGraduation">Year of Post-Graduation *</Label>
                  <Select value={formData.yearOfPostGraduation} onValueChange={(value) => setFormData(prev => ({ ...prev, yearOfPostGraduation: value }))}>
                    <SelectTrigger className={errors.yearOfPostGraduation ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.yearOfPostGraduation && <p className="text-red-500 text-sm">{errors.yearOfPostGraduation}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Education & Experience */}
          <Card>
            <CardHeader>
              <CardTitle>🎓 SECTION 2: Education & Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Which topics are you confident teaching? (Select all that apply) *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {SUBJECTS.map(subject => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.subjects.includes(subject)}
                        onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                      />
                      <Label htmlFor={subject} className="text-sm">{subject}</Label>
                    </div>
                  ))}
                </div>
                {errors.subjects && <p className="text-red-500 text-sm">{errors.subjects}</p>}
              </div>

              <div>
                <Label htmlFor="teachingExperience">Do you have any teaching experience? If yes, where and for how long? *</Label>
                <Textarea
                  id="teachingExperience"
                  value={formData.teachingExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, teachingExperience: e.target.value }))}
                  className={errors.teachingExperience ? 'border-red-500' : ''}
                />
                {errors.teachingExperience && <p className="text-red-500 text-sm">{errors.teachingExperience}</p>}
              </div>

              <div>
                <Label htmlFor="currentEmployment">If currently employed, where? Why are you exploring teaching?</Label>
                <Textarea
                  id="currentEmployment"
                  value={formData.currentEmployment}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentEmployment: e.target.value }))}
                />
              </div>

              <div>
                <Label>Have you taught online before? *</Label>
                <RadioGroup 
                  value={formData.onlineTeachingExperience} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, onlineTeachingExperience: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="online-yes" />
                    <Label htmlFor="online-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="online-no" />
                    <Label htmlFor="online-no">No</Label>
                  </div>
                </RadioGroup>
                {errors.onlineTeachingExperience && <p className="text-red-500 text-sm">{errors.onlineTeachingExperience}</p>}
              </div>

              <div>
                <Label htmlFor="toolsPlatforms">Tools/platforms you've used *</Label>
                <Select value={formData.toolsPlatforms} onValueChange={(value) => setFormData(prev => ({ ...prev, toolsPlatforms: value }))}>
                  <SelectTrigger className={errors.toolsPlatforms ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map(platform => (
                      <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.toolsPlatforms && <p className="text-red-500 text-sm">{errors.toolsPlatforms}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Teaching Style & Personality */}
          <Card>
            <CardHeader>
              <CardTitle>💡 SECTION 3: Teaching Style & Personality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="excitementAboutTeaching">What excites you about teaching kids aged 8–18? *</Label>
                <Textarea
                  id="excitementAboutTeaching"
                  value={formData.excitementAboutTeaching}
                  onChange={(e) => setFormData(prev => ({ ...prev, excitementAboutTeaching: e.target.value }))}
                  className={errors.excitementAboutTeaching ? 'border-red-500' : ''}
                />
                {errors.excitementAboutTeaching && <p className="text-red-500 text-sm">{errors.excitementAboutTeaching}</p>}
              </div>

              <div>
                <Label htmlFor="biggestStrength">What's your biggest strength as a teacher or communicator? *</Label>
                <Textarea
                  id="biggestStrength"
                  value={formData.biggestStrength}
                  onChange={(e) => setFormData(prev => ({ ...prev, biggestStrength: e.target.value }))}
                  className={errors.biggestStrength ? 'border-red-500' : ''}
                />
                {errors.biggestStrength && <p className="text-red-500 text-sm">{errors.biggestStrength}</p>}
              </div>

              <div>
                <Label htmlFor="creativeExample">Share an example of a creative or fun way you taught a concept. *</Label>
                <Textarea
                  id="creativeExample"
                  value={formData.creativeExample}
                  onChange={(e) => setFormData(prev => ({ ...prev, creativeExample: e.target.value }))}
                  className={errors.creativeExample ? 'border-red-500' : ''}
                />
                {errors.creativeExample && <p className="text-red-500 text-sm">{errors.creativeExample}</p>}
              </div>

              <div>
                <Label htmlFor="managingDistractedChild">How would you manage a distracted or bored child in a class? *</Label>
                <Textarea
                  id="managingDistractedChild"
                  value={formData.managingDistractedChild}
                  onChange={(e) => setFormData(prev => ({ ...prev, managingDistractedChild: e.target.value }))}
                  className={errors.managingDistractedChild ? 'border-red-500' : ''}
                />
                {errors.managingDistractedChild && <p className="text-red-500 text-sm">{errors.managingDistractedChild}</p>}
              </div>

              <div>
                <Label htmlFor="expertTopic">What's one topic you can teach better than most people? Why? *</Label>
                <Textarea
                  id="expertTopic"
                  value={formData.expertTopic}
                  onChange={(e) => setFormData(prev => ({ ...prev, expertTopic: e.target.value }))}
                  className={errors.expertTopic ? 'border-red-500' : ''}
                />
                {errors.expertTopic && <p className="text-red-500 text-sm">{errors.expertTopic}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Availability & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>💸 SECTION 4: Availability & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedHourlyRate">Your expected hourly rate (₹) *</Label>
                  <Select value={formData.expectedHourlyRate} onValueChange={(value) => setFormData(prev => ({ ...prev, expectedHourlyRate: value }))}>
                    <SelectTrigger className={errors.expectedHourlyRate ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select hourly rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="200-400">₹200-400</SelectItem>
                      <SelectItem value="400-600">₹400-600</SelectItem>
                      <SelectItem value="600-800">₹600-800</SelectItem>
                      <SelectItem value="800-1000">₹800-1000</SelectItem>
                      <SelectItem value="1000+">₹1000+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.expectedHourlyRate && <p className="text-red-500 text-sm">{errors.expectedHourlyRate}</p>}
                </div>

                <div>
                  <Label>Are you open to part-time teaching (5–20 hours/week)? *</Label>
                  <RadioGroup 
                    value={formData.partTimeWillingness} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, partTimeWillingness: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="parttime-yes" />
                      <Label htmlFor="parttime-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="parttime-no" />
                      <Label htmlFor="parttime-no">No</Label>
                    </div>
                  </RadioGroup>
                  {errors.partTimeWillingness && <p className="text-red-500 text-sm">{errors.partTimeWillingness}</p>}
                </div>

                <div>
                  <Label>Are you willing to teach early mornings (US/Canada time zones)? *</Label>
                  <RadioGroup 
                    value={formData.earlyMorningWillingness} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, earlyMorningWillingness: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="early-yes" />
                      <Label htmlFor="early-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="early-no" />
                      <Label htmlFor="early-no">No</Label>
                    </div>
                  </RadioGroup>
                  {errors.earlyMorningWillingness && <p className="text-red-500 text-sm">{errors.earlyMorningWillingness}</p>}
                </div>

                <div>
                  <Label htmlFor="classesPerWeek">How many classes per week can you take consistently? *</Label>
                  <Select value={formData.classesPerWeek} onValueChange={(value) => setFormData(prev => ({ ...prev, classesPerWeek: value }))}>
                    <SelectTrigger className={errors.classesPerWeek ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select classes per week" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 classes</SelectItem>
                      <SelectItem value="6-10">6-10 classes</SelectItem>
                      <SelectItem value="11-15">11-15 classes</SelectItem>
                      <SelectItem value="16-20">16-20 classes</SelectItem>
                      <SelectItem value="20+">20+ classes</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.classesPerWeek && <p className="text-red-500 text-sm">{errors.classesPerWeek}</p>}
                </div>
              </div>

              <div>
                <Label>Preferred time slots (IST): *</Label>
                <div className="space-y-2 mt-2">
                  {TIME_SLOTS.map(slot => (
                    <div key={slot} className="flex items-center space-x-2">
                      <Checkbox
                        id={slot}
                        checked={formData.preferredTimeSlots.includes(slot)}
                        onCheckedChange={(checked) => handleTimeSlotChange(slot, checked as boolean)}
                      />
                      <Label htmlFor={slot}>{slot}</Label>
                    </div>
                  ))}
                </div>
                {errors.preferredTimeSlots && <p className="text-red-500 text-sm">{errors.preferredTimeSlots}</p>}
              </div>

              <div>
                <Label htmlFor="otherCommitments">Do you have any other commitments that could affect your availability?</Label>
                <Textarea
                  id="otherCommitments"
                  value={formData.otherCommitments}
                  onChange={(e) => setFormData(prev => ({ ...prev, otherCommitments: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Video Recording */}
          <VideoRecorder 
            onVideoReady={(blob) => setFormData(prev => ({ ...prev, videoBlob: blob }))}
            maxDurationMinutes={60}
          />
          {errors.video && (
            <Alert variant="destructive">
              <AlertDescription>{errors.video}</AlertDescription>
            </Alert>
          )}

          {/* Final Submission */}
          <Card>
            <CardHeader>
              <CardTitle>✅ Final Submission Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox id="check1" />
                  <Label htmlFor="check1">I have recorded a complete 50-min video</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check2" />
                  <Label htmlFor="check2">Lighting and audio are clear</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check3" />
                  <Label htmlFor="check3">I have answered all required questions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check4" />
                  <Label htmlFor="check4">I am genuinely excited about teaching kids online</Label>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
};

export default TeacherApplication;
