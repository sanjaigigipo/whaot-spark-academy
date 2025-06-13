
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
      // Here you would normally send to your API
      console.log('Teacher application submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Application Submitted!",
        description: "Thank you for your application. We'll review it within 5-7 working days.",
      });

      // Reset form or redirect
      navigate('/');
      
    } catch (error) {
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
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                </div>

                <div>
                  <Label>Gender (Optional)</Label>
                  <RadioGroup 
                    value={formData.gender} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="cityState">City & State *</Label>
                  <Input
                    id="cityState"
                    value={formData.cityState}
                    onChange={(e) => setFormData(prev => ({ ...prev, cityState: e.target.value }))}
                    className={errors.cityState ? 'border-red-500' : ''}
                  />
                  {errors.cityState && <p className="text-red-500 text-sm">{errors.cityState}</p>}
                </div>

                <div>
                  <Label htmlFor="preferredLanguage">Preferred Language of Instruction *</Label>
                  <Input
                    id="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                    className={errors.preferredLanguage ? 'border-red-500' : ''}
                  />
                  {errors.preferredLanguage && <p className="text-red-500 text-sm">{errors.preferredLanguage}</p>}
                </div>

                <div>
                  <Label htmlFor="highestQualification">Highest Qualification *</Label>
                  <Input
                    id="highestQualification"
                    value={formData.highestQualification}
                    onChange={(e) => setFormData(prev => ({ ...prev, highestQualification: e.target.value }))}
                    className={errors.highestQualification ? 'border-red-500' : ''}
                  />
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
                  <Input
                    id="yearOfPostGraduation"
                    value={formData.yearOfPostGraduation}
                    onChange={(e) => setFormData(prev => ({ ...prev, yearOfPostGraduation: e.target.value }))}
                    className={errors.yearOfPostGraduation ? 'border-red-500' : ''}
                  />
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
                <Label htmlFor="onlineTeachingExperience">Have you taught online before? *</Label>
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
                <Label htmlFor="toolsPlatforms">Tools/platforms you've used (Zoom, Jitsi, Google Meet, etc.) *</Label>
                <Input
                  id="toolsPlatforms"
                  value={formData.toolsPlatforms}
                  onChange={(e) => setFormData(prev => ({ ...prev, toolsPlatforms: e.target.value }))}
                  className={errors.toolsPlatforms ? 'border-red-500' : ''}
                />
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
                  <Input
                    id="expectedHourlyRate"
                    type="number"
                    value={formData.expectedHourlyRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedHourlyRate: e.target.value }))}
                    className={errors.expectedHourlyRate ? 'border-red-500' : ''}
                  />
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
                  <Input
                    id="classesPerWeek"
                    type="number"
                    value={formData.classesPerWeek}
                    onChange={(e) => setFormData(prev => ({ ...prev, classesPerWeek: e.target.value }))}
                    className={errors.classesPerWeek ? 'border-red-500' : ''}
                  />
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
