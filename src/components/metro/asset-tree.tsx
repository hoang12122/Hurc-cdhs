'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ChevronRight, 
    ChevronDown, 
    Database, 
    Activity, 
    ShieldAlert, 
    Settings,
    Layers,
    Plus,
    Box
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Asset {
    id: string;
    code: string;
    name: string;
    subsystem: string;
    criticality: string;
    children: Asset[];
}

interface AssetTreeProps {
    assets: Asset[];
    onSelect: (asset: Asset) => void;
}

export function AssetTree({ assets, onSelect }: AssetTreeProps) {
    const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

    const toggle = (id: string) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderAsset = (asset: Asset, depth = 0) => {
        const isExpanded = expanded[asset.id];
        const hasChildren = asset.children.length > 0;

        return (
            <div key={asset.id} className="select-none">
                <div 
                    className={cn(
                        "flex items-center group py-1.5 px-2 rounded-md transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50",
                        depth > 0 && "ml-4 border-l border-slate-200 dark:border-slate-800 pl-4"
                    )}
                    onClick={() => {
                        if (hasChildren) toggle(asset.id);
                        onSelect(asset);
                    }}
                >
                    <div className="flex items-center gap-2 flex-grow min-w-0">
                        {hasChildren ? (
                            isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        ) : (
                            <Box className="h-3.5 w-3.5 text-slate-300" />
                        )}
                        <Layers className={cn(
                            "h-4 w-4 shrink-0",
                            asset.criticality === 'High' ? "text-red-500" : "text-indigo-500"
                        )} />
                        <span className="text-sm font-medium truncate">{asset.name}</span>
                        <Badge variant="outline" className="text-[10px] h-4 py-0 font-mono text-muted-foreground bg-slate-50 border-slate-200">
                            {asset.code}
                        </Badge>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="mt-1">
                        {asset.children.map(child => renderAsset(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-1">
            {assets.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                    <Database className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Chưa có dữ liệu tài sản</p>
                </div>
            ) : (
                assets.map(asset => renderAsset(asset))
            )}
        </div>
    );
}
