// src/atoms/__tests__/Button.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByTestId('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByTestId('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByTestId('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>No click</Button>);
    fireEvent.click(screen.getByTestId('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders with correct type attribute', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByTestId('button')).toHaveAttribute('type', 'submit');
  });

  it('defaults to button type', () => {
    render(<Button>Default</Button>);
    expect(screen.getByTestId('button')).toHaveAttribute('type', 'button');
  });
});
