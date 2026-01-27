/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";

interface Props {
  targetDate: string; // เช่น "2026-01-31T12:00:00+07:00" หรือ ISO string
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getTimeLeft(targetDate: string): TimeLeft {
  const targetTime = new Date(targetDate).getTime();
  if (Number.isNaN(targetTime)) return ZERO;

  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) return ZERO;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

const CountDown: React.FC<Props> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    getTimeLeft(targetDate),
  );

  useEffect(() => {
    // อัปเดตทันทีเมื่อ targetDate เปลี่ยน
    setTimeLeft(getTimeLeft(targetDate));

    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="text-orange-500 leading-4">
      <div className="inline-block text-xs">
        <span className="mr-1">Ends in:</span>

        <span className="bg-orange-700 text-white min-w-5 px-1.5 rounded-[2px] inline-block min-h-4 text-center">
          {pad(timeLeft.days)}
        </span>
        <span className="mx-1">:</span>

        <span className="bg-orange-700 text-white min-w-5 px-1.5 rounded-[2px] inline-block min-h-4 text-center">
          {pad(timeLeft.hours)}
        </span>
        <span className="mx-1">:</span>

        <span className="bg-orange-700 text-white min-w-5 px-1.5 rounded-[2px] inline-block min-h-4 text-center">
          {pad(timeLeft.minutes)}
        </span>
        <span className="mx-1">:</span>

        <span className="bg-orange-700 text-white min-w-5 px-1.5 rounded-[2px] inline-block min-h-4 text-center">
          {pad(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
};

export default CountDown;
