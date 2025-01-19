import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/badge';
import { X, Plus, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  name: string;
  subcategories: string[];
}

interface Props {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => Promise<void>;
}

const SkillsSection = ({ selectedSkills = [] as string[], onSkillsChange }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    if (categories.length > 0) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load categories';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkillClick = async () => {
    await fetchCategories();
    setIsAddingSkill(true);
  };

  const handleSkillSelect = useCallback(async (subcategory: string) => {
    if (subcategory === 'Something else') {
      setShowCustomInput(true);
      return;
    }
    
    if (!selectedSkills.includes(subcategory)) {
      try {
        await toast.promise(
          onSkillsChange([...selectedSkills, subcategory]),
          {
            loading: 'Adding skill...',
            success: `Added ${subcategory} to skills`,
            error: 'Failed to add skill'
          }
        );
        setIsAddingSkill(false);
        setSelectedCategory('');
      } catch (error) {
        console.error('Failed to add skill:', error);
      }
    }
  }, [selectedSkills, onSkillsChange]);

  const handleCustomSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill && !selectedSkills.includes(customSkill)) {
      try {
        await toast.promise(
          onSkillsChange([...selectedSkills, customSkill]),
          {
            loading: 'Adding custom skill...',
            success: `Added ${customSkill} to skills`,
            error: 'Failed to add custom skill'
          }
        );
        setCustomSkill('');
        setShowCustomInput(false);
        setIsAddingSkill(false);
        setSelectedCategory('');
      } catch (error) {
        console.error('Failed to add custom skill:', error);
      }
    }
  };

  const removeSkill = async (skill: string) => {
    try {
      await toast.promise(
        onSkillsChange(selectedSkills.filter(s => s !== skill)),
        {
          loading: 'Removing skill...',
          success: `Removed ${skill} from skills`,
          error: 'Failed to remove skill'
        }
      );
    } catch (error) {
      console.error('Failed to remove skill:', error);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {!isAddingSkill && (
              <button
                onClick={handleAddSkillClick}
                className="flex items-center gap-1 px-3 py-1 border rounded-full hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                Add skill
              </button>
            )}
          </div>

          {isAddingSkill && (
            <>
              {isLoading ? (
                <div className="animate-pulse p-4">Loading categories...</div>
              ) : (
                <div className="border rounded-lg p-4">
                  {selectedCategory ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <button
                          onClick={() => setSelectedCategory('')}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h3 className="font-medium">{selectedCategory}</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {categories
                          .find((cat) => cat.name === selectedCategory)
                          ?.subcategories.map((subcategory) => (
                            <button
                              key={subcategory}
                              onClick={() => handleSkillSelect(subcategory)}
                              disabled={selectedSkills.includes(subcategory)}
                              className={`p-2 rounded-md text-left ${
                                selectedSkills.includes(subcategory)
                                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                  : 'hover:bg-gray-50'
                              } border border-gray-200`}
                            >
                              {subcategory}
                            </button>
                          ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-medium mb-4">Select a category</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {categories.map((category) => (
                          <button
                            key={category.name}
                            onClick={() => setSelectedCategory(category.name)}
                            className="p-2 rounded-md text-left hover:bg-gray-50 border border-gray-200"
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {showCustomInput && (
                <form onSubmit={handleCustomSkillSubmit} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Enter custom skill"
                    autoFocus
                  />
                                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      disabled={!customSkill}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomSkill('');
                        setIsAddingSkill(false);
                        setSelectedCategory('');
                      }}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
};

export default memo(SkillsSection);