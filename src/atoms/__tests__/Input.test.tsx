// src/atoms/__tests__/Input.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input error="Required field" />);
    expect(screen.getByTestId('input-error')).toHaveTextContent('Required field');
  });

  it('does not show error when not provided', () => {
    render(<Input />);
    expect(screen.queryByTestId('input-error')).toBeNull();
  });

  it('passes placeholder prop', () => {
    render(<Input placeholder="Enter text..." />);
    expect(screen.getByTestId('input')).toHaveAttribute('placeholder', 'Enter text...');
  });

  it('handles value changes', () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByTestId('input'), { target: { value: 'new value' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
