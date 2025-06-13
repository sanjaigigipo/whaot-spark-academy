
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, Square, Play, Pause, RotateCcw } from 'lucide-react';

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
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
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
        onVideoReady(blob);
        setHasRecording(true);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start(1000); // Collect data every second
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

  const resetRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
    setHasRecording(false);
    setRecordedTime(0);
    setError('');
    chunksRef.current = [];
    if (videoRef.current) {
      videoRef.current.srcObject = null;
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

        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
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
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {!isRecording && !hasRecording && (
            <Button onClick={startRecording} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Recording
            </Button>
          )}
          
          {isRecording && (
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

          {hasRecording && (
            <Button 
              onClick={resetRecording}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Record Again
            </Button>
          )}
        </div>

        {hasRecording && (
          <Alert>
            <AlertDescription>
              ✅ Video recorded successfully! You can proceed with your application or record again if needed.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
