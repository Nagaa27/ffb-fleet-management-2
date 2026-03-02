// src/atoms/__tests__/Select.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Select } from '../Select';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

describe('Select', () => {
  it('renders options', () => {
    render(<Select options={options} />);
    const select = screen.getByTestId('select');
    expect(select).toBeInTheDocument();
    expect(select.querySelectorAll('option')).toHaveLength(3);
  });

  it('renders placeholder', () => {
    render(<Select options={options} placeholder="Choose..." defaultValue="" />);
    const select = screen.getByTestId('select');
    const firstOption = select.querySelector('option');
    expect(firstOption).toHaveTextContent('Choose...');
  });

  it('shows error message', () => {
    render(<Select options={options} error="Select is required" />);
    expect(screen.getByTestId('select-error')).toHaveTextContent('Select is required');
  });

  it('does not show error when not provided', () => {
    render(<Select options={options} />);
    expect(screen.queryByTestId('select-error')).toBeNull();
  });
});
