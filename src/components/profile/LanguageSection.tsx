import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/badge';
import { X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  selectedLanguages: string[];
  onLanguagesChange: (newLanguages: string[]) => Promise<void>;
  initialLanguages?: string[];
}

const LanguageSection = ({ initialLanguages = [] }: Props) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(initialLanguages);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  const [lastFetch, setLastFetch] = useState(Date.now());

  const updateLanguages = useCallback(async (newLanguages: string[]) => {
    try {
      const response = await fetch('/api/profile/languages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ languages: newLanguages })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update languages');
      }
      
      const data = await response.json();
      setSelectedLanguages(data.languages || newLanguages);
      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update languages';
      console.error('Failed to update languages:', errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    if (initialLanguages.length > 0 || Date.now() - lastFetch < 5000) return;
    
    const controller = new AbortController();
    const fetchLanguages = async () => {
      try {
        setLastFetch(Date.now());
        const response = await fetch('/api/profile/languages', {
          signal: controller.signal
        });
        const data = await response.json();
        if (data.languages) {
          setSelectedLanguages(data.languages);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        toast.error('Failed to load languages');
      }
    };

    fetchLanguages();
    return () => controller.abort();
  }, [initialLanguages, lastFetch]);

  const handleLanguageSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newLanguage) {
      const languageExists = selectedLanguages.some(
        lang => lang.toLowerCase() === newLanguage.toLowerCase()
      );
  
      if (languageExists) {
        toast.error('This language has already been added');
        return;
      }
  
      try {
        await toast.promise(
          updateLanguages([...selectedLanguages, newLanguage]),
          {
            loading: 'Adding language...',
            success: `Added ${newLanguage}`,
            error: 'Failed to add language'
          }
        );
        setNewLanguage('');
        setIsAddingLanguage(false);
      } catch (error) {
        console.error('Failed to add language:', error);
      }
    }
  }, [selectedLanguages, newLanguage, updateLanguages]);

  const removeLanguage = async (language: string) => {
    try {
      await toast.promise(
        updateLanguages(selectedLanguages.filter(lang => lang !== language)),
        {
          loading: 'Removing language...',
          success: `Removed ${language}`,
          error: 'Failed to remove language'
        }
      );
    } catch (error) {
      console.error('Failed to remove language:', error);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Languages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedLanguages.map((language) => (
              <Badge
                key={language}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {language}
                <button
                  onClick={() => removeLanguage(language)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {!isAddingLanguage && (
              <button
                onClick={() => setIsAddingLanguage(true)}
                className="flex items-center gap-1 px-3 py-1 border rounded-full hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                Add language
              </button>
            )}
          </div>

          {isAddingLanguage && (
            <form onSubmit={handleLanguageSubmit} className="flex gap-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Enter language (e.g., English, Spanish)"
                className="flex-1 p-2 border rounded-md"
                autoFocus
              />
              <button
                type="submit"
                disabled={!newLanguage}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingLanguage(false);
                  setNewLanguage('');
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(LanguageSection);