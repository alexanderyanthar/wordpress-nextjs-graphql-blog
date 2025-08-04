'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  X, 
  SortAsc,
  SortDesc
} from "lucide-react";

// Types for filter data
export interface FilterCategory {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  count?: number;
}

export interface FilterTag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface FilterState {
  searchTerm: string;
  selectedCategories: number[];
  selectedTags: string[];
  sortBy: 'date_desc' | 'date_asc' | 'title_asc' | 'title_desc';
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface PostFiltersProps {
  categories: FilterCategory[];
  tags: FilterTag[];
  filterState: FilterState;
  onFilterChange: (filterState: FilterState) => void;
  onClearFilters: () => void;
  loading?: boolean;
  showAdvanced?: boolean;
}

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest First', icon: SortDesc },
  { value: 'date_asc', label: 'Oldest First', icon: SortAsc },
  { value: 'title_asc', label: 'Title A-Z', icon: SortAsc },
  { value: 'title_desc', label: 'Title Z-A', icon: SortDesc },
] as const;

export function PostFilters({
  categories,
  tags,
  filterState,
  onFilterChange,
  onClearFilters,
  loading = false,
}: PostFiltersProps) {

  // Helper functions
  const updateFilter = (updates: Partial<FilterState>) => {
    onFilterChange({ ...filterState, ...updates });
  };

  const toggleCategory = (categoryId: number) => {
    const newCategories = filterState.selectedCategories.includes(categoryId)
      ? filterState.selectedCategories.filter(id => id !== categoryId)
      : [...filterState.selectedCategories, categoryId];
    
    updateFilter({ selectedCategories: newCategories });
  };

  const toggleTag = (tagId: string) => {
    const newTags = filterState.selectedTags.includes(tagId)
      ? filterState.selectedTags.filter(id => id !== tagId)
      : [...filterState.selectedTags, tagId];
    
    updateFilter({ selectedTags: newTags });
  };

  const clearCategory = (categoryId: number) => {
    updateFilter({
      selectedCategories: filterState.selectedCategories.filter(id => id !== categoryId)
    });
  };

  const clearTag = (tagId: string) => {
    updateFilter({
      selectedTags: filterState.selectedTags.filter(id => id !== tagId)
    });
  };

  // Get active filter count
  const activeFilterCount = 
    (filterState.searchTerm ? 1 : 0) +
    filterState.selectedCategories.length +
    filterState.selectedTags.length +
    (filterState.dateRange ? 1 : 0);

  // Get selected items for display
  const selectedCategoryNames = categories
    .filter(cat => filterState.selectedCategories.includes(cat.databaseId))
    .map(cat => cat.name);

  const selectedTagNames = tags
    .filter(tag => filterState.selectedTags.includes(tag.id))
    .map(tag => tag.name);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Posts
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={filterState.searchTerm}
              onChange={(e) => updateFilter({ searchTerm: e.target.value })}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between" disabled={loading}>
                {SORT_OPTIONS.find(opt => opt.value === filterState.sortBy)?.label || 'Select Sort'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SORT_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => updateFilter({ sortBy: option.value })}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Categories</label>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between" disabled={loading}>
                Categories ({filterState.selectedCategories.length} selected)
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filterState.selectedCategories.includes(category.databaseId)}
                    onCheckedChange={() => toggleCategory(category.databaseId)}
                    disabled={loading}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                  >
                    {category.name}
                    {category.count !== undefined && (
                      <span className="text-muted-foreground ml-1">({category.count})</span>
                    )}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Tag Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between" disabled={loading}>
                Tags ({filterState.selectedTags.length} selected)
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={filterState.selectedTags.includes(tag.id)}
                    onCheckedChange={() => toggleTag(tag.id)}
                    disabled={loading}
                  />
                  <label
                    htmlFor={`tag-${tag.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                  >
                    {tag.name}
                    {tag.count !== undefined && (
                      <span className="text-muted-foreground ml-1">({tag.count})</span>
                    )}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Active Filters</label>
            <div className="flex flex-wrap gap-2">
              {filterState.searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: &quot;{filterState.searchTerm}&quot;
                  <button
                    onClick={() => updateFilter({ searchTerm: '' })}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    disabled={loading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {selectedCategoryNames.map((name, index) => (
                <Badge key={`cat-${index}`} variant="secondary" className="gap-1">
                  {name}
                  <button
                    onClick={() => clearCategory(filterState.selectedCategories[selectedCategoryNames.indexOf(name)])}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    disabled={loading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {selectedTagNames.map((name, index) => (
                <Badge key={`tag-${index}`} variant="outline" className="gap-1">
                  {name}
                  <button
                    onClick={() => clearTag(filterState.selectedTags[selectedTagNames.indexOf(name)])}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    disabled={loading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}