"use client";

import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Save, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Bắt đầu: Sự cố được tạo (DNF)' },
    position: { x: 250, y: 25 },
    style: { background: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '8px', padding: '10px', fontWeight: 'bold' }
  },
  {
    id: '2',
    data: { label: 'L1: Kỹ thuật viên kiểm tra' },
    position: { x: 250, y: 125 },
    style: { background: '#eff6ff', border: '2px solid #93c5fd', borderRadius: '8px', padding: '10px' }
  },
  {
    id: '3',
    data: { label: 'L2: Chuyên gia Phê duyệt' },
    position: { x: 250, y: 225 },
    style: { background: '#fef3c7', border: '2px solid #fcd34d', borderRadius: '8px', padding: '10px' }
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Hoàn thành / Đóng DNF' },
    position: { x: 250, y: 325 },
    style: { background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '8px', padding: '10px', fontWeight: 'bold' }
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
];

export function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onSave = () => {
    // Trong thực tế sẽ gọi API lưu vào bảng WorkflowTemplate và WorkflowNode
    console.log("Nodes:", nodes);
    console.log("Edges:", edges);
    toast({
        title: "Đã lưu quy trình",
        description: "Luồng bảo trì đã được cập nhật thành công (Mock)."
    });
  };

  const addNode = () => {
    const newNode: Node = {
        id: `node_${nodes.length + 1}`,
        data: { label: 'Bước xử lý mới' },
        position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
        style: { background: '#fff', border: '2px solid #e2e8f0', borderRadius: '8px', padding: '10px' }
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
        
        <Panel position="top-right" className="flex gap-2">
            <Button onClick={addNode} variant="secondary" className="shadow-md">
                <PlusCircle className="w-4 h-4 mr-2" /> Thêm Node
            </Button>
            <Button onClick={onSave} className="shadow-md bg-indigo-600 hover:bg-indigo-700">
                <Save className="w-4 h-4 mr-2" /> Lưu Quy trình
            </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
