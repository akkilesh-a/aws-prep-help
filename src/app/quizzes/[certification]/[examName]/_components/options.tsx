"use client";

import { Check, X } from "lucide-react";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OptionsProps {
  options: string[];
  correctAnswer: string | string[];
  selectedOptions: string[];
  handleSetSelectedOptions: (options: string[]) => void;
  isSubmitted: boolean;
}

export const Options = ({
  options,
  correctAnswer,
  selectedOptions,
  handleSetSelectedOptions,
  isSubmitted,
}: OptionsProps) => {
  const isMultipleChoice = Array.isArray(correctAnswer);

  const handleOptionChange = (option: string) => {
    if (isMultipleChoice) {
      const newSelection = selectedOptions.includes(option)
        ? selectedOptions.filter((opt) => opt !== option)
        : [...selectedOptions, option];
      handleSetSelectedOptions(newSelection);
    } else {
      handleSetSelectedOptions([option]);
    }
  };

  const isOptionCorrect = (option: string) => {
    if (isMultipleChoice) {
      return correctAnswer.includes(option);
    }
    return option === correctAnswer;
  };

  const isOptionSelected = (option: string) => {
    return selectedOptions.includes(option);
  };

  return (
    <div className="space-y-2">
      {isMultipleChoice ? (
        options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={isOptionSelected(option)}
              onCheckedChange={() => !isSubmitted && handleOptionChange(option)}
              disabled={isSubmitted}
            />
            <Label htmlFor={option} className="flex-1">
              {option}
            </Label>
            {isSubmitted &&
              (isOptionCorrect(option) ? (
                <Check className="text-green-500" />
              ) : isOptionSelected(option) ? (
                <X className="text-red-500" />
              ) : null)}
          </div>
        ))
      ) : (
        <RadioGroup
          value={selectedOptions[0]}
          onValueChange={(value) => !isSubmitted && handleOptionChange(value)}
          disabled={isSubmitted}
        >
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="flex-1">
                {option}
              </Label>
              {isSubmitted &&
                (isOptionCorrect(option) ? (
                  <Check className="text-green-500" />
                ) : isOptionSelected(option) ? (
                  <X className="text-red-500" />
                ) : null)}
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};
