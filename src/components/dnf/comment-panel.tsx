
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { type Comment } from "@/lib/constants";
import { addComment } from "@/lib/actions/comment.actions";
import { useLanguage } from "@/contexts/language-context";
import { Send, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const commentSchema = z.object({
  content: z.string().min(1, "Bình luận không được để trống."),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentPanelProps {
  entityId: string;
  initialComments: Comment[];
}

const translations = {
    vi: {
        title: "Thảo luận & Ghi chú",
        description: "Trao đổi thông tin, đặt câu hỏi và ghi lại các ghi chú liên quan.",
        sendButton: "Gửi",
        commentPlaceholder: "Nhập bình luận của bạn...",
        addSuccess: "Đã gửi bình luận.",
        error: "Lỗi",
        noComments: "Chưa có bình luận nào. Hãy là người đầu tiên bắt đầu cuộc thảo luận!",
    },
    en: {
        title: "Discussion & Notes",
        description: "Exchange information, ask questions, and record relevant notes.",
        sendButton: "Send",
        commentPlaceholder: "Enter your comment...",
        addSuccess: "Comment sent.",
        error: "Error",
        noComments: "No comments yet. Be the first to start the discussion!",
    },
};

export function CommentPanel({ entityId, initialComments }: CommentPanelProps) {
  const { toast } = useToast();
  const { locale } = useLanguage();
  const t = translations[locale];
  const [comments, setComments] = React.useState<Comment[]>(initialComments);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  React.useEffect(() => {
    // Scroll to bottom when new comments are added
    if (scrollAreaRef.current) {
        const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableViewport) {
            scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
        }
    }
  }, [comments]);

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = async (data: CommentFormValues) => {
    try {
      const newComment = await addComment(entityId, data.content);
      setComments(prev => [...prev, newComment]);
      form.reset();
      toast({ title: t.addSuccess });
    } catch (e) {
      toast({ variant: 'destructive', title: t.error, description: String(e) });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary"/>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-[400px]">
        <ScrollArea className="flex-grow pr-4 -mr-4 mb-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">{t.noComments}</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{comment.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{comment.senderName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2 pt-2 border-t">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Textarea
                      placeholder={t.commentPlaceholder}
                      {...field}
                      rows={1}
                      className="min-h-[40px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={form.formState.isSubmitting}>
              <Send className="h-4 w-4" />
              <span className="sr-only">{t.sendButton}</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
