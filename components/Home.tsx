'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from 'next/link';

// --- Data and Constants ---

interface Question {
  text: string;
  id: number;
}

const questions: Question[] = [
  { text: "Do you like the color blue?", id: 1 },
  { text: "Do you prefer dogs over cats?", id: 2 },
  { text: "Are you a morning person?", id: 3 },
  // Add more questions here
];

interface Match {
  shape: string;
  description: string;
}

const matches: { [key: string]: Match } = {
  "yesyesyes": {
    shape: "circle",
    description: "You got a perfect match - a circle!",
  },
  "yesyesno": {
    shape: "square",
    description: "You got a square! It's hip to be square.",
  },
  "yesnoyes": {
    shape: "triangle",
    description: "Triangles are your thing! They're so pointy.",
  },
  "yesnono": { shape: "star", description: "Look at you, a star!" },
  "noyesyes": {
    shape: "pentagon",
    description: "Pentagon power! You're so five-sided.",
  },
  "noyesno": {
    shape: "hexagon",
    description: "Hexagons are the bestagons! Or so you answered.",
  },
  "nonoyes": {
    shape: "octagon",
    description: "Eight sides? It's an octagon for you!",
  },
  "nonono": { shape: "heart", description: "Awwww, you got a heart! So sweet." },
};

// --- Swipeable Card Component ---

interface SwipeableCardProps {
  question: Question;
  onSwipe: (action: 'yes' | 'no') => void;
  currentIndex: number;
  isVisible: boolean;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ question, onSwipe, currentIndex, isVisible }) => {
  const [{ x, y, rotate }, api] = useSpring(
    () => ({ x: 0, y: 0, rotate: 0, config: { friction: 50, tension: 500 } }),
    [currentIndex] 
  );

  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], velocity, cancel }) => {
      const trigger = velocity.length > 0.2;
      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) {
        onSwipe(dir > 0 ? 'yes' : 'no');
      }

      api.start({
        x: down ? mx : 0,
        y: down ? 0 : 0,
        rotate: down ? mx / 10 : 0,
        config: { friction: 50, tension: down ? 800 : 500 },
      });

      if (!down) {
        api.start({
          x: 0,
          y: 0,
          rotate: 0,
        });
      }
    }
  );

  if (!isVisible) {
    return null;
  }

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        y,
        rotate,
        touchAction: 'none',
        zIndex: 100,
        opacity: 1,
        transform: `scale(1)`,
        transition: 'transform 0.2s, opacity 0.2s',
      }}
      className="absolute"
    >
      <Card className="w-80 h-[32rem] shadow-xl bg-white rounded-xl overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">
            Question {currentIndex + 1}
          </h2>
          <p className="text-lg mb-6">{question.text}</p>
        </CardContent>
      </Card>
    </animated.div>
  );
};

// --- Match Result Component ---

interface MatchResultProps {
  match: Match | null;
  onAcknowledge: () => void;
  showNextQuestionButton: boolean;
}

const MatchResult: React.FC<MatchResultProps> = ({ match, onAcknowledge, showNextQuestionButton }) => {
  if (!match) return null;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Match!</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-6">
          <p className="text-lg mb-6">{match.description}</p>
          {/* Add logic to display the shape based on match.shape */}
        </div>
        <Button onClick={onAcknowledge} className="mt-6">
          {showNextQuestionButton ? 'Next Question' : 'Try Again'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Home Component ---

const Home: React.FC = () => { 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showMatch, setShowMatch] = useState(false);

  const handleSwipe = useCallback((action: 'yes' | 'no') => {
    setAnswers([...answers, action]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowMatch(true);
    }
  }, [currentQuestionIndex, answers]);

  const handleAcknowledgeMatch = () => {
    setShowMatch(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      resetQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowMatch(false);
  };

  const answerKey = answers.join('');
  const match = matches[answerKey];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
      {/* Profile Link in Upper Right Corner */}
      <div className="absolute top-4 right-4">
        <Link href="/profile" className="text-white hover:underline">
          Profile
        </Link>
      </div>

      <div className="relative h-[32rem] w-80">
        {questions.map((question, index) => (
          <SwipeableCard
            key={question.id}
            question={question}
            onSwipe={handleSwipe}
            currentIndex={currentQuestionIndex}
            isVisible={index === currentQuestionIndex && !showMatch}
          />
        ))}
      </div>

      {showMatch && (
        <MatchResult 
          match={match} 
          onAcknowledge={handleAcknowledgeMatch} 
          showNextQuestionButton={currentQuestionIndex < questions.length - 1} 
        />
      )}
    </div>
  );
};

export default Home; // Export name now matches component name