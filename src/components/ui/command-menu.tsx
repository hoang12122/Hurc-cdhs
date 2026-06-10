"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Monitor, Moon, Sun, Laptop, FileText, Settings, ShieldCheck, Box, Zap, BoxSelect, Cpu } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { sound } from "@/lib/sounds";
import "@/styles/cmdk.css";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => {
          if (!open) sound.playPop(); // Play pop sound when opening
          return !open;
        });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    sound.playClick(); // Play click sound when executing command
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <div className="w-full max-w-sm flex items-center justify-between px-3 py-1.5 text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onClick={() => setOpen(true)}>
        <span className="flex items-center gap-2"><Search className="w-4 h-4" /> Tìm kiếm hệ thống...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-50 dark:bg-slate-900 px-1.5 font-mono text-[10px] font-medium text-slate-500 dark:text-slate-400 opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu" className="cmdk-dialog">
        <Command.Input placeholder="Bạn muốn điều hướng đi đâu?..." />
        <Command.List>
          <Command.Empty>Không tìm thấy kết quả phù hợp.</Command.Empty>

          <Command.Group heading="Điều hướng (Hệ thống)">
            <Command.Item onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <Monitor /> Bảng điều khiển (Dashboard)
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/asset-360"))}>
              <BoxSelect /> Tài sản 360 & Digital Twin
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/ai-lab"))}>
              <Cpu /> Phòng thí nghiệm AI (AI Lab)
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/tasks"))}>
              <ShieldCheck /> Công việc bảo trì
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Giao diện (Theme)">
            <Command.Item onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun /> Chế độ Sáng (Light)
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon /> Chế độ Tối (Dark)
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop /> Theo Hệ thống (System)
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
  );
}
