import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AUDIO_SRC = '/cq-login-theme.mp3';
const TARGET_VOLUME = 0.25; // 25% atmospheric volume

export const CQBackgroundMusic: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userMutedRef = useRef<boolean>(false);

  useEffect(() => {
    // Create single persistent Audio instance
    if (!audioRef.current) {
      const audio = new Audio(AUDIO_SRC);
      audio.loop = true;
      audio.volume = TARGET_VOLUME;
      audio.muted = false;
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    const tryPlay = async () => {
      try {
        await audio.play();
        setIsMuted(false);
      } catch (err) {
        // Autoplay blocked by browser policy; keep sound control in intended SOUND-ON state
        setIsMuted(false);
      }
    };

    tryPlay();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  // Global user interaction listener to trigger audio if initial autoplay was blocked by browser
  useEffect(() => {
    const handleUserInteraction = () => {
      if (userMutedRef.current) return;
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.muted = false;
        audioRef.current.volume = TARGET_VOLUME;
        audioRef.current
          .play()
          .then(() => {
            setIsMuted(false);
          })
          .catch(() => {});
      }
    };

    window.addEventListener('pointerdown', handleUserInteraction, { passive: true, once: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true, once: true });

    return () => {
      window.removeEventListener('pointerdown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (isMuted || audio.paused) {
      userMutedRef.current = false;
      audio.muted = false;
      audio.volume = TARGET_VOLUME;
      audio
        .play()
        .then(() => {
          setIsMuted(false);
        })
        .catch(() => {});
    } else {
      userMutedRef.current = true;
      audio.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <button
      onClick={handleToggleSound}
      type="button"
      aria-label={!isMuted ? 'Mute background music' : 'Unmute background music'}
      title={!isMuted ? 'Mute Background Music' : 'Unmute Background Music'}
      className={`fixed top-5 right-5 sm:top-6 sm:right-6 z-50 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md border transition-all duration-300 cursor-pointer shadow-lg active:scale-95 ${
        !isMuted
          ? 'bg-sky-950/70 border-sky-400/40 text-sky-300 hover:bg-sky-900/90 hover:border-sky-300/70 hover:text-white shadow-sky-500/10'
          : 'bg-slate-950/70 border-slate-700/50 text-slate-400 hover:bg-slate-900/90 hover:border-sky-400/30 hover:text-sky-200'
      }`}
    >
      {!isMuted ? (
        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" />
      ) : (
        <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" />
      )}
    </button>
  );
};
