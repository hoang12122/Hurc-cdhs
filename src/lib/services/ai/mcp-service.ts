import { internalLogSystemEvent as logSystemEvent } from '../log-service';

export interface McpTool {
    name: string;
    description: string;
    inputSchema: any;
}

export interface McpTraceNode {
    id: string;
    type: 'input' | 'thought' | 'tool_call' | 'tool_output' | 'error' | 'final_answer';
    label: string;
    content: string;
    timestamp: number;
    parentId?: string;
}

class McpService {
    private baseUrl: string = process.env.GRAPUCO_MCP_URL || 'https://api.grapuco.com/mcp';
    private apiKey: string = process.env.GRAPUCO_API_KEY || '';
    private traces: McpTraceNode[] = [];

    /**
     * Fetch available tools from Grapuco
     */
    async listTools(): Promise<McpTool[]> {
        try {
            const response = await fetch(`${this.baseUrl}/tools`, {
                headers: {
                    'X-Api-Key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`MCP Error: ${response.statusText}`);
            const data = await response.json();
            return data.tools || [];
        } catch (error: any) {
            console.error("[MCP SERVICE] List tools failed:", error.message);
            return [];
        }
    }

    /**
     * Call a specific tool on the MCP server
     */
    async callTool(name: string, args: any, parentId?: string): Promise<any> {
        const traceId = Math.random().toString(36).substring(7);
        this.addTrace({
            id: traceId,
            type: 'tool_call',
            label: `Calling: ${name}`,
            content: JSON.stringify(args, null, 2),
            timestamp: Date.now(),
            parentId
        });

        try {
            const response = await fetch(`${this.baseUrl}/tools/call`, {
                method: 'POST',
                headers: {
                    'X-Api-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, arguments: args })
            });

            if (!response.ok) throw new Error(`MCP Tool Call Error: ${response.statusText}`);
            const data = await response.json();

            this.addTrace({
                id: `${traceId}-output`,
                type: 'tool_output',
                label: `Output: ${name}`,
                content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content, null, 2),
                timestamp: Date.now(),
                parentId: traceId
            });

            return data.content;
        } catch (error: any) {
            this.addTrace({
                id: `${traceId}-error`,
                type: 'error',
                label: `Error: ${name}`,
                content: error.message,
                timestamp: Date.now(),
                parentId: traceId
            });
            throw error;
        }
    }

    /**
     * Trace management for visualization
     */
    private addTrace(node: McpTraceNode) {
        this.traces.push(node);
        // Keep only last 100 traces
        if (this.traces.length > 100) this.traces.shift();
    }

    getTraces(): McpTraceNode[] {
        return this.traces;
    }

    clearTraces() {
        this.traces = [];
    }

    /**
     * Add manual trace (e.g. from agent reasoning)
     */
    addManualTrace(label: string, content: string, type: McpTraceNode['type'] = 'thought', parentId?: string) {
        this.addTrace({
            id: Math.random().toString(36).substring(7),
            type,
            label,
            content,
            timestamp: Date.now(),
            parentId
        });
    }
}

// Singleton instance
export const mcpService = new McpService();
