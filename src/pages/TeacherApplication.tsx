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
          {/* ----- SECTION 1: PERSONAL INFORMATION ----- */}
          <Card>
            <CardHeader>
              <CardTitle>1. Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Update each field label, placeholder, or type to match your sheet */}
                <div>
                  <Label htmlFor="fullName">Name (As per your Govt. ID) *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className={errors.fullName ? 'border-red-500' : ''}
                    placeholder="Enter your full legal name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={errors.email ? 'border-red-500' : ''}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phoneNumber">WhatsApp Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                    placeholder="Enter WhatsApp mobile number"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Enter your age"
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                </div>
                <div>
                  <Label htmlFor="cityState">Current City & State *</Label>
                  <Input
                    id="cityState"
                    value={formData.cityState}
                    onChange={(e) => setFormData(prev => ({ ...prev, cityState: e.target.value }))}
                    className={errors.cityState ? 'border-red-500' : ''}
                    placeholder="Enter City, State"
                  />
                  {errors.cityState && <p className="text-red-500 text-sm">{errors.cityState}</p>}
                </div>
                <div>
                  <Label htmlFor="preferredLanguage">Languages you are comfortable teaching in *</Label>
                  <Input
                    id="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                    className={errors.preferredLanguage ? 'border-red-500' : ''}
                    placeholder="E.g. English, Hindi, Tamil"
                  />
                  {errors.preferredLanguage && <p className="text-red-500 text-sm">{errors.preferredLanguage}</p>}
                </div>
                <div>
                  <Label htmlFor="highestQualification">Highest Qualification *</Label>
                  <Select
                    value={formData.highestQualification}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, highestQualification: value }))}
                  >
                    <SelectTrigger className={errors.highestQualification ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your highest qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Doctorate/PhD">Doctorate/PhD</SelectItem>
                      <SelectItem value="Post-Graduate / Masters">Post-Graduate / Masters</SelectItem>
                      <SelectItem value="Graduate / Bachelors">Graduate / Bachelors</SelectItem>
                      <SelectItem value="Diploma/Certification">Diploma/Certification</SelectItem>
                      <SelectItem value="Pursuing Degree">Currently pursuing Graduation/Post-graduation</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.highestQualification && <p className="text-red-500 text-sm">{errors.highestQualification}</p>}
                </div>
                <div>
                  <Label htmlFor="collegeUniversity">College/University *</Label>
                  <Input
                    id="collegeUniversity"
                    value={formData.collegeUniversity}
                    onChange={(e) => setFormData(prev => ({ ...prev, collegeUniversity: e.target.value }))}
                    className={errors.collegeUniversity ? 'border-red-500' : ''}
                    placeholder="Enter full name of institution"
                  />
                  {errors.collegeUniversity && <p className="text-red-500 text-sm">{errors.collegeUniversity}</p>}
                </div>
                <div>
                  <Label htmlFor="yearOfPostGraduation">Year of Graduation/Post Graduation *</Label>
                  <Input
                    id="yearOfPostGraduation"
                    value={formData.yearOfPostGraduation}
                    onChange={(e) => setFormData(prev => ({ ...prev, yearOfPostGraduation: e.target.value }))}
                    className={errors.yearOfPostGraduation ? 'border-red-500' : ''}
                    placeholder="Enter year (e.g. 2022)"
                  />
                  {errors.yearOfPostGraduation && <p className="text-red-500 text-sm">{errors.yearOfPostGraduation}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ----- SECTION 2: RELEVANT EXPERIENCE ----- */}
          <Card>
            <CardHeader>
              <CardTitle>2. Relevant Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Subjects or skills you are confident teaching *</Label>
                <Input
                  value={formData.subjects?.join(", ")}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      subjects: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    }))
                  }
                  placeholder="List subjects (comma separated)"
                  className={errors.subjects ? 'border-red-500' : ''}
                />
                {errors.subjects && <p className="text-red-500 text-sm">{errors.subjects}</p>}
              </div>
              <div>
                <Label htmlFor="teachingExperience">
                  Prior teaching or mentoring experience (if any). Please specify duration, institution, subjects, etc.
                  {true && <span className="text-red-500"> *</span>}
                </Label>
                <Textarea
                  id="teachingExperience"
                  value={formData.teachingExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, teachingExperience: e.target.value }))}
                  className={errors.teachingExperience ? 'border-red-500' : ''}
                  placeholder="Describe briefly"
                />
                {errors.teachingExperience && <p className="text-red-500 text-sm">{errors.teachingExperience}</p>}
              </div>
              <div>
                <Label htmlFor="currentEmployment">Current Occupation / Employment (if any)</Label>
                <Input
                  id="currentEmployment"
                  value={formData.currentEmployment}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentEmployment: e.target.value }))}
                  placeholder="E.g. Teacher at X School, Software Engineer at Y"
                />
              </div>
              <div>
                <Label>Have you taught online before? *</Label>
                <Select
                  value={formData.onlineTeachingExperience}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, onlineTeachingExperience: value }))}
                >
                  <SelectTrigger className={errors.onlineTeachingExperience ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                {errors.onlineTeachingExperience && <p className="text-red-500 text-sm">{errors.onlineTeachingExperience}</p>}
              </div>
              <div>
                <Label htmlFor="toolsPlatforms">If yes, which online tools / platforms have you used?</Label>
                <Input
                  id="toolsPlatforms"
                  value={formData.toolsPlatforms}
                  onChange={(e) => setFormData(prev => ({ ...prev, toolsPlatforms: e.target.value }))}
                  placeholder="E.g. Zoom, Google Meet, Teams, etc."
                  className={errors.toolsPlatforms ? 'border-red-500' : ''}
                />
                {errors.toolsPlatforms && <p className="text-red-500 text-sm">{errors.toolsPlatforms}</p>}
              </div>
            </CardContent>
          </Card>

          {/* ----- SECTION 3: DEEP DIVE & PERSONALITY ----- */}
          <Card>
            <CardHeader>
              <CardTitle>3. Deep Dive & Personality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="excitementAboutTeaching">Why do you want to teach with our platform? What excites you about teaching? *</Label>
                <Textarea
                  id="excitementAboutTeaching"
                  value={formData.excitementAboutTeaching}
                  onChange={(e) => setFormData(prev => ({ ...prev, excitementAboutTeaching: e.target.value }))}
                  className={errors.excitementAboutTeaching ? 'border-red-500' : ''}
                  placeholder="Briefly share your motivation"
                />
                {errors.excitementAboutTeaching && <p className="text-red-500 text-sm">{errors.excitementAboutTeaching}</p>}
              </div>
              <div>
                <Label htmlFor="biggestStrength">Share your biggest strength when it comes to teaching or mentoring *</Label>
                <Textarea
                  id="biggestStrength"
                  value={formData.biggestStrength}
                  onChange={(e) => setFormData(prev => ({ ...prev, biggestStrength: e.target.value }))}
                  className={errors.biggestStrength ? 'border-red-500' : ''}
                  placeholder="Describe your unique edge"
                />
                {errors.biggestStrength && <p className="text-red-500 text-sm">{errors.biggestStrength}</p>}
              </div>
              <div>
                <Label htmlFor="creativeExample">Describe a creative way you taught/mentored someone *</Label>
                <Textarea
                  id="creativeExample"
                  value={formData.creativeExample}
                  onChange={(e) => setFormData(prev => ({ ...prev, creativeExample: e.target.value }))}
                  className={errors.creativeExample ? 'border-red-500' : ''}
                  placeholder="E.g. Using a game, story, activity..."
                />
                {errors.creativeExample && <p className="text-red-500 text-sm">{errors.creativeExample}</p>}
              </div>
              <div>
                <Label htmlFor="managingDistractedChild">How would you handle a disengaged student? *</Label>
                <Textarea
                  id="managingDistractedChild"
                  value={formData.managingDistractedChild}
                  onChange={(e) => setFormData(prev => ({ ...prev, managingDistractedChild: e.target.value }))}
                  className={errors.managingDistractedChild ? 'border-red-500' : ''}
                  placeholder="Your strategy/method"
                />
                {errors.managingDistractedChild && <p className="text-red-500 text-sm">{errors.managingDistractedChild}</p>}
              </div>
              <div>
                <Label htmlFor="expertTopic">If you had to pick *one* topic/subject/skill you can teach best, what is it and why? *</Label>
                <Textarea
                  id="expertTopic"
                  value={formData.expertTopic}
                  onChange={(e) => setFormData(prev => ({ ...prev, expertTopic: e.target.value }))}
                  className={errors.expertTopic ? 'border-red-500' : ''}
                  placeholder="Your core subject and reason"
                />
                {errors.expertTopic && <p className="text-red-500 text-sm">{errors.expertTopic}</p>}
              </div>
            </CardContent>
          </Card>

          {/* ----- SECTION 4: AVAILABILITY & OTHER DETAILS ----- */}
          <Card>
            <CardHeader>
              <CardTitle>4. Availability & Logistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedHourlyRate">Preferred hourly rate (in ₹) *</Label>
                  <Select
                    value={formData.expectedHourlyRate}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, expectedHourlyRate: value }))}
                  >
                    <SelectTrigger className={errors.expectedHourlyRate ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="250-400">₹250-400</SelectItem>
                      <SelectItem value="400-600">₹400-600</SelectItem>
                      <SelectItem value="600-900">₹600-900</SelectItem>
                      <SelectItem value="1000+">₹1000+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.expectedHourlyRate && <p className="text-red-500 text-sm">{errors.expectedHourlyRate}</p>}
                </div>
                <div>
                  <Label>Are you open to part-time teaching opportunities (flexible hours)? *</Label>
                  <Select
                    value={formData.partTimeWillingness}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, partTimeWillingness: value }))}
                  >
                    <SelectTrigger className={errors.partTimeWillingness ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.partTimeWillingness && <p className="text-red-500 text-sm">{errors.partTimeWillingness}</p>}
                </div>
                <div>
                  <Label>Are you available to teach early morning or late evening (international time zones)? *</Label>
                  <Select
                    value={formData.earlyMorningWillingness}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, earlyMorningWillingness: value }))}
                  >
                    <SelectTrigger className={errors.earlyMorningWillingness ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.earlyMorningWillingness && <p className="text-red-500 text-sm">{errors.earlyMorningWillingness}</p>}
                </div>
                <div>
                  <Label htmlFor="classesPerWeek">No. of weekly hours/classes you can commit *</Label>
                  <Input
                    id="classesPerWeek"
                    value={formData.classesPerWeek}
                    onChange={(e) => setFormData(prev => ({ ...prev, classesPerWeek: e.target.value }))}
                    className={errors.classesPerWeek ? 'border-red-500' : ''}
                    placeholder="E.g. 4, 8, 12 (give an exact number)"
                  />
                  {errors.classesPerWeek && <p className="text-red-500 text-sm">{errors.classesPerWeek}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="preferredTimeSlots">Any preferred time slots (India/IST)?</Label>
                <Input
                  id="preferredTimeSlots"
                  value={formData.preferredTimeSlots.join(", ")}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      preferredTimeSlots: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    }))
                  }
                  placeholder="E.g. Monday 6-9 PM, Sat-Sun 8-10 AM"
                  className={errors.preferredTimeSlots ? 'border-red-500' : ''}
                />
                {errors.preferredTimeSlots && <p className="text-red-500 text-sm">{errors.preferredTimeSlots}</p>}
              </div>
              <div>
                <Label htmlFor="otherCommitments">Any other commitments/personal responsibilities that might affect your availability?</Label>
                <Textarea
                  id="otherCommitments"
                  value={formData.otherCommitments}
                  onChange={(e) => setFormData(prev => ({ ...prev, otherCommitments: e.target.value }))}
                  placeholder="Share if any"
                />
              </div>
            </CardContent>
          </Card>

          {/* ----- VIDEO RECORDING ----- */}
          <VideoRecorder 
            onVideoReady={(blob) => setFormData(prev => ({ ...prev, videoBlob: blob }))}
            maxDurationMinutes={60}
          />
          {errors.video && (
            <Alert variant="destructive">
              <AlertDescription>{errors.video}</AlertDescription>
            </Alert>
          )}

          {/* ----- FINAL SUBMISSION CHECKLIST ----- */}
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
