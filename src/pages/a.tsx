import React, { FC, useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Upload } from 'lucide-react';
import whaotLogo from '../.././public/favicon.ico';
import { CustomRadioCheckbox } from '../components/custom/CustomRadioCheckbox';
import { sendApplication } from "../services/TeacherApplicationApi";


interface FormData {
  [key: string]: any;
  videoUpload?: Blob | null;
}

interface Errors {
  [key: string]: string | null;
}

const TeacherApplicationForm: FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Video recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const updateFormData = (questionId: string, value: any): void => {
    console.log(`Updating ${questionId} with value:`, value);
    setFormData(prev => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: null }));
    }
  };

  

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    const requiredFields = [
      'fullName','phoneNumber','email','age','cityState','preferredLanguage',
      'highestQualification','collegeUniversity','yearOfPostGraduation',
      'teachingExperience','currentEmployment','teachingLocation','teachingDuration',
      'platformsUsed','Why are you interested in teaching?','onlineTeachingExperience',
      'maritalStatus','relationStatus','livingArrangement','haveKids','commitmentDuration',
      'thoughtsOnKids','costume','brandedClothes','tShirt','travel','travelFrequency',
      'lastTravel','jobType','fullTimeDecision','teachingChildren','joyTeaching',
      'revising','childBored','childCriticism','lastAngry','ratingDrop','cryingChild',
      'roughDay','studentResults','debateCompetitions','writingExperience','kidPersonality',
      'likeFilms','kidlack','kidLack','teachingDifference','futureEducation','understandingCheck1',
      'understandingCheck2','understandingCheck3','understandingCheck4','understandingCheck5',
      'childSensitivity1','childSensitivity2','goodTouch','socialMedia','emotionalIntelligence',
      'kidExcitement','biggestStrength','creativeExample','distractedChild','excelTopic',
      'confidentSubjects','comfortableAge','audioEquipment','techSavvy','cameraAngle',
      'wifiSpeed','deviceType','weeklyAvailability','weekendAvailability','timeSlots',
      'otherTimeSlots','holidayAvailability','sunlight','sleepTime','wakeUp','Smoking','alcohol',
      'whatsappResponse','missedCalls','socialMediaActive','messageNotifications',
      'appNotifications','socialMediaLinks','teachAbroad','foreignStudents','styleGap',
      'socialMediaImpact','AI,'
    ];
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const ModernDaySelector = ({
  id,
  label,
  required = false,
  selectedDays = [],
  onChange,
  error
}: {
  id: string;
  label: string;
  required?: boolean;
  selectedDays: string[];
  onChange: (days: string[]) => void;
  error?: string | null;
}): JSX.Element => {
  const daysOfWeek = [
    { short: 'S', full: 'Sunday', value: 'Sunday' },
    { short: 'M', full: 'Monday', value: 'Monday' },
    { short: 'T', full: 'Tuesday', value: 'Tuesday' },
    { short: 'W', full: 'Wednesday', value: 'Wednesday' },
    { short: 'T', full: 'Thursday', value: 'Thursday' },
    { short: 'F', full: 'Friday', value: 'Friday' },
    { short: 'S', full: 'Saturday', value: 'Saturday' }
  ];

  const toggleDay = (dayValue: string) => {
    const updated = selectedDays.includes(dayValue)
      ? selectedDays.filter(day => day !== dayValue)
      : [...selectedDays, dayValue];
    onChange(updated);
  };

  const selectAll = () => onChange(daysOfWeek.map(d => d.value));
  const clearAll = () => onChange([]);
  const selectWeekdays = () =>
    onChange(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const selectWeekends = () => onChange(['Saturday', 'Sunday']);

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={selectAll} className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200">All Days</button>
        <button type="button" onClick={selectWeekdays} className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200">Weekdays</button>
        <button type="button" onClick={selectWeekends} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200">Weekends</button>
        <button type="button" onClick={clearAll} className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">Clear All</button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day, index) => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <div key={index} className="text-center">
              <button
                type="button"
                onClick={() => toggleDay(day.value)}
                title={day.full}
                className={`w-12 h-12 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                } ${error ? 'ring-2 ring-red-300' : ''}`}
              >
                {day.short}
              </button>
              <p className="text-xs text-gray-500 mt-1">{day.full.slice(0, 3)}</p>
            </div>
          );
        })}
      </div>

      {selectedDays.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">Selected days:</p>
          <div className="flex flex-wrap gap-2">
            {selectedDays.map((day, i) => (
              <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">{day}</span>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};


function renderDropdownWithRecentYears(name, label) {
  const currentYear = new Date().getFullYear();
  const recentYears = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2];
  const olderYears = [];
  
  for (let year = currentYear - 3; year >= 1980; year--) {
    olderYears.push(year);
  }
  
  return `
    <div class="form-group">
      <label for="${name}" class="form-label">${label}</label>
      <select id="${name}" name="${name}" class="form-select">
        <option value="">Select year</option>
        <optgroup label="Recent Years">
          ${recentYears.map(year => `<option value="${year}">${year}</option>`).join('')}
        </optgroup>
        <optgroup label="Previous Years">
          ${olderYears.map(year => `<option value="${year}">${year}</option>`).join('')}
        </optgroup>
      </select>
    </div>
  `;
}

const renderYearDropdown = (id: string, label: string, required = false): JSX.Element => {
  const currentYear = new Date().getFullYear();
  const value = formData[id] || '';
  const error = errors[id];
  
  // Generate years from current year + 1 down to 1980
  const years: string[] = [];
  for (let year = currentYear + 1; year >= 1980; year--) {
    years.push(year.toString());
  }
  
  return (
    <div className="space-y-2" key={id}>
      <Label htmlFor={id} className="text-base font-medium">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <Select value={value as string} onValueChange={val => updateFormData(id, val)}>
        <SelectTrigger className={`w-full ${error ? 'border-red-500' : ''}`}>
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {years.map(year => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
  const renderLanguageSelector = (
  id: string,
  label: string,
  required = false,
  placeholder = ''
): JSX.Element => {
  // Ensure the field is treated as an array
  const languages: string[] = Array.isArray(formData[id])
    ? formData[id]
    : formData[id]
    ? formData[id].split(',').map((s: string) => s.trim())
    : [];

  const [currentLanguage, setCurrentLanguage] = useState('');
  const error = errors[id];

  const addLanguage = () => {
    const trimmed = currentLanguage.trim();
    if (trimmed && !languages.includes(trimmed)) {
      const updatedLanguages = [...languages, trimmed];
      updateFormData(id, updatedLanguages);
     console.log(formData.preferredLanguages); 
      setCurrentLanguage('');
    }
  };

  const removeLanguage = (langToRemove: string) => {
    const updatedLanguages = languages.filter((lang) => lang !== langToRemove);
    updateFormData(id, updatedLanguages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLanguage();
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-1 font-semibold">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={currentLanguage}
          placeholder={placeholder || 'Type a language and press Enter'}
          onChange={(e) => setCurrentLanguage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
        <Button type="button" onClick={addLanguage}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <span
            key={lang}
            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {lang}
            <button
              type="button"
              onClick={() => removeLanguage(lang)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

  const handleSubmit = async (): Promise<void> => {
    // if (!validateForm()) {
    //   alert('Please fill in all required fields');
    //   return;
    // }
    setIsSubmitting(true);
    try {
      const success = await sendApplication(formData);
      if (success) {
        alert('Application submitted successfully! We will review your submission within 5-7 working days.');
      } else {
        alert('Submission failed. Please try again.');

      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Submission failed. Please try again.');
    }
    setIsSubmitting(false);
  };

  // Recording handlers
  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
      setMediaStream(stream);
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => { if (e.data.size) setRecordedChunks(prev=>[...prev,e.data]); };
      recorder.onstop = handleStop;
      recorder.start(); setMediaRecorder(recorder); setIsRecording(true);
      setTimeout(()=>{ if(recorder.state==='recording')recorder.stop(); },3600000);
    } catch { alert('Cannot access camera/microphone. Please allow permissions.'); }
  };
  const stopRecording = (): void => { if(mediaRecorder?.state==='recording') mediaRecorder.stop(); };
  const handleStop = (): void => {
    const blob=new Blob(recordedChunks,{type:'video/webm'});
    const url=URL.createObjectURL(blob);
    setPreviewUrl(url);
    updateFormData('videoUpload',blob);
    mediaStream?.getTracks().forEach(t=>t.stop());
    setMediaStream(null);setMediaRecorder(null);setIsRecording(false);setRecordedChunks([]);
  };
  

  const renderInput = (
  id: string,
  label: string,
  type: 'text'|'email'|'number'|'textarea'|'select'|'file' = 'text',
  required = false,
  placeholder = '',
  options: string[] = [],
  width = 'w-full'
): JSX.Element => {
  const value = formData[id] || '';
  const error = errors[id];
  
  return (
    <div className="space-y-2" key={id}>
      <Label htmlFor={id} className="text-base font-medium">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      {['text','email','number'].includes(type) && 
        <Input 
          id={id} 
          type={type} 
          value={value as string}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateFormData(id, e.target.value)}
          placeholder={placeholder} 
          className={`${width} ${error ? 'border-red-500' : ''}`}
        />
      }
      
      {type === 'textarea' && 
        <Textarea 
          id={id} 
          value={value as string}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateFormData(id, e.target.value)}
          placeholder={placeholder} 
          className={`${width} min-h-[100px] ${error ? 'border-red-500' : ''}`} 
          rows={3}
        />
      }
      
      {type === 'select' && 
        <Select value={value as string} onValueChange={val => updateFormData(id, val)}>
          <SelectTrigger className={`${width} ${error ? 'border-red-500' : ''}`}>
            <SelectValue placeholder={placeholder}/>
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => 
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            )}
          </SelectContent>
        </Select>
      }
      
      {type === 'file' && 
        <div className={`${width} border-2 border-dashed border-gray-300 rounded-lg p-6 text-center`}>
          <Upload className="mx-auto h-12 w-12 text-gray-400"/>
          <div className="mt-4">
            <Input 
              id={id} 
              type="file" 
              accept="video/*" 
              onChange={e => updateFormData(id, (e.target.files || [])[0])} 
              className="hidden"
            />
            <Label 
              htmlFor={id} 
              className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Upload Video
            </Label>
            <p className="mt-2 text-sm text-gray-500">Upload or record your demo video</p>
          </div>
        </div>
      }
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
  const renderRadioGroup=(id:string,label:string,options:string[],required=false):JSX.Element=>{
    const value=formData[id]||'';const error=errors[id];
    return (<div className="space-y-3" key={id}>
      <Label className="text-base font-medium">{label}{required&&<span className="text-red-500">*</span>}</Label>
      <RadioGroup value={value as string} onValueChange={val=>updateFormData(id,val)} className="grid grid-cols-1 gap-2">
        {options.map(opt=><div key={opt} className="flex items-center space-x-2">
          <RadioGroupItem value={opt} id={`${id}-${opt}`}/><Label htmlFor={`${id}-${opt}`} className="text-sm">{opt}</Label>
        </div>)}
      </RadioGroup>
      {error&&<p className="text-red-500 text-sm">{error}</p>}
    </div>);
  };

  // const renderCustomCheckboxGroup=(id:string,label:string,options:string[],required=false):JSX.Element=>{  
  //   const value=formData[id]||'';const error=errors[id];
  //   return (<div className="space-y-3" key={id}>
  //     <Label className="text-base font-medium">{label}{required&&<span className="text-red-500">*</span>}</Label>
  //     <div className="space-y-2">
  //       {options.map(opt=><div key={opt} className="flex items-center space-x-2">
  //         <CustomRadioCheckbox id={`${id}-${opt}`} value={opt} label={opt} checked={value.includes(opt)}/><Label htmlFor={`${id}-${opt}`} className="text-sm">{opt}</Label>
  //       </div>)}
  //     </div>
  //     {error&&<p className="text-red-500 text-sm">{error}</p>}
  //   </div>);
  // };

  return (
          <div className="min-h-screen bg-yellow-30">
            <header className="bg-[#ffc107]">
              <div className="max-w-4xl mx-auto px-4 py-6 flex items-center space-x-3">
                <img src="/favicon.ico" className="h-10 w-10 rounded-full" />
                {/* <GraduationCap className="h-8 w-8 text-indigo-600" /> */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Teacher Application Form</h1>
                  <p className="text-gray-600">Join Whaot - Where we teach Skills That Matter</p>
                </div>
              </div>
            </header>
            <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
              <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('fullName', '1. Full Name', 'text', true, 'Enter your full name as per government ID')}
                  </CardContent>
                </Card>
              <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('phoneNumber', '2. Phone Number', 'text', true, 'Enter your WhatsApp number')}
                  </CardContent>
                </Card>
              <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('email', '3. Email Address', 'email', true, 'Enter your email address')}
                  </CardContent>
                </Card>
              <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('age', '4. Age', 'number', true, 'Enter your age')}
                  </CardContent>
                </Card>
              <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('gender', '5. Gender (Optional)', ['Male', 'Female', 'Other', 'Prefer not to say'])}  
                  </CardContent>
                </Card>                


                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('city', '6. City', 'text', true, 'Enter your current city')}  
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('state', '7. State', 'text', true, 'Enter your current state')}  
                  </CardContent>
                </Card>
                
                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderLanguageSelector('preferredLanguage', '8. Preferred Language of Instruction', true, 'e.g. Tamil,English, Hindi')} 
                  </CardContent>
                </Card>
                
                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      <CustomRadioCheckbox
                      name = "highestQualification"
                      label = "9. Highest Qualification"
                      options = {['Doctorate/PhD', 'Post-Graduate / Masters', 'Graduate / Bachelors', 'Diploma/Certification', 'Pursuing Degree', 'Other']}
                      required
                      selected={formData.highestQualification || []}
                      onChange={selectedQualifications => updateFormData('highestQualification',selectedQualifications)}
                      /> 
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      <CustomRadioCheckbox
                        name="subjectTaught"
                        label="10. Subjects You Can Teach"
                        options={[
                          'Mathematics', 'Science', 'English', 'Social Studies',
                          'Computer Science', 'Arts & Crafts', 'Music',
                          'Physical Education', 'Other'
                        ]}
                        required
                        selected={formData.subjects || []}
                        onChange={selectedSubjects => updateFormData('subjects',selectedSubjects)}
                      />  
                  </CardContent>
                </Card>




                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderYearDropdown('yearOfPostGraduation', '11. Year of Post-Graduation', true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('teachingExperience', '12. Do you have any teaching experience?', 'textarea', true, 
                      'Describe your teaching experience in detail')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('currentEmployment', '13. Are you currently employed?',['Yes – full-time', 'Yes – part-time/freelance', 'No – I\'m between jobs', 'No – I\'m a student', 'No – I\'m a full-time parent', 'Other (please specify)'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      <CustomRadioCheckbox
                    name = "teachingLocation"
                    label = "14. Where have you taught before?"
                    options = {['Schools', 'Colleges or Universities', 'Coaching centres or Tuition classes', 'EdTech platforms (e.g. Byju\'s, Vedantu)', 'As a private tutor', 'Informally (family, friends, community)', 'Nowhere yet – I\'m just getting started']}
                    required
                    selected={formData.teachingLocation || []}
                    onChange={selectedLocations => updateFormData('teachingLocation',selectedLocations)}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      <CustomRadioCheckbox
                    name = "teachingDuration"
                    label = "15. How long have you been teaching?"
                    options = {['Less than 6 months', '6 months – 1 year', '1–3 years', '3–5 years', 'Over 5 years', 'I haven\'t taught yet']}
                    required
                    selected={formData.teachingDuration || []}
                    onChange={selectedDurations => updateFormData('teachingDuration',selectedDurations)}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      <CustomRadioCheckbox
                    name = "platformsUsed"
                    label = "16. Which platforms or tools have you used for online teaching?"
                    options = {['Zoom', 'Google Meet', 'Microsoft Teams', 'Jitsi Meet', 'Skype', 'WhatsApp Video', 'I haven\'t used any yet', 'Other (please specify)']}
                    required
                    selected={formData.platformsUsed || []}
                    onChange={selectedPlatforms => updateFormData('platformsUsed',selectedPlatforms)}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('interestedteaching?', '17. Why are you interested in teaching?', ['I enjoy working with kids', 'I want to share my knowledge,', 'I’m looking for meaningful work', 'I want flexible income', 'I want to try something new,', 'I’m passionate about a specific subject', 'Other (please specify)'], true)}
                  </CardContent>
                </Card>



                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('onlineTeachingExperience', '18. Have you taught online before?', ['Yes – regularly', 'Yes – occasionally', 'No – but I\'m familiar with how it works', 'No – and I\'m new to the idea'], true)}  
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('maritalStatus', '19. What is your marital status?',['Single', 'Married', 'Divorced', 'Widowed', 'Prefer not to say'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('relationStatus', '20. What is your relationship status?', ['Single', 'In a relationship', ' Married,', 'Its complicated'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('livingArrangement', '21. Are you living alone or with parents?',['Alone', 'With parents', 'With spouse/partner', 'With friends/others'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('haveKids', '22. Do you have kids?',['Yes', 'No', 'Prefer not to say'])}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('commitmentDuration', '23. How long are you planning to be with Whaot as a tutor?',['Less than 6 months', '6-12 months', '1-2 years', '2+ years', 'I\'m not sure'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('thoughtsOnKids', '24. What do you think about kids?', 'textarea', true, 
                      'Share your thoughts and feelings about working with children')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('costume', '25. What kind of costume or dress do you like wearing at work?', 'textarea', true, 
                      'Describe your preferred work attire')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('brandedClothes', '26. Do you like branded clothes?',['Yes', 'No', 'Sometimes'], true)}  
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('tShirt', '27. Will you wear a Whaot t-shirt if required for events or videos? ',['Yes', 'No', 'Depends on the occasion'], true)} 
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('travel often', '28. Do you travel often?', ['Yes', 'No'], true)}   
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('travel frequently', '29. How frequently do you travel?',['Weekly,', 'Monthly','Yearly', 'Rarely'],true)}  
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('travel', '30. Where did you travel last?', 'textarea', true, 
                      'Describe your last travel experience')}
                  </CardContent>
                </Card>




                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('partTimejob', '31. Are you looking for a full-time or part-time job?',['Full-time', 'Part-time,','Open to both'] , true)}  
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('fullTimejob', '32. If Whaot income is sufficient, would you consider making this a full-time job? ', ['Yes', 'No','Maybe'], true)}        
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('teachingChildren', '33. Why do you want to teach children', 'textarea', true, 
                      'Share your motivation and passion for teaching children')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('joyTeaching', '34. What gives you joy when you are teaching?', 'textarea', true, 
                      'Describe what makes teaching fulfilling for you')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('revising', '35. Has there been an exam you passed after revising just the night before?', ['Yes', 'No'], true)}  
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('childBored', '36. What would you do if a child keeps saying “this is boring” in your class?', 'textarea', true, 
                      'Explain how you would handle a bored child in class')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('childCriticism', '37. How do you deal with criticism?', 'textarea', true, 
                      'How do you deal with criticism?')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('lastAngry', '38. When did you last get angry?', 'textarea', true, 
                      'Describe the situation and how you handled it')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('ratingDrop', '39. If your class rating drops one month, how would you respond?', 'textarea', true, 
                      'Describe your response and improvement strategy')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('cryingChild', '40. What would you do if a child starts crying during your class?', 'textarea', true, 
                      'Explain your approach to handle this situation')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('roughDay', '41. You\'ve had a rough day personally, but your class starts in 5 minutes. What will you do?', 'textarea', true, 
                      'Describe how you would prepare yourself')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('studentResults', '42. If your student gets poor results despite your effort, who\'s responsible and why?', 'textarea', true, 
                      'Share your perspective on responsibility and accountability')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('personalDay', '43. You’ve had a rough day personally, but your class starts in 5 minutes. What will you do?', 'textarea', true, 
                      'Describe how you would prepare yourself')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('debateCompetitions', '44. Have you participated in any debate competitions?', ['Yes', 'No'], true)}                
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('writingExperience', '45. Have you ever written a small article or note and presented it to people or published it online?', ['Yes', 'No'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('kidPersonality', '46. Name a personality from film, sports, or academics that you admire.', 'textarea', true, 
                      'Share a personality you admire and why')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      <CustomRadioCheckbox
                                          name = "likeFilms"  
                                          label = "47. What genre of films do you like?"
                                          options = {['Drama', 'Comedy', 'Action', 'Documentary', 'Thriller', 'Animation', 'Other']}
                                          required
                                          selected={formData.likeFilms || []}
                                          onChange={selectedGenres => updateFormData('likeFilms',selectedGenres)}
                                          />
                  </CardContent>
                </Card>





                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('kidGoals', '48. What are the areas in which you want to improve? ', 'textarea', true, 
                      'Share your personal development goals')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('kidLack', '49. What do you think kids lack in school today?', 'textarea', true, 
                      'Share your thoughts on gaps in current education system')} 
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('teachingDifference', '50. Pick a topic you love. How would you teach it differently to a 10-year-old and a 16-year-old?', 'textarea', true, 
                      'Explain your age-appropriate teaching approaches')}
                  </CardContent>
                </Card>
                
                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('futureEducation', '51. What is your prediction about the education system in the next 10 years?', 'textarea', true, 
                      'Share your vision for the future of education')}  
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('understandingCheck', '52. What\'s a question you\'d ask to check if a child truly understood your topic?', 'textarea', true, 
                      'Provide example questions to assess understanding')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('learned from child', '53. When was the last time you learned something from a child?', 'textarea', true, 
                      'Share a recent learning experience with a child')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('teachingStyle of teacher', '54. Describe your teaching style in 3 adjectives.', 'textarea', true, 
                      'Describe your teaching style in 3 adjectives')}
                  </CardContent>
                </Card>
                
                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('favourite teacher', '55. Describe your favourite teacher in 3 adjectives. What’s the gap between the two?', 'textarea', true, 
                      'Describe your favourite teacher in 3 adjectives and the gap between your style and theirs')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('inspiration', '56. List two teachers or professors who inspired you and why.', 'textarea', true, 
                      'List two teachers or professors who inspired you and why')}   
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      <CustomRadioCheckbox
                                          name="childSensitivity words"
                                          label="57. From the below list of words, choose the words that are ideal for a kid."
                                          options={['Curious', 'Silly', 'Kind', 'Loser', 'Brave', 'Annoying', 'Cheerful', 'Smart', 'Rude', 'Friendly', 'Talented', 'Dumb']}
                                          required
                                          selected={formData['childSensitivity words'] || []}
                                          onChange={(e) => updateFormData('childSensitivity words', e)}
                                          />
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      <CustomRadioCheckbox
                                          name='childSensitivity'
                                          label='58. From the below list, identify the terms that are not to be used with kids.'
                                          options={['Shut up', 'Crybaby', 'Champion', 'Stupid', 'Lazy', 'You can do it', 'Useless', 'Well done', 'Fat', 'Idiot', 'You are special', 'Why are you like this?']}
                                          required
                                          selected={formData.childSensitivity || []}
                                          onChange={(e) => updateFormData('childSensitivity', e)}
                                          />
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('goodTouch', '59. Do you know what “good touch” or “bad touch” means?', 'textarea', true, 
                      'Explain your understanding of "good touch" and "bad touch"')}   
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      <CustomRadioCheckbox
                                          name='genZ'
                                          label='60. Are you familiar with Gen Z terms?'
                                          options={['FOMO, Flex, Vibe, Low-key, High-key', 'Glow-up', 'Banger', 'OP', 'Savage', 'Ghosted', 'Rizz', 'Main character', 'Aesthetic', 'Mood', 'Stan', 'Slay', 'Yeet']}
                                          required
                                          selected={formData.genZ || []}
                                          onChange={(e) => updateFormData('genZ', e)}
                                          />
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('socialMedia', '61. What do you think of social media’s impact on children? ', 'textarea', true, 
                      'Share your thoughts on social media\'s impact on children')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('emotionalIntelligence', '62. How would you explain “emotional intelligence” to a 12-year-old?', 'textarea', true, 
                      'Explain emotional intelligence in simple terms for a 12-year-old')}    
                  </CardContent>
                </Card>
                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('kid exites', '63. What excites you about teaching kids?', 'textarea', false, 
                      'Share what motivates you to teach children')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('teacher strength', '64. Your biggest strength as a teacher? ', 'textarea', false, 
                      'Describe your biggest strength as a teacher')}

                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('creativeTeaching', '65. Example of a creative way you taught a concept', 'textarea', false, 
                      'Describe a creative teaching method you used')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('child distraction', '66. How would you manage a distracted child online?', 'textarea', false, 
                      'Explain your approach to keeping children engaged online')}  
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('main topic', '67. One topic you teach better than most & why', 'textarea', false, 
                      ' Describe a topic you excel at teaching and why')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('teacher confidence', '68. List all topics you can teach with confidence', 'textarea', false, 
                      'List subjects/skills you can teach confidently (comma separated)')}  

                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('comfortable child age group ', '69. Which age group of children are you very comfortable teaching?', 'textarea', false, 
                      'Describe the age group you are most comfortable teaching')}    
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('audioEquipment', '70. Do you have a headphone (wireless) or a wired mic?',['Wired mic', 'Wireless headphone', 'Both', 'None'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('techSavvy', '71. How tech savvy are you?', ['Very comfortable – I pick up new tools easily', 'Comfortable – I can handle most common tasks', 'Average – I manage with some help', 'Basic – I can follow instructions', 'Not comfortable – I struggle with most tech'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('cameraAngle', '72. How do you choose a camera angle?', 'textarea', false, 
                      'Describe your approach to camera positioning')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('wifiSpeed', '73. What is the speed of your Wi-Fi (upload/download)?', ['Less than 5 mbps', '5-10 mbps', '10-20 mbps', '20-30 mbps', '30-40 mbps', 'More than 40 mbps'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('deviceType', '74. What kind of device will you use for class?',['Laptop', 'Phone', 'Tablet', 'Other'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      <ModernDaySelector id="weeklyAvailability"  
                    label="75. Which days are you available to teach in a week?"
                    required={true}
                    selectedDays={formData.weeklyAvailability || []}
                    onChange={(days) => updateFormData('weeklyAvailability', days)}
                    error={errors.weeklyAvailability}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('weekendAvailability for teacher', '76. Are you available on weekends, weekdays, or both?',['Weekdays only', 'Weekends only', 'Both'], true)}
                  </CardContent>
                </Card>





                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('timeSlots', '77. What time slots are you available to teach?', 'textarea', false, 
                      'Specify your available time slots in IST')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('otherTimeSlots', '78. What time slots are you available to teach other than regular time (early morning or late night). May be applicable if you are willing to teach students from a', 'textarea', false, 
                      'Specify your available time slots in IST for early morning or late night classes')}  
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('holidayAvailability', '79. Will you be available on holidays?',['Yes', 'No', 'Depends on the holiday'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('sunlight', '80. Do you stand in the sun regularly?',['Yes', 'No', 'Sometimes'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('sleepTime', '81. What time do you sleep?', 'text', true, 'Specify your usual sleep time in IST')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('wakeUp', '82. What time do you wake up?', 'text', true, 'Specify your usual wake-up time in IST')}  
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('Smoking', '83. Do you smoke?',['Yes', 'No', 'Occasionally'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('alcohol', '84. Do you consume alcohol? ',['Yes', 'No', 'Occasionally'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('whatsappResponse', '85. How fast do you reply to your WhatsApp messages?',['Immediately', 'Within an hour', 'Within a day', 'Rarely'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('missedCalls', '86. Do you miss calls often on your phone?',['Yes', 'No', 'Sometimes'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('socialMediaActive', '87. Are you active on Instagram or any social platform?',['Yes', 'No', 'Sometimes'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('messageNotifications', '88. Which message notifications are on/off on your phone?', 'text', false, 
                      'List the message notifications that are currently on or off on your phone')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('appNotifications', '89. Which app notifications are on on your phone? ', 'text', false, 
                      'List the app notifications that are currently on on your phone')}  
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('socialMediaLinks', '90. Share your social media links (optional)', 'text', false, 
                      'Add your social media profile links if you\'d like to share')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('whatsappResponse1', '91. Are you willing to teach abroad (virtually)? ',['Yes', 'No', 'Maybe'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('missedCalls', '92. Have you taught foreign or NRI students? If yes, share details (Country, topic taught, time (IST)', 'text', false, 
                      'Share details of any foreign or NRI students you have taught, including country, topic, and time in IST')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('messageNotifications', '93. What’s the gap between your teaching style and your favourite teacher’s?', 'text', false, 
                      'Describe the gap between your teaching style and that of your favourite teacher')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('appNotifications', '94. Do you think social media has made teaching easier or harder?', 'text', false, 
                      'Share your thoughts on whether social media has made teaching easier or harder')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      <CustomRadioCheckbox
                                            name="AI tools"
                                            label="95. Which AI tools do you use?"
                                            options={['ChatGPT', 'Grammarly', 'Google Gemini', 'Microsoft Copilot', 'Canva Magic Studio', 'Notion AI', 'QuillBot', 'Google Translate']}
                                            required
                                            selected={formData['AI tools'] || []}
                                            onChange={(selectedTools) => updateFormData('AI tools', selectedTools)}
                                          />
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('onboardingSession', '96. You will have a one-to-one session with our tutor onboarding head if selected. Are you okay with that?',['Yes', 'No'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('documentsConsent', '97. You will have to submit ID proofs before onboarding (Aadhaar Card, PAN Card, Educational Certificates, etc.). Please confirm.',['Yes', 'No'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('lifeSkill', '98. If you could teach one life skill to every child, what would it be and why?', 'textarea', true, 
                      'Describe the most important life skill you\'d want to teach')}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('onboardingSession1','99. You will have a one-to-one session with our tutor onboarding head if selected. Are you okay with that? ',['Yes','No'],true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderRadioGroup('feedback','100. Select all topics you can teach confidently on our platform ', ['Abacus','AI & ML','Astronomy','Chess','Coding for Kids','Creative Thinking','Digital Skills','Drawing','Emotional Intelligence','Entrepreneurship','Financial Literacy','Leadership Skills','Self-Defence','Mindfulness','Singing (Western)','Music Instrument','Carnatic (Singing)','Hindustani (Singing)','Indian Knowledge','Olympiad Preparation','Public Speaking','Spoken English','Vedic Maths','Creative Writing','Yoga'], true)}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                  <CardContent className="space-y-4">
                      
                      {renderInput('cameraAngle', '72. How do you choose a camera angle?', 'textarea', false, 
                      'Describe your approach to camera positioning')}
                  </CardContent>
                </Card>

                <p></p>

              <Card className="bg-white rounded-lg p-4 border-0" style={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'}}>
                <CardContent>                
                  <Label className="text-base font-medium">Teaching Demo Video Recording <span className="text-red-500">*</span></Label>
                  <p className="text-sm text-gray-600 mb-4">Please upload a 15 minute video (Quickly Introducte with your name and mention your phone number followed by teaching) where you teach a topic of your interest to children aged 10–14. (Free to use notebook, slides, whiteboard, or any teaching aid) Your face must be visible at all times.</p>
                  
                  {/* Video recording section */}
                  <p className="text-sm text-gray-600">Record a video (up to 1 hour)...</p>
                  <div className="space-y-4">


                    {!previewUrl && !isRecording && (<div className="flex justify-center"><Button onClick={startRecording} className="bg-red-600 hover:bg-red-700 text-white">Start Recording</Button></div>)}
                    {isRecording&&<Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700">Stop Recording</Button>}
                    {previewUrl&&<div className="space-y-2"><video src={previewUrl!} controls className="w-full rounded-lg shadow"/><Button onClick={()=>{setPreviewUrl(null);updateFormData('videoUpload',null);}}>Re-record</Button></div>}
                  </div>
                </CardContent>
              </Card>


            </main>





            <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
              {/* Section 1 */}
              

              {/* Final Submission */}
              <Card className="bg-yellow-50 shadow-md rounded-lg p-6">
              <CardHeader>
                <CardTitle className="text-xl text-yellow-600">✅ Final Submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-4">What Happens Next?</h3>
                  <p className="text-yellow-800 mb-4">
                    Our team will review your submission within 5–7 working days. If shortlisted, we’ll contact you for a quick 1:1 conversation. Thanks for applying to Whaot – where we teach Skills That Matter
                  </p>
                  <p className="text-yellow-800 font-medium">Thanks for applying to Whaot...</p>
                </div>
                {/* THIS button triggers handleSubmit → which calls sendApplication(formData) */}
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="w-full bg-yellow-600 hover:bg-grey-100 text-white py-4 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </Button>
              </CardContent>
          </Card>
          </main>
</div>
  );
};

export default TeacherApplicationForm;
