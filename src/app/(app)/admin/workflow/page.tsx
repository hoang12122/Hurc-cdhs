import { Metadata } from 'next';
import { WorkflowBuilder } from './_components/workflow-builder';

export const metadata: Metadata = {
    title: 'No-Code Workflow Builder - HURC CDHS',
};

export default function WorkflowPage() {
    return (
        <div className="container mx-auto py-8 h-[calc(100vh-100px)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline text-primary">No-Code Workflow Builder</h1>
                <p className="text-muted-foreground mt-2">
                    Kéo thả để thiết kế và tùy chỉnh các quy trình nghiệp vụ (Ví dụ: Luồng bảo trì DNF).
                </p>
            </div>
            
            <div className="flex-1 bg-white border rounded-xl shadow-sm overflow-hidden">
                <WorkflowBuilder />
            </div>
        </div>
    );
}
