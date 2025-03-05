import React, { useState } from 'react';
import { StepProps } from './types';
import {useApiLogs} from "@/hooks/useApiLogs";

export default function RepositoryIndexingStep({ userId, onComplete }: StepProps) {
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const {addLog} = useApiLogs();

    const sampleRepoData = {
        remote: "github",
        repository: "connor11528/nextjs-vector-search",
        branch: "main"
    };

    // todo: refactor to hook
    const indexSampleRepository = async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('/api/greptile/index', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sampleRepoData)
            });

            const data = await response.json();

            console.log({data})

            if (!response.ok) {
                throw new Error(data.error || 'Failed to index repository');
            }

            setIsSuccess(true);
            setLoading(false);

            // todo: needs a data provider..
            addLog(data.newLog)
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Failed to index sample repository. Please try again.');
            setLoading(false);
        }
    };

    const handleNext = () => {
        onComplete({
            repositoryIndexingViewed: true
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold mb-6">Index Your Repository</h1>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                    Greptile uses AI to index your codebase, making it searchable and enabling intelligent code suggestions.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">How to Index Your Repository</h2>
                <p className="text-gray-700">
                    To index your repository, send a POST request to our API endpoint with your repository information.
                </p>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
          <pre>{`curl --request POST \\
  --url https://api.greptile.com/v2/repositories \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --header 'X-GitHub-Token: <api-key>' \\
  --data '{
    "remote": "github",
    "repository": "owner/repository",
    "branch": "main",
    "reload": true,
    "notify": true
  }'`}</pre>
                </div>

                <div className="space-y-2 mt-6">
                    <h3 className="font-medium">Request Parameters:</h3>
                    <ul className="space-y-2 list-disc list-inside text-gray-700">
                        <li><span className="font-semibold">remote</span>: The Git provider ("github" or "gitlab")</li>
                        <li><span className="font-semibold">repository</span>: Repository identifier in "owner/repository" format</li>
                        <li><span className="font-semibold">branch</span>: Branch name to index</li>
                        <li><span className="font-semibold">reload</span>: If false, won't reprocess if previously successful (optional, default: true)</li>
                        <li><span className="font-semibold">notify</span>: Whether to notify you upon completion (optional, default: true)</li>
                    </ul>
                </div>

                <div className="space-y-2 mt-4">
                    <h3 className="font-medium">Required Headers:</h3>
                    <ul className="space-y-2 list-disc list-inside text-gray-700">
                        <li><span className="font-semibold">Authorization</span>: Your Greptile API token in the format "Bearer &lt;token&gt;"</li>
                        <li><span className="font-semibold">X-GitHub-Token</span>: Your GitHub personal access token with repo scope</li>
                    </ul>
                </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
                <h3 className="font-semibold mb-4">Try It Now</h3>
                <p className="mb-4">Index the sample repository to see how it works!</p>

                {/*<div className="bg-white p-3 rounded border border-gray-300 mb-4">*/}
                {/*    <div className="grid grid-cols-3 gap-2 text-sm">*/}
                {/*        <div>*/}
                {/*            <span className="font-medium">Remote:</span> {sampleRepo.remote}*/}
                {/*        </div>*/}
                {/*        <div>*/}
                {/*            <span className="font-medium">Repository:</span> {sampleRepo.repository}*/}
                {/*        </div>*/}
                {/*        <div>*/}
                {/*            <span className="font-medium">Branch:</span> {sampleRepo.branch}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {isSuccess ? (
                    <div className="bg-green-50 text-green-800 p-4 rounded mb-4">
                        <p className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Success! Sample repository has been indexed.
                        </p>
                        <p className="text-sm mt-2">
                            You can check its status at: <span className="font-mono">https://api.greptile.com/v2/repositories/status/demo-repository</span>
                        </p>
                    </div>
                ) : (
                    <button
                        onClick={indexSampleRepository}
                        disabled={loading}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 flex items-center justify-center w-full sm:w-auto"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Indexing...
                            </>
                        ) : 'Index Sample Repository'}
                    </button>
                )}

                {errorMessage && (
                    <div className="bg-red-50 text-red-800 p-4 rounded mt-4">
                        <p>{errorMessage}</p>
                    </div>
                )}
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}