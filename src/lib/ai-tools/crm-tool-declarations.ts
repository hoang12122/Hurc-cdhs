import type { ChatCompletionTool } from '../services/nemoclaw-types';

type JsonSchemaType = 'object' | 'string' | 'number' | 'boolean' | 'array';

interface JsonSchema {
  type: JsonSchemaType;
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
}

export interface ToolFunctionDeclaration {
  name: string;
  description: string;
  parameters: JsonSchema;
}

const technicalTools: ToolFunctionDeclaration[] = [
  {
    name: 'claw_ls',
    description: '[READ-ONLY TECHNICAL SKILL] Liệt kê tệp và thư mục trong phạm vi dự án đã được kiểm soát.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Đường dẫn thư mục tương đối trong dự án.' },
      },
    },
  },
  {
    name: 'claw_read',
    description: '[READ-ONLY TECHNICAL SKILL] Đọc tệp văn bản không nhạy cảm trong phạm vi dự án.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Đường dẫn tệp tương đối trong dự án.' },
      },
      required: ['path'],
    },
  },
  {
    name: 'claw_grep',
    description: '[READ-ONLY TECHNICAL SKILL] Tìm chuỗi literal trong tệp văn bản; không thực thi regex hoặc lệnh.',
    parameters: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Chuỗi literal cần tìm.' },
        path: { type: 'string', description: 'Thư mục tương đối; mặc định là thư mục gốc dự án.' },
      },
      required: ['pattern'],
    },
  },
];

const operationsTools: ToolFunctionDeclaration[] = [
  {
    name: 'get_open_dnfs',
    description: '[READ-ONLY OPS SKILL] Tra cứu danh sách sự cố DNF đang mở.',
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Giới hạn kết quả, tối đa 50.' },
      },
    },
  },
  {
    name: 'get_system_health',
    description: '[READ-ONLY OPS SKILL] Kiểm tra sức khỏe tổng quát của hệ thống.',
    parameters: { type: 'object', properties: {} },
  },
];

export const crmToolDeclarations: ToolFunctionDeclaration[] = [
  ...technicalTools,
  ...operationsTools,
];

export const openAiToolDeclarations: ChatCompletionTool[] = crmToolDeclarations.map(tool => ({
  type: 'function',
  function: {
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  },
}));
