'use client';

import { motion, AnimatePresence } from 'framer-motion';

type ProspectState = 'idle' | 'speaking' | 'thinking';

interface ProspectAvatarProps {
  state?: ProspectState;
  size?: number;
  initials?: string;
  name?: string;
}

export function ProspectAvatar({
  state = 'idle',
  size = 80,
  initials = '??',
  name = 'Prospect',
}: ProspectAvatarProps) {
  return (
    <motion.div
      className="relative select-none"
      style={{ width: size, height: size }}
      animate={
        state === 'speaking'
          ? { scale: [1, 1.04, 1] }
          : state === 'thinking'
            ? { scale: [1, 1.02, 1] }
            : {}
      }
      transition={{
        duration: state === 'speaking' ? 0.8 : 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      aria-label={`${name} is ${state}`}
      role="img"
    >
      {/* Glow ring when speaking */}
      <AnimatePresence>
        {state === 'speaking' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-secondary/25 blur-lg"
            style={{ margin: -8 }}
          />
        )}
      </AnimatePresence>

      {/* Avatar circle */}
      <div
        className="relative flex items-center justify-center rounded-full border-2 overflow-hidden"
        style={{
          width: size,
          height: size,
          borderColor:
            state === 'speaking'
              ? 'rgba(67, 148, 229, 0.8)'
              : state === 'thinking'
                ? 'rgba(240, 171, 0, 0.6)'
                : 'rgba(255, 255, 255, 0.15)',
          background: 'linear-gradient(135deg, #2D2D2D 0%, #1E1E1E 100%)',
          transition: 'border-color 0.3s',
        }}
      >
        <span
          className="font-bold text-white/80 select-none"
          style={{ fontSize: size * 0.32 }}
        >
          {initials}
        </span>

        {/* Speaking indicator bars */}
        <AnimatePresence>
          {state === 'speaking' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-1 flex items-end gap-0.5"
            >
              {[0, 0.15, 0.3].map((delay) => (
                <motion.div
                  key={delay}
                  className="w-1 rounded-full bg-secondary"
                  animate={{ height: [4, 10, 4] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thinking dots */}
      <AnimatePresence>
        {state === 'thinking' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -right-1 -bottom-1 flex gap-0.5"
          >
            {[0, 0.2, 0.4].map((delay) => (
              <motion.div
                key={delay}
                className="h-1.5 w-1.5 rounded-full bg-accent"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
