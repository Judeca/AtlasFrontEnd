import { useState } from 'react';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  onSelect: (value: string) => void;
  activeValue: string;
  title: string;
  renderOption?: (option: DropdownOption) => React.ReactNode;
}

export function Dropdown({ 
  options, 
  onSelect, 
  activeValue, 
  renderOption, 
  title 
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const activeOption = options.find(opt => opt.value === activeValue) || options[0];
  
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title={title}
      >
        {renderOption ? renderOption(activeOption) : activeOption.label}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 min-w-[120px]">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${activeValue === option.value ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
            >
              {renderOption ? renderOption(option) : option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}