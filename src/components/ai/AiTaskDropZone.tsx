import React, { useState } from 'react';
import { GlassCard, StatusBadge } from '../common/PremiumUI';

/**
 * PHASE 10 - TASK 10.7: AI Task Drop Zone
 */
export const AiTaskDropZone: React.FC = () => {
  const [droppedTasks, setDroppedTasks] = useState<any[]>([]);
  const [isOver, setIsOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const data = e.dataTransfer.getData('suggestion');
    if (data) {
      const suggestion = JSON.parse(data);
      setDroppedTasks([...droppedTasks, { ...suggestion, timestamp: new Date().toLocaleTimeString() }]);
    }
  };

  return (
    <GlassCard 
      title="📅 Maintenance Planner (Drop Area)"
      className={`min-h-200 ${isOver ? 'border-dashed-active' : 'border-dashed'}`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      {droppedTasks.length === 0 ? (
        <div className="text-center p-lg text-muted">
          Kéo đề xuất từ AI Sidebar vào đây để tạo Task bảo trì
        </div>
      ) : (
        <div className="flex-col gap-md">
          {droppedTasks.map((task, idx) => (
            <div key={idx} className="p-sm bg-white rounded-md ai-chat-bubble border-l-success w-full">
              <div className="justify-between mb-xs">
                <strong className="text-14">{task.title}</strong>
                <StatusBadge status="APPROVED" />
              </div>
              <div className="text-12 text-muted">
                Tạo lúc: {task.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};
