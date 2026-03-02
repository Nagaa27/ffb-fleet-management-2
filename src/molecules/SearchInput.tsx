// src/molecules/SearchInput.tsx
// Molecule: Search input with icon.

import { Search } from 'lucide-react';
import { Input } from '../atoms';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Cari...',
}: SearchInputProps) {
  return (
    <div className={styles['search-input']} data-testid="search-input">
      <Search size={18} className={styles['search-icon']} />
      <Input
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
        placeholder={placeholder}
      />
    </div>
  );
}
