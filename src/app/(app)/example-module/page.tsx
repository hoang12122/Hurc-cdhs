import { ExampleModulePanel } from '@/components/example-module/example-module-panel';

export default function ExampleModulePage() {
  return (
    <div className="container mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Example Module</h1>
        <p className="text-sm text-muted-foreground">
          Mẫu module dùng cho Developer Guide: page shell, UI component, custom hook, Server Action và Service Layer.
        </p>
      </div>
      <ExampleModulePanel />
    </div>
  );
}
