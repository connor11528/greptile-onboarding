import {useState, useCallback, useEffect} from 'react';

export interface ApiLogEntry {
    timestamp: string;
    endpoint: string;
    method: string;
    status?: number;
    message: string;
}

export function useApiLogs() {
    const [loading, setLoading] = useState(false)
    const [logs, setLogs] = useState<ApiLogEntry[]>([]);

    const addLog = useCallback((logEntry: ApiLogEntry) => {
        setLogs(prevLogs => [...prevLogs, logEntry]);
    }, []);

    useEffect( ()=>{
        const fetchLogs = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/logs')
                const data = await response.json();
                console.log({data})
                setLogs(data)
            } catch (e) {

            } finally {
                setLoading(false)
            }

        }
        fetchLogs();
    }, [])

    return { logs, loading, addLog,};
}