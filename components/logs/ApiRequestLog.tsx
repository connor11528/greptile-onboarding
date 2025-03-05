// components/logs/ApiRequestLog.tsx
import React, { useEffect, useState } from 'react';
import {ApiLogEntry} from "@/hooks/useApiLogs";

export interface ApiRequest {
    id: string;
    userId: string;
    endpoint: string;
    method: string;
    status: number;
    created_at: string;
    request_body?: string;
    response?: string;
}

interface ApiRequestLogProps {
    userId: string;
    logs: ApiLogEntry[];
    loading: boolean
}

export default function ApiRequestLog({ userId, loading, logs }: ApiRequestLogProps) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    const formatJson = (jsonString: string | undefined) => {
        if (!jsonString) return '';
        try {
            return JSON.stringify(JSON.parse(jsonString), null, 2);
        } catch (e) {
            return jsonString;
        }
    };

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'text-green-600';
        if (status >= 400 && status < 500) return 'text-orange-600';
        if (status >= 500) return 'text-red-600';
        return 'text-gray-600';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-4 mt-8">
                <h2 className="text-lg font-semibold mb-4">API Request History</h2>
                <div className="flex justify-center py-6">
                    <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-4 mt-8">
            <h2 className="text-lg font-semibold mb-4">API Request History</h2>

            {logs && logs.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                    No API requests found for your account yet
                </div>
            ) : (
                <div className="space-y-4">
                    {logs && logs.length && logs.map(request => (
                        <div key={request.id} className="border border-gray-200 rounded-md overflow-hidden">
                            <div
                                className="flex items-center justify-between bg-gray-50 p-3 cursor-pointer"
                                onClick={() => toggleExpand(request.id)}
                            >
                                <div className="flex items-center space-x-4">
                  <span className={`font-mono font-medium ${getStatusColor(request.status)}`}>
                    {request.method}
                  </span>
                                    <span className="font-mono text-gray-700 text-sm">
                    {request.endpoint}
                  </span>
                                </div>
                                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                                    <span className="text-gray-500 text-sm">
                    {formatDate(request.created_at)}
                  </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-5 w-5 text-gray-400 transform transition-transform ${expanded[request.id] ? 'rotate-180' : ''}`}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            {expanded[request.id] && (
                                <div className="p-4 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-medium mb-2">Request Body</h3>
                                            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                        {formatJson(request.request_body) || 'No request body'}
                      </pre>
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-2">Response</h3>
                                            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                        {formatJson(request.response) || 'No response body'}
                      </pre>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}