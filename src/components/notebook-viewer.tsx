"use client";

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Loader2, FileCode2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NotebookViewerProps {
    notebookData: any; // Parsed JSON of the .ipynb file
    title?: string;
}

export function NotebookViewer({ notebookData, title = "Open Notebook" }: NotebookViewerProps) {
    if (!notebookData || !notebookData.cells) {
        return (
            <div className="flex items-center justify-center h-64 border rounded-xl bg-slate-50">
                <p className="text-slate-500">Dữ liệu Sổ tay không hợp lệ hoặc đang tải...</p>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-5xl mx-auto shadow-xl border-slate-200">
            <CardHeader className="bg-slate-900 text-white rounded-t-xl p-4 flex flex-row items-center gap-3">
                <FileCode2 className="h-6 w-6 text-indigo-400" />
                <CardTitle className="text-lg font-bold tracking-wide">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white space-y-6">
                {notebookData.cells.map((cell: any, index: number) => {
                    const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;

                    if (cell.cell_type === 'markdown') {
                        return (
                            <div key={index} className="prose prose-slate max-w-none">
                                <ReactMarkdown>{source}</ReactMarkdown>
                            </div>
                        );
                    }

                    if (cell.cell_type === 'code') {
                        return (
                            <div key={index} className="rounded-lg overflow-hidden border border-slate-700 shadow-sm">
                                <div className="bg-slate-800 text-slate-400 text-xs px-4 py-2 border-b border-slate-700 flex justify-between">
                                    <span>Python (In [{cell.execution_count || ' '}])</span>
                                </div>
                                <SyntaxHighlighter
                                    language="python"
                                    style={vscDarkPlus}
                                    customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.875rem' }}
                                >
                                    {source}
                                </SyntaxHighlighter>
                                
                                {/* Render outputs if any */}
                                {cell.outputs && cell.outputs.length > 0 && (
                                    <div className="bg-slate-50 border-t border-slate-200 p-4 font-mono text-sm text-slate-800 whitespace-pre-wrap">
                                        {cell.outputs.map((out: any, outIdx: number) => {
                                            if (out.output_type === 'stream') {
                                                return <span key={outIdx}>{Array.isArray(out.text) ? out.text.join('') : out.text}</span>;
                                            }
                                            if (out.output_type === 'execute_result' || out.output_type === 'display_data') {
                                                const textPlain = out.data['text/plain'];
                                                return <span key={outIdx}>{Array.isArray(textPlain) ? textPlain.join('') : textPlain}</span>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return null;
                })}
            </CardContent>
        </Card>
    );
}
