import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Label } from '@/components/ui/label';

export interface CustomRadioCheckboxProps {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  /** Controlled selected values */
  selected: string[];
  /** Callback when selection changes */
  onChange: (selected: string[]) => void;
}

export const CustomRadioCheckbox: React.FC<CustomRadioCheckboxProps> = ({
  name,
  label,
  options,
  required = false,
  selected,
  onChange,
}) => {
  console.log('name', name);
  console.log('label', label);
  console.log('options', options);
  const toggle = (value: string, checked: boolean) => {
    const next = checked
      ? [...selected, value]
      : selected.filter(v => v !== value);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {options.map(opt => {
        const id = `${name}-${opt.replace(/\s+/g, '').toLowerCase()}`;
        return (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox.Root
              id={id}
              checked={selected.includes(opt)}
              onCheckedChange={c => toggle(opt, c === true)}
              className="
                group relative w-[16px] h-[16px] rounded-full border
                focus:outline-none focus:ring-0
                data-[state=checked]:bg-white data-[state=checked]:border-white
                data-[state=checked]:ring-1 data-[state=checked]:ring-black
                border-black
              "
            >
              <Checkbox.Indicator className="flex items-center justify-center w-full h-full">
                <div className="w-[9px] h-[9px] bg-black rounded-full opacity-0 group-data-[state=checked]:opacity-100 transition-opacity" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <Label htmlFor={id} className="text-sm cursor-pointer select-none">
              {opt}
            </Label>
          </div>
        );
      })}
    </div>
  );
};
