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
    console.log(`Updated`, formData);
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
      'socialMediaImpact','AI'
    ];
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const renderInput = (id:string,label:string,type:'text'|'email'|'number'|'textarea'|'select'|'file'='text',required=false,placeholder='',options:string[]=[]):JSX.Element=>{
    const value=formData[id]||''; const error=errors[id];
    return (<div className="space-y-2" key={id}>
      <Label htmlFor={id} className="text-base font-medium">{label}{required&&<span className="text-red-500">*</span>}</Label>
      {['text','email','number'].includes(type)&&<Input id={id} type={type} value={value as string}
        onChange={(e:ChangeEvent<HTMLInputElement>)=>updateFormData(id,e.target.value)}
        placeholder={placeholder} className={error?'border-red-500':''}/>}'
      {type==='textarea'&&<Textarea id={id} value={value as string}
        onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>updateFormData(id,e.target.value)}
        placeholder={placeholder} className={`min-h-[100px] ${error?'border-red-500':''}`} rows={3}/>}
      {type==='select'&&<Select value={value as string} onValueChange={val=>updateFormData(id,val)}>
        <SelectTrigger className={error?'border-red-500':''}><SelectValue placeholder={placeholder}/></SelectTrigger>
        <SelectContent>{options.map(opt=><SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
      </Select>}
      {type==='file'&&<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400"/>
        <div className="mt-4">
          <Input id={id} type="file" accept="video/*" onChange={e=>updateFormData(id,(e.target.files||[])[0])} className="hidden"/>
          <Label htmlFor={id} className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Upload Video</Label>
          <p className="mt-2 text-sm text-gray-500">Upload or record your demo video</p>
        </div>
      </div>}
      {error&&<p className="text-red-500 text-sm">{error}</p>}
    </div>);
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 py-6 flex items-center space-x-3">
              <img src="/favicon.ico" className="h-10 w-10 rounded-full" />
              {/* <GraduationCap className="h-8 w-8 text-indigo-600" /> */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Teacher Application Form</h1>
                <p className="text-gray-600">Join Whaot - Where we teach Skills That Matter</p>
              </div>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">)
        {/* Section 1 */}
        <Card>
            <CardHeader>
              <CardTitle className="text-xl text-indigo-600">1. Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {renderInput('fullName', '1. Full Name', 'text', true, 'Enter your full name as per government ID')}
                {renderInput('phoneNumber', '2. Phone Number', 'text', true, 'Enter your WhatsApp number')}
                {renderInput('email', '3. Email Address', 'email', true, 'Enter your email address')}
                {renderInput('age', '4. Age', 'number', true, 'Enter your age')}

              
                {renderRadioGroup('gender', '5. Gender (Optional)', ['Male', 'Female', 'Other', 'Prefer not to say'],true)}
                {renderInput('cityState', '6.City & State', 'text', true, 'Enter your current city and state')}
          
              

                {renderInput('preferredLanguage', '7. Preferred Language of Instruction', 'text', true, 'e.g., English, Hindi, Tamil')}

                <CustomRadioCheckbox
                name = "highestQualification"
                label = "8. Highest Qualification"
                options = {['Doctorate/PhD', 'Post-Graduate / Masters', 'Graduate / Bachelors', 'Diploma/Certification', 'Pursuing Degree', 'Other']}
                required
                selected={formData.highestQualification || []}
                onChange={selectedQualifications => updateFormData('highestQualification',selectedQualifications)}
                />

                {/* {renderRadioGroup('highestQualification', '8.Highest Qualification', ['Doctorate/PhD', 'Post-Graduate / Masters', 'Graduate / Bachelors', 'Diploma/Certification', 'Pursuing Degree', 'Other'], true)} */}
                {/* {CustomRadioCheckbox('subjectTaught',  '9. Subjects You Can Teach',['Mathematics','Science','English','Social Studies','Computer Science','Arts & Crafts','Music','Physical Education','Other'],true)} */}

                <CustomRadioCheckbox
                  name="subjectTaught"
                  label="9. Subjects You Can Teach"
                  options={[
                    'Mathematics', 'Science', 'English', 'Social Studies',
                    'Computer Science', 'Arts & Crafts', 'Music',
                    'Physical Education', 'Other'
                  ]}
                  required
                  selected={formData.subjects || []}
                  onChange={selectedSubjects => updateFormData('subjects',selectedSubjects)}
                />
                {renderInput('yearOfPostGraduation', '10. Year of Post-Graduation', 'text', true, 'Enter year (e.g., 2022)')}
                {/* {renderInput('collegeUniversity', '9. College/University Attended', 'text', true, 'Enter institution name')}
              
      
            </CardContent>
          </Card>
        {/* Section 2 */}
        <Card>
            <CardHeader>
              <CardTitle className="text-xl text-indigo-600">2. Teaching Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderInput('teachingExperience', '11. Do you have any teaching experience?', 'textarea', true, 
                'Describe your teaching experience in detail')}
              
              {renderRadioGroup('currentEmployment', '12. Are you currently employed?',['Yes – full-time', 'Yes – part-time/freelance', 'No – I\'m between jobs', 'No – I\'m a student', 'No – I\'m a full-time parent', 'Other (please specify)'], true)}
              
              <CustomRadioCheckbox
              name = "teachingLocation"
              label = "13. Where have you taught before?"
              options = {['Schools', 'Colleges or Universities', 'Coaching centres or Tuition classes', 'EdTech platforms (e.g. Byju\'s, Vedantu)', 'As a private tutor', 'Informally (family, friends, community)', 'Nowhere yet – I\'m just getting started']}
              required
              selected={formData.teachingLocation || []}
              onChange={selectedLocations => updateFormData('teachingLocation',selectedLocations)}
              />
              
              {/* {CustomRadioCheckbox('teachingLocation', '13. Where have you taught before?',['Schools', 'Colleges or Universities', 'Coaching centres or Tuition classes', 'EdTech platforms (e.g. Byju\'s, Vedantu)', 'As a private tutor', 'Informally (family, friends, community)', 'Nowhere yet – I\'m just getting started'], true)} */}

              {renderRadioGroup('teachingDuration', '14. How long have you been teaching?', ['Less than 6 months', '6 months – 1 year', '1–3 years', '3–5 years', 'Over 5 years', 'I haven\'t taught yet'], true)}  
              
            
              
              {/* {CustomRadioCheckbox('platformsUsed', '15. Which platforms or tools have you used for online teaching?',['Zoom', 'Google Meet', 'Microsoft Teams', 'Jitsi Meet', 'Skype', 'WhatsApp Video', 'I haven\'t used any yet', 'Other (please specify)'], true)} */}

             
              {renderRadioGroup('Why are you interested in teaching?', '16. Why are you interested in teaching?', ['I enjoy working with kids', 'I want to share my knowledge,', 'm looking for meaningful work', 'I want flexible income', 'I want to try something new,', 'I’m passionate about a specific subject', 'Other (please specify)'], true)}

              
              {renderRadioGroup('onlineTeachingExperience', '17. Have you taught online before?', ['Yes – regularly', 'Yes – occasionally', 'No – but I\'m familiar with how it works', 'No – and I\'m new to the idea'], true)}  




     
            </CardContent>
          </Card>
        {/* Section 3 */}
        <Card>
            <CardHeader>
              <CardTitle className="text-xl text-indigo-600">3. Personal Details & Life Fit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {renderRadioGroup('maritalStatus', '18. What is your marital status?',['Single', 'Married', 'Divorced', 'Widowed', 'Prefer not to say'], true)}
                
                {renderRadioGroup('relationStatus', '19. What is your relationship status?', ['Single', 'In a relationship', ' Married,', 'Its complicated'], true)}

                {renderRadioGroup('livingArrangement', '20. Are you living alone or with parents?',['Alone', 'With parents', 'With spouse/partner', 'With friends/others'], true)}
         
              
                {renderRadioGroup('haveKids', '21. Do you have kids?',['Yes', 'No', 'Prefer not to say'])}
                
                {renderRadioGroup('commitmentDuration', '22. How long are you planning to be with Whaot as a tutor?',['Less than 6 months', '6-12 months', '1-2 years', '2+ years', 'I\'m not sure'], true)}
              
              {renderInput('thoughtsOnKids', '23. What do you think about kids?', 'textarea', true, 
                'Share your thoughts and feelings about working with children')}
              
              {renderInput('costume', '24. What kind of costume or dress do you like wearing at work?', 'textarea', true, 
                'Describe your preferred work attire')}

              {renderRadioGroup('brandedClothes', '25. Do you like branded clothes?',['Yes', 'No', 'Sometimes'], true)}  

              {renderRadioGroup('tShirt', '26. Will you wear a Whaot t-shirt if required for events or videos? ',['Yes', 'No', 'Depends on the occasion'], true)} 

              {renderRadioGroup('travel often', '27. Do you travel often?', ['Yes', 'No'], true)}   

              {renderRadioGroup('travel frequently', '28. How frequently do you travel?',['Weekly,', 'Monthly','Yearly', 'Rarely'],true)}  

              {renderInput('travel', '29. Where did you travel last?', 'textarea', true, 
                'Describe your last travel experience')} 

              {renderRadioGroup('partTimejob', '30. Are you looking for a full-time or part-time job?',['Full-time', 'Part-time,','Open to both'] , true)}  

              {renderRadioGroup('fullTimejob', '31. If Whaot income is sufficient, would you consider making this a full-time job? ', ['Yes', 'No','Maybe'], true)}        



            </CardContent>
          </Card>
        {/* Section 4 */}
        <Card>
            <CardHeader>
              <CardTitle className="text-xl text-indigo-600">4. Mindset, Attitude, and Emotional Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              {renderInput('teachingChildren', '32. Why do you want to teach children', 'textarea', true, 
                'Share your motivation and passion for teaching children')}

              {renderInput('joyTeaching', '33. What gives you joy when you are teaching?', 'textarea', true, 
                'Describe what makes teaching fulfilling for you')} 

              {renderRadioGroup('revising', '34. Has there been an exam you passed after revising just the night before?', ['Yes', 'No'], true)}  

              {renderInput('childBored', '35. What would you do if a child keeps saying “this is boring” in your class?', 'textarea', true, 
                'Explain how you would handle a bored child in class')}

              {renderInput('childCriticism', '36. How do you deal with criticism?', 'textarea', true, 
                'How do you deal with criticism?')}    

              {renderInput('lastAngry', '37. When did you last get angry?', 'textarea', true, 
                'Describe the situation and how you handled it')}
              
              {renderInput('ratingDrop', '38. If your class rating drops one month, how would you respond?', 'textarea', true, 
                'Describe your response and improvement strategy')}
              
              {renderInput('cryingChild', '39. What would you do if a child starts crying during your class?', 'textarea', true, 
                'Explain your approach to handle this situation')}
              
              {renderInput('roughDay', '40. You\'ve had a rough day personally, but your class starts in 5 minutes. What will you do?', 'textarea', true, 
                'Describe how you would prepare yourself')}
              
              {renderInput('studentResults', '41. If your student gets poor results despite your effort, who\'s responsible and why?', 'textarea', true, 
                'Share your perspective on responsibility and accountability')}
              
              {renderInput('personalDay', '42. You’ve had a rough day personally, but your class starts in 5 minutes. What will you do?', 'textarea', true, 
                'Describe how you would prepare yourself')}

               

              {renderRadioGroup('debateCompetitions', '43. Have you participated in any debate competitions?', ['Yes', 'No'], true)}                
                
              {renderRadioGroup('writingExperience', '44. Have you ever written a small article or note and presented it to people or published it online?', ['Yes', 'No'], true)}

              {renderInput('kidPersonality', '45. Name a personality from film, sports, or academics that you admire.', 'textarea', true, 
                'Share a personality you admire and why')}

              {/* {CustomRadioCheckbox('likeFilms', '46. What genre of films do you like? ', ['Drama', 'Comedy', 'Action','Documentary,Thriller', 'Animation', 'Other'], true)} */}

              {renderInput('kidGoals', '47. What are the areas in which you want to improve? ', 'textarea', true, 
                'Share your personal development goals')} 

              {renderInput('kidLack', '48. What do you think kids lack in school today?', 'textarea', true, 
                'Share your thoughts on gaps in current education system')} 

            </CardContent>
          </Card>
        {/* Section 5 */}
        <Card>
            <CardHeader>
              <CardTitle className="text-xl text-indigo-600">5. Conceptual Teaching, Psychology, and Child Sensitivity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderInput('teachingDifference', '49. Pick a topic you love. How would you teach it differently to a 10-year-old and a 16-year-old?', 'textarea', true, 
                'Explain your age-appropriate teaching approaches')}

              {renderInput('futureEducation', '50. What is your prediction about the education system in the next 10 years?', 'textarea', true, 
                'Share your vision for the future of education')}  
              
              {renderInput('understandingCheck', '51. What\'s a question you\'d ask to check if a child truly understood your topic?', 'textarea', true, 
                'Provide example questions to assess understanding')}



              {renderInput('learned from child', '52. When was the last time you learned something from a child?', 'textarea', true, 
                'Share a recent learning experience with a child')}


              {renderInput('teachingStyle of teacher', '53. Describe your teaching style in 3 adjectives.', 'textarea', true, 
                'Describe your teaching style in 3 adjectives')}

              {renderInput('favourite teacher', '54. Describe your favourite teacher in 3 adjectives. What’s the gap between the two?', 'textarea', true, 
                'Describe your favourite teacher in 3 adjectives and the gap between your style and theirs')}


              {renderInput('inspiration', '55. List two teachers or professors who inspired you and why.', 'textarea', true, 
                'List two teachers or professors who inspired you and why')}   

              <CustomRadioCheckbox
              name="childSensitivity words"
              label="56. From the below list of words, choose the words that are ideal for a kid."
              options={['Curious', 'Silly', 'Kind', 'Loser', 'Brave', 'Annoying', 'Cheerful', 'Smart', 'Rude', 'Friendly', 'Talented', 'Dumb']}
              required
              selected={formData['childSensitivity words'] || []}
              onChange={(e) => updateFormData('childSensitivity words', e)}
              />
              {/* {CustomRadioCheckbox('childSensitivity words', '56. From the below list of words, choose the words that are ideal for a kid.', ['Curious', 'Silly', 'Kind', 'Loser', 'Brave','Annoying', 'Cheerful', 'Smart', 'Rude','Friendly', 'Talented', 'Dumb'],
                 true)}       */}
               
              {/* {CustomRadioCheckbox('childSensitivity', '57. From the below list, identify the terms that are not to beused with kids.', ['Shut up', 'Crybaby', 'Champion', 'Stupid','Lazy', 'You can do it', 'Useless', 'Well done','Fat', 'Idiot', 'You are special, Why are you like this?'],true)}  */}


              {renderInput('goodTouch', '58. Do you know what “good touch” or “bad touch” means?', 'textarea', true, 
                'Explain your understanding of "good touch" and "bad touch"')}   
              
              {/* {CustomRadioCheckbox('genZ', '59. Are you familiar with Gen Z terms? ', ['FOMO, Flex, Vibe, Low-key, High-key','Glow-up', 'Banger', 'OP', 'Savage', 'Ghosted','Rizz', 'Main character', 'Aesthetic', 'Mood','Stan','Slay', 'Yeet'],true)}  */}
 


             {renderInput('socialMedia', '60. What do you think of social media’s impact on children? ', 'textarea', true, 
                'Share your thoughts on social media\'s impact on children')}

             {renderInput('emotionalIntelligence', '61. How would you explain “emotional intelligence” to a 12-year-old?', 'textarea', true, 
                'Explain emotional intelligence in simple terms for a 12-year-old')}    
            
            </CardContent>
          </Card>

        {/* Section 6 */}
        <Card>
            <CardHeader>
              <CardTitle className="text-xl text-indigo-600">6. Tech Setup, Scheduling & Readiness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
             

              {renderInput('kid exites', '62. What excites you about teaching kids?', 'textarea', false, 
                'Share what motivates you to teach children')}

              {renderInput('teacher strength', '63. Your biggest strength as a teacher? ', 'textarea', false, 
                'Describe your biggest strength as a teacher')}

              {renderInput('creativeTeaching', '64. Example of a creative way you taught a concept', 'textarea', false, 
                'Describe a creative teaching method you used')}

              {renderInput('child distraction', '65. How would you manage a distracted child online?', 'textarea', false, 
                'Explain your approach to keeping children engaged online')}  

              {renderInput('main topic', '66. One topic you teach better than most & why', 'textarea', false, 
                ' Describe a topic you excel at teaching and why')}

              {renderInput('teacher confidence', '67. List all topics you can teach with confidence', 'textarea', false, 
                'List subjects/skills you can teach confidently (comma separated)')}  

              {renderInput('comfortable child age group ', '68. Which age group of children are you very comfortable teaching?', 'textarea', false, 
                'Describe the age group you are most comfortable teaching')}    

              {renderRadioGroup('audioEquipment', '69. Do you have a headphone (wireless) or a wired mic?',['Wired mic', 'Wireless headphone', 'Both', 'None'], true)}
                
              {renderRadioGroup('techSavvy', '70. How tech savvy are you?', ['Very comfortable – I pick up new tools easily', 'Comfortable – I can handle most common tasks', 'Average – I manage with some help', 'Basic – I can follow instructions', 'Not comfortable – I struggle with most tech'], true)}
             
              
              {renderInput('cameraAngle', '71. How do you choose a camera angle?', 'textarea', false, 
                'Describe your approach to camera positioning')}
              
              {renderInput('wifiSpeed', '72. What is the speed of your Wi-Fi (upload/download)?', 'text', false, 'e.g., 50 Mbps / 10 Mbps')}
                
              {renderRadioGroup('deviceType', '73. What kind of device will you use for class?',['Laptop', 'Phone', 'Tablet', 'Other'], true)}
          
              
             
              {renderRadioGroup('weeklyAvailability', '74. Which days are you available to teach in a week?',['Monday to Friday', 'Weekends only', 'All days', 'Custom'], true)}
                
              {renderRadioGroup('weekendAvailability', '75. Are you available on weekends, weekdays, or both?',['Weekdays only', 'Weekends only', 'Both'], true)}
       
              
              {renderInput('timeSlots', '76. What time slots are you available to teach?', 'textarea', false, 
                'Specify your available time slots in IST')}

              {renderInput('otherTimeSlots', '77. What time slots are you available to teach other than regular time (early morning or late night). May be applicable if you are willing to teach students from a', 'textarea', false, 
                'Specify your available time slots in IST for early morning or late night classes')}  
              
              {renderRadioGroup('holidayAvailability', '78. Will you be available on holidays?',['Yes', 'No', 'Depends on the holiday'], true)}

              {renderRadioGroup('sunlight', '79. Do you stand in the sun regularly?',['Yes', 'No', 'Sometimes'], true)}

              {renderInput('sleepTime', '80. What time do you sleep? ', 'textarea', false, 
                'Specify your usual sleep time in IST')}

              {renderInput('wakeUp', '81. What time do you wake up?', 'textarea', false, 
                'Specify your usual wake-up time in IST')}  

              {renderRadioGroup('Smoking', '82. Do you smoke?',['Yes', 'No', 'Occasionally'], true)}

              {renderRadioGroup('alcohol', '83. Do you consume alcohol? ',['Yes', 'No', 'Occasionally'], true)}

            </CardContent>
          </Card>
        {/* Section 7 */}
        <Card>
            <CardHeader>
              <CardTitle className="text-xl text-indigo-600">7. Communication Habits & Digital Awareness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
             
              {renderRadioGroup('whatsappResponse', '84. How fast do you reply to your WhatsApp messages?',['Immediately', 'Within an hour', 'Within a day', 'Rarely'], true)}
                
              {renderRadioGroup('missedCalls', '85. Do you miss calls often on your phone?',['Yes', 'No', 'Sometimes'], true)}
              
              {renderRadioGroup('socialMediaActive', '86. Are you active on Instagram or any social platform?',['Yes', 'No', 'Sometimes'], true)}
              
              {renderInput('messageNotifications', '87. Which message notifications are on/off on your phone?', 'text', false, 
                'List the message notifications that are currently on or off on your phone')}

              {renderInput('appNotifications', '88. Which app notifications are on on your phone? ', 'text', false, 
                'List the app notifications that are currently on on your phone')}  
              
              {renderInput('socialMediaLinks', '89. Share your social media links (optional)', 'text', false, 
                'Add your social media profile links if you\'d like to share')}
            </CardContent>
          </Card>

          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-indigo-600">8. Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
             
              {renderRadioGroup('whatsappResponse', '90. Are you willing to teach abroad (virtually)? ',['Yes', 'No', 'Maybe'], true)}
                
              {renderInput('missedCalls', '91. Have you taught foreign or NRI students? If yes, share details (Country, topic taught, time (IST)', 'text', false, 
                'Share details of any foreign or NRI students you have taught, including country, topic, and time in IST')} 
              
              {renderInput('messageNotifications', '92. What’s the gap between your teaching style and your favourite teacher’s?', 'text', false, 
                'Describe the gap between your teaching style and that of your favourite teacher')}

              {renderInput('appNotifications', '93. Do you think social media has made teaching easier or harder?', 'text', false, 
                'Share your thoughts on whether social media has made teaching easier or harder')}  
              
              {/* {CustomRadioCheckbox('AI', '94. Which AI tools do you use?',['ChatGPT', 'Grammarly', 'Google Gemini','Microsoft Copilot', 'Canva Magic Studio','Notion AI', 'QuillBot', 'Google Translate'], true)} */}

            </CardContent>
          </Card>
        {/* Section 8 */}
        <Card>
            <CardHeader>
              <CardTitle className="text-xl text-indigo-600">9. Teaching Demo Video & Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {renderRadioGroup('onboardingSession', '95. You will have a one-to-one session with our tutor onboarding head if selected. Are you okay with that?',['Yes', 'No'], true)}
                
                {renderRadioGroup('documentsConsent', '96. You will have to submit ID proofs before onboarding (Aadhaar Card, PAN Card, Educational Certificates, etc.). Please confirm.',['Yes', 'No'], true)}

              
              {renderInput('lifeSkill', '97. If you could teach one life skill to every child, what would it be and why?', 'textarea', true, 
                'Describe the most important life skill you\'d want to teach')}

              {/* {CustomRadioCheckbox('feedback', '98. Select all topics you can teach confidently on our platform ', ['Abacus','AI & ML','Astronomy','Chess','Coding for Kids','Creative Thinking','Digital Skills','Drawing','Emotional Intelligence','Entrepreneurship','Financial Literacy','Leadership Skills','Self-Defence','Mindfulness','Singing (Western)','Music Instrument','Carnatic (Singing)','Hindustani (Singing)','Indian Knowledge','Olympiad Preparation','Public Speaking','Spoken English','Vedic Maths','Creative Writing','Yoga'], true)}                 */}
                
            </CardContent>
          </Card>

        {/* Section 9 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-indigo-600">9. Teaching Demo Video & Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderRadioGroup('onboardingSession','95. You will have a one-to-one session...',['Yes','No'],true)}
            {renderRadioGroup('documentsConsent','96. You will have to submit ID proofs...',['Yes','No'],true)}
            {renderInput('lifeSkill','97. If you could teach one life skill...', 'textarea', true)}
            {renderRadioGroup('feedback','98. Select all topics...', ['Abacus','AI & ML','Astronomy','Chess','Coding for Kids','Creative Thinking','Digital Skills','Drawing','Emotional Intelligence','Entrepreneurship','Financial Literacy','Leadership Skills','Self-Defence','Mindfulness','Singing (Western)','Music Instrument','Carnatic (Singing)','Hindustani (Singing)','Indian Knowledge','Olympiad Preparation','Public Speaking','Spoken English','Vedic Maths','Creative Writing','Yoga'], true)}
            <p></p>
            <Label className="text-base font-medium">Teaching Demo Video Recording <span className="text-red-500">*</span></Label>
            <p className="text-sm text-gray-600">Record a video (up to 1 hour)...</p>
            <div className="space-y-4">


              {!previewUrl&&!isRecording&&<Button onClick={startRecording}>Start Recording</Button>}
              {isRecording&&<Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700">Stop Recording</Button>}
              {previewUrl&&<div className="space-y-2"><video src={previewUrl!} controls className="w-full rounded-lg shadow"/><Button onClick={()=>{setPreviewUrl(null);updateFormData('videoUpload',null);}}>Re-record</Button></div>}
            </div>
          </CardContent>
        </Card>

        {/* Final Submission */}
        <Card>
      <CardHeader>
        <CardTitle className="text-xl text-indigo-600">✅ Final Submission</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-4">What Happens Next?</h3>
          <p className="text-blue-800 mb-4">
            Our team will review your submission within 5–7 working days. If shortlisted, we’ll contact you for a quick 1:1 conversation. Thanks for applying to Whaot – where we teach Skills That Matter
          </p>
          <p className="text-blue-800 font-medium">Thanks for applying to Whaot...</p>
        </div>
        {/* THIS button triggers handleSubmit → which calls sendApplication(formData) */}
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 text-lg"
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
