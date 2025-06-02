import React, { useState, useEffect, useRef } from "react";

const steps = [
  { label: "Inhale", duration: 4 },
  { label: "Hold", duration: 4 },
  { label: "Exhale", duration: 4 },
  { label: "Hold", duration: 4 },
];

const minuteOptions = [10, 15, 20, 30];

export default function BoxBreathing() {
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(selectedMinutes * 60);
  const [stepIdx, setStepIdx] = useState(0);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(steps[0].duration);
  const timerRef = useRef(null);

  useEffect(() => {
    setTotalSecondsLeft(selectedMinutes * 60);
    setIsRunning(false);
    setStepIdx(0);
    setStepSecondsLeft(steps[0].duration);
  }, [selectedMinutes]);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setStepSecondsLeft((s) => {
        if (s > 1) return s - 1;
        // End of this step
        setStepIdx((idx) => {
          const nextIdx = (idx + 1) % steps.length;
          setStepSecondsLeft(steps[nextIdx].duration);
          return nextIdx;
        });
        return 0;
      });
      setTotalSecondsLeft((t) => {
        if (t > 0) return t - 1;
        setIsRunning(false);
        clearInterval(timerRef.current);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  function handleStart() {
    setIsRunning(true);
  }

  function handleReset() {
    setIsRunning(false);
    setTotalSecondsLeft(selectedMinutes * 60);
    setStepIdx(0);
    setStepSecondsLeft(steps[0].duration);
  }

  // Helper to format mm:ss
  function formatTime(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <div className="box-breathing">
      <div className="timer-controls">
        {minuteOptions.map((min) => (
          <button
            key={min}
            onClick={() => setSelectedMinutes(min)}
            className={selectedMinutes === min ? "active" : ""}
            disabled={isRunning}
          >
            {min} min
          </button>
        ))}
      </div>

      <div className="breathing-step">
        <span className="step-label">{steps[stepIdx].label}</span>
        <span className="step-countdown">{stepSecondsLeft > 0 ? stepSecondsLeft : steps[(stepIdx + 1) % steps.length].duration}</span>
      </div>

      <div className="total-timer">
        Total: {formatTime(totalSecondsLeft)}
      </div>

      <div className="breathing-buttons">
        <button onClick={handleStart} disabled={isRunning || totalSecondsLeft === 0}>Start</button>
        <button onClick={handleReset} disabled={!isRunning && totalSecondsLeft === selectedMinutes * 60}>Reset</button>
      </div>

      <style>{`
        .box-breathing {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 2rem 0;
        }
        .timer-controls button {
          margin: 0.5rem;
          padding: 0.5rem 1.5rem;
          font-size: 1.1rem;
          border-radius: 1rem;
          border: none;
          background: #222;
          color: #fff;
          cursor: pointer;
        }
        .timer-controls button.active {
          background: #44e;
        }
        .timer-controls button:disabled {
          opacity: 0.5;
        }
        .breathing-step {
          font-size: 2.8rem;
          font-weight: bold;
          margin: 2.5rem 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .step-label {
          color: #7ed7fa;
          letter-spacing: 0.1em;
        }
        .step-countdown {
          color: #f6c85f;
          font-size: 2rem;
        }
        .total-timer {
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
          color: #ccc;
        }
        .breathing-buttons button {
          margin: 0 1rem;
          padding: 0.5rem 2rem;
          font-size: 1.2rem;
          border-radius: 1rem;
          border: none;
          background: #444;
          color: #fff;
          cursor: pointer;
        }
        .breathing-buttons button:disabled {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
