import React from "react";
import { Button } from "./Button";
import { FiUser } from "react-icons/fi";

interface ConcertCardProps {
  name: string;
  description: string;
  seat: number;
  remain_seat?: number;
  date?: string;
  isReserved?: boolean;
  onDelete?: () => void;
  onReserve?: () => void;
  onCancel?: () => void;
}

export const ConcertCard: React.FC<ConcertCardProps> = ({
  name,
  description,
  seat,
  remain_seat,
  date,
  isReserved = false,
  onDelete,
  onReserve,
  onCancel,
}) => {
  // Check if event is in the past
  const isEventInPast = date ? new Date(date) < new Date() : false;
  
  return (
  <div className="bg-white border border-[#ededed] rounded-sm shadow p-8 flex flex-col gap-4">
    <div className="text-2xl font-bold text-[#1ca4ef] mb-1">{name}</div>
    <hr className="border-t border-[#ededed] my-2" />
    <div className="text-base text-[#212121] mb-2">{description}</div>
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-2 text-base text-[#212121]">
        <FiUser className="text-xl" />
        <span>ที่นั่งทั้งหมด: {seat.toLocaleString()}</span>
        <span className="text-sm text-gray-500">|</span>
        <span className={!remain_seat || remain_seat === 0 ? 'text-red-500' : 'text-green-500'}>
          เหลือ: {(remain_seat || 0).toLocaleString()}
        </span>
      </div>
      {onDelete ? (
        <Button variant="danger" onClick={onDelete}>
          Cancel
        </Button>
      ) : isReserved ? (
        <Button variant="danger" onClick={onCancel}>
          Cancel
        </Button>
      ) : (
        <Button 
          variant="primary" 
          onClick={onReserve}
          disabled={!remain_seat || remain_seat === 0 || isEventInPast}
        >
          {!remain_seat || remain_seat === 0 ? 'เต็มแล้ว' : isEventInPast ? 'หมดเวลาแล้ว' : 'Reserve'}
        </Button>
      )}
    </div>
  </div>
  );
};
