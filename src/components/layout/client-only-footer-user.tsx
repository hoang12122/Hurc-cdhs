
"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from "@/contexts/auth-context";

export function ClientOnlyFooterUser() {
  const { locale } = useLanguage();
  const { user } = useAuth();

  if (!user) {
    return null; // Or a skeleton loader
  }

  const userDetails = {
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };

  return (
    <div className="mt-4 flex items-center gap-3 group-data-[collapsible=icon]:hidden">
        <Avatar className="h-10 w-10">
          <AvatarImage src={userDetails.avatarUrl} alt={locale === 'vi' ? 'Ảnh đại diện' : 'User avatar'} />
          <AvatarFallback>{userDetails.name ? userDetails.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{userDetails.name}</p>
          <p className="text-xs text-muted-foreground">{userDetails.email}</p>
        </div>
    </div>
  );
}
