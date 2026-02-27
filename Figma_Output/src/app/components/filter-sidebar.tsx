import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { X, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export interface Filters {
  priceMin: string;
  priceMax: string;
  moveInDate: string;
  moveOutDate: string;
  distanceFromCampus: string;
  roommateGender: string;
  housingTypes: string[];
  bedrooms: string;
}

interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export function FilterSidebar({ filters, onFiltersChange, onClose, isOpen }: FilterSidebarProps) {
  const handlePriceMinChange = (value: string) => {
    onFiltersChange({ ...filters, priceMin: value });
  };

  const handlePriceMaxChange = (value: string) => {
    onFiltersChange({ ...filters, priceMax: value });
  };

  const handleMoveInDateChange = (value: string) => {
    onFiltersChange({ ...filters, moveInDate: value });
  };

  const handleMoveOutDateChange = (value: string) => {
    onFiltersChange({ ...filters, moveOutDate: value });
  };

  const handleDistanceChange = (value: string) => {
    onFiltersChange({ ...filters, distanceFromCampus: value });
  };

  const handleGenderChange = (value: string) => {
    onFiltersChange({ ...filters, roommateGender: value });
  };

  const handleHousingTypeToggle = (type: string) => {
    const newTypes = filters.housingTypes.includes(type)
      ? filters.housingTypes.filter((t) => t !== type)
      : [...filters.housingTypes, type];
    onFiltersChange({ ...filters, housingTypes: newTypes });
  };

  const handleBedroomsChange = (value: string) => {
    onFiltersChange({ ...filters, bedrooms: value });
  };

  const handleResetFilters = () => {
    onFiltersChange({
      priceMin: '',
      priceMax: '',
      moveInDate: '',
      moveOutDate: '',
      distanceFromCampus: '',
      roommateGender: '',
      housingTypes: [],
      bedrooms: '',
    });
  };

  const hasActiveFilters = 
    filters.priceMin ||
    filters.priceMax ||
    filters.moveInDate ||
    filters.moveOutDate ||
    filters.distanceFromCampus ||
    filters.roommateGender ||
    filters.housingTypes.length > 0 ||
    filters.bedrooms;

  const housingTypeOptions = ['Apartment', 'House', 'Dorm', 'Studio'];
  const bedroomOptions = [
    { value: 'studio', label: 'Studio' },
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3+', label: '3+ Bedrooms' },
  ];

  return (
    <div className={`h-full ${isOpen !== undefined ? (isOpen ? 'block' : 'hidden md:block') : 'block'}`}>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden">
              <X className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Price Range</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceMin}
                onChange={(e) => handlePriceMinChange(e.target.value)}
                className={filters.priceMin ? 'border-[#F76902]' : ''}
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceMax}
                onChange={(e) => handlePriceMaxChange(e.target.value)}
                className={filters.priceMax ? 'border-[#F76902]' : ''}
              />
            </div>
          </div>

          {/* Move-in Date */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Move-in Date</Label>
            <Input
              type="date"
              value={filters.moveInDate}
              onChange={(e) => handleMoveInDateChange(e.target.value)}
              className={filters.moveInDate ? 'border-[#F76902]' : ''}
            />
          </div>

          {/* Move-out Date */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Move-out Date</Label>
            <Input
              type="date"
              value={filters.moveOutDate}
              onChange={(e) => handleMoveOutDateChange(e.target.value)}
              className={filters.moveOutDate ? 'border-[#F76902]' : ''}
            />
          </div>

          {/* Distance from Campus */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Distance from Campus</Label>
            <Select value={filters.distanceFromCampus} onValueChange={handleDistanceChange}>
              <SelectTrigger className={filters.distanceFromCampus ? 'border-[#F76902]' : ''}>
                <SelectValue placeholder="Any distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walking">Walking distance</SelectItem>
                <SelectItem value="<1">&lt;1 mile</SelectItem>
                <SelectItem value="1-3">1-3 miles</SelectItem>
                <SelectItem value="3+">3+ miles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Roommate Gender Preference */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Roommate Gender Preference</Label>
            <Select value={filters.roommateGender} onValueChange={handleGenderChange}>
              <SelectTrigger className={filters.roommateGender ? 'border-[#F76902]' : ''}>
                <SelectValue placeholder="No preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="no-preference">No preference</SelectItem>
                <SelectItem value="all-gender">All-gender</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Housing Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Housing Type</Label>
            <div className="space-y-2">
              {housingTypeOptions.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filters.housingTypes.includes(type)}
                    onCheckedChange={() => handleHousingTypeToggle(type)}
                    className={filters.housingTypes.includes(type) ? 'border-[#F76902] data-[state=checked]:bg-[#F76902]' : ''}
                  />
                  <label
                    htmlFor={type}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Number of Bedrooms */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Number of Bedrooms</Label>
            <Select value={filters.bedrooms} onValueChange={handleBedroomsChange}>
              <SelectTrigger className={filters.bedrooms ? 'border-[#F76902]' : ''}>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {bedroomOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="w-full border-[#F76902] text-[#F76902] hover:bg-[#F76902] hover:text-white"
            >
              Reset All Filters
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
