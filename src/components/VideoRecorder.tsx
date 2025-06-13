
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, Square, Play, Pause, RotateCcw, Upload, Eye } from 'lucide-react';

interface VideoRecorderProps {
  onVideoReady: (videoBlob: Blob) => void;
  maxDurationMinutes?: number;
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ 
  onVideoReady, 
  maxDurationMinutes = 60 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const reviewVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordedBlobRef = useRef<Blob | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordedTime(prev => {
        const newTime = prev + 1;
        if (newTime >= maxDurationMinutes * 60) {
          stopRecording();
        }
        return newTime;
      });
    }, 1000);
  }, [maxDurationMinutes]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      streamRef.current = stream;
      
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        recordedBlobRef.current = blob;
        setHasRecording(true);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        // Create URL for review
        if (reviewVideoRef.current) {
          const url = URL.createObjectURL(blob);
          reviewVideoRef.current.src = url;
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setIsPaused(false);
      startTimer();

    } catch (err) {
      setError('Failed to access camera and microphone. Please grant permissions.');
      console.error('Error accessing media devices:', err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        startTimer();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        stopTimer();
        setIsPaused(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
    }
  };

  const reviewVideo = () => {
    setIsReviewing(true);
  };

  const stopReview = () => {
    setIsReviewing(false);
    if (reviewVideoRef.current) {
      reviewVideoRef.current.pause();
      reviewVideoRef.current.currentTime = 0;
    }
  };

  const uploadVideo = async () => {
    if (!recordedBlobRef.current) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // TODO: Implement GCP upload
      // This is where you'll add your GCP credentials and upload logic
      console.log('Uploading to GCP...', recordedBlobRef.current);
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // Call the callback with the blob
      onVideoReady(recordedBlobRef.current);
      
    } catch (err) {
      setError('Failed to upload video. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const resetRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
    setHasRecording(false);
    setIsReviewing(false);
    setIsUploading(false);
    setUploadProgress(0);
    setRecordedTime(0);
    setError('');
    chunksRef.current = [];
    recordedBlobRef.current = null;
    
    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = null;
    }
    if (reviewVideoRef.current) {
      reviewVideoRef.current.src = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          🎥 Demo Video Recording
        </CardTitle>
        <CardDescription>
          Record your 50-minute teaching demonstration (5–8 mins intro + 40–45 mins teaching)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Live Recording View */}
        {!isReviewing && (
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={liveVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!isRecording && !hasRecording && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <div className="text-center text-white">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Click "Start Recording" to begin</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Review View */}
        {isReviewing && (
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={reviewVideoRef}
              controls
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-lg font-mono">
              {formatTime(recordedTime)} / {formatTime(maxDurationMinutes * 60)}
            </div>
            {isRecording && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  {isPaused ? 'PAUSED' : 'RECORDING'}
                </span>
              </div>
            )}
            {isUploading && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  UPLOADING ({uploadProgress}%)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {!isRecording && !hasRecording && !isReviewing && (
            <Button onClick={startRecording} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Recording
            </Button>
          )}
          
          {isRecording && !isReviewing && (
            <>
              <Button 
                onClick={pauseRecording} 
                variant="outline"
                className="flex items-center gap-2"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button 
                onClick={stopRecording}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop Recording
              </Button>
            </>
          )}

          {hasRecording && !isReviewing && !isUploading && (
            <>
              <Button 
                onClick={reviewVideo}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Review Video
              </Button>
              <Button 
                onClick={uploadVideo}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Video
              </Button>
              <Button 
                onClick={resetRecording}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Record Again
              </Button>
            </>
          )}

          {isReviewing && (
            <>
              <Button 
                onClick={stopReview}
                variant="outline"
                className="flex items-center gap-2"
              >
                Back to Recording
              </Button>
              <Button 
                onClick={uploadVideo}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload This Video
              </Button>
            </>
          )}
        </div>

        {hasRecording && !isUploading && (
          <Alert>
            <AlertDescription>
              ✅ Video recorded successfully! You can review it before uploading or record again if needed.
            </AlertDescription>
          </Alert>
        )}

        {isUploading && (
          <Alert>
            <AlertDescription>
              📤 Uploading video to cloud storage... ({uploadProgress}%)
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
