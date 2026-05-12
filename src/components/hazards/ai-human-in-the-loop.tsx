"use client";

import * as React from "react";
import { Check, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export function AiHumanInTheLoop({ 
  proposal, 
  onApprove, 
  onReject 
}: { 
  proposal: string, 
  onApprove: (content: string) => void,
  onReject: (reason: string) => void
}) {
  const [content, setContent] = React.useState(proposal);
  const [reason, setReason] = React.useState("");
  const [isRejected, setIsRejected] = React.useState(false);

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-700">
          <ShieldAlert className="w-4 h-4" />
          Xác nhận đề xuất từ AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="ai-content-edit" className="text-xs font-medium text-slate-500">
            Nội dung AI đề xuất (có thể chỉnh sửa):
          </label>
          <Textarea 
            id="ai-content-edit"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="text-sm bg-white"
            placeholder="Chỉnh sửa nội dung đề xuất của AI..."
            title="Nội dung AI đề xuất"
          />
        </div>

        {isRejected && (
          <div className="space-y-2">
            <label htmlFor="reject-reason" className="text-xs font-medium text-red-600">
              Lý do từ chối:
            </label>
            <Textarea 
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="text-sm bg-white border-red-200"
              placeholder="Vui lòng nhập lý do bác bỏ đề xuất này..."
              title="Lý do từ chối"
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          {!isRejected ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-200"
                onClick={() => setIsRejected(true)}
              >
                <X className="w-4 h-4 mr-1" /> Từ chối
              </Button>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onApprove(content)}
              >
                <Check className="w-4 h-4 mr-1" /> Chấp nhận
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsRejected(false)}>Hủy</Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onReject(reason)}
                disabled={!reason}
              >
                Xác nhận từ chối
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
