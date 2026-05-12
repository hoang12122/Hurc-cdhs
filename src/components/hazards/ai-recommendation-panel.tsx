"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Check, X } from "lucide-react";

interface Recommendation {
  id: string;
  item: string;
  source: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export function AiRecommendationPanel({ defectDescription }: { defectDescription: string }) {
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([
    { id: '1', item: 'Kiểm tra Vòng bi', source: 'Rule Base', status: 'pending' },
    { id: '2', item: 'Kiểm tra Trục bánh xe', source: 'Rule Base', status: 'pending' },
    { id: '3', item: 'Lấy vật tư dự phòng: BRAKE-PAD-X (Tồn kho: 4)', source: 'Knowledge Graph', status: 'pending' }
  ]);

  const handleAction = (id: string, action: 'accepted' | 'rejected') => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, status: action } : rec)
    );
    // TODO: Send feedback to backend API for Rule improvement
    console.log(`[AI FEEDBACK] Recommendation ${id} was ${action}.`);
  };

  const pendingCount = recommendations.filter(r => r.status === 'pending').length;

  if (recommendations.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900 mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center text-blue-700 dark:text-blue-400">
          <Lightbulb className="w-4 h-4 mr-2" />
          AI Đề xuất kiểm tra liên quan (GraphRAG)
          {pendingCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
              {pendingCount} đề xuất mới
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground mb-2">
          Dựa trên lỗi &quot;{defectDescription || "Bánh xe bị mòn"}&quot;, hệ thống Đồ thị tri thức đề xuất kiểm tra chuỗi thiết bị sau:
        </p>
        <div className="space-y-2">
          {recommendations.map(rec => (
            <div 
              key={rec.id} 
              className={`flex items-center justify-between p-2 rounded border text-sm transition-colors
                ${rec.status === 'accepted' ? 'bg-green-50 border-green-200 dark:bg-green-950/30' : ''}
                ${rec.status === 'rejected' ? 'bg-gray-50 border-gray-200 opacity-50' : 'bg-white border-blue-100 dark:bg-gray-900'}
              `}
            >
              <div className="flex flex-col">
                <span className={rec.status === 'rejected' ? 'line-through text-gray-500' : ''}>
                  {rec.item}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 font-semibold">
                  Nguồn: {rec.source}
                </span>
              </div>
              
              {rec.status === 'pending' && (
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:bg-green-100" onClick={() => handleAction(rec.id, 'accepted')}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600 hover:bg-red-100" onClick={() => handleAction(rec.id, 'rejected')}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {rec.status === 'accepted' && <Badge variant="outline" className="bg-green-100 text-green-800 border-none">Đã chọn</Badge>}
              {rec.status === 'rejected' && <Badge variant="outline" className="bg-gray-200 text-gray-600 border-none">Đã bỏ qua</Badge>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
