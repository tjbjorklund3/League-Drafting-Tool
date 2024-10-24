import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, ExternalLink } from 'lucide-react';

function generateRandomId(length: number): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

export default function DraftHome() {
  const [blueTeam, setBlueTeam] = React.useState('');
  const [redTeam, setRedTeam] = React.useState('');
  const [numberOfGames, setNumberOfGames] = React.useState(1);
  const [fearlessDraft, setFearlessDraft] = React.useState(false);
  const [draftId, setDraftId] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleStartDraft = () => {
    if (!blueTeam || !redTeam) {
      alert('Please enter both team names');
      return;
    }

    const newDraftId = generateRandomId(8);
    const blueCode = generateRandomId(5);
    const redCode = generateRandomId(5);

    setDraftId(newDraftId);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getDraftUrl = (viewType: string) => {
    return `${window.location.origin}/draft/${draftId}/${viewType}`;
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create Draft Room</h1>

        <div className="space-y-6 bg-gray-800 p-6 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Blue Team Name</label>
              <input
                type="text"
                value={blueTeam}
                onChange={(e) => setBlueTeam(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter blue team name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Red Team Name</label>
              <input
                type="text"
                value={redTeam}
                onChange={(e) => setRedTeam(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter red team name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Number of Games</label>
              <select
                value={numberOfGames}
                onChange={(e) => setNumberOfGames(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value={1}>Best of 1</option>
                <option value={3}>Best of 3</option>
                <option value={5}>Best of 5</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="fearlessDraft"
                checked={fearlessDraft}
                onChange={(e) => setFearlessDraft(e.target.checked)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded"
              />
              <label htmlFor="fearlessDraft" className="ml-2 block text-sm">
                Enable Fearless Draft (champions can only be picked once in the series)
              </label>
            </div>
          </div>

          {!draftId ? (
            <button
              onClick={handleStartDraft}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded font-medium transition-colors"
            >
              Start Draft
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-700 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Blue Team Controller:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(getDraftUrl('blue'))}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <span className="text-sm">Copy Link</span>
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => openInNewTab(getDraftUrl('blue'))}
                      className="flex items-center gap-2 text-green-400 hover:text-green-300 ml-4"
                    >
                      <span className="text-sm">Open</span>
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Red Team Controller:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(getDraftUrl('red'))}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <span className="text-sm">Copy Link</span>
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => openInNewTab(getDraftUrl('red'))}
                      className="flex items-center gap-2 text-green-400 hover:text-green-300 ml-4"
                    >
                      <span className="text-sm">Open</span>
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Spectator View:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(getDraftUrl('spectator'))}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <span className="text-sm">Copy Link</span>
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => openInNewTab(getDraftUrl('spectator'))}
                      className="flex items-center gap-2 text-green-400 hover:text-green-300 ml-4"
                    >
                      <span className="text-sm">Open</span>
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/draft/${draftId}/spectator`)}
                className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 rounded font-medium transition-colors"
              >
                Open Spectator View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}