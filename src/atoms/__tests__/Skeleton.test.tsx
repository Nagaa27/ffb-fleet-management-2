// src/atoms/__tests__/Skeleton.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
  it('renders a single skeleton element by default', () => {
    render(<Skeleton />);
    const el = screen.getByTestId('skeleton');
    expect(el).toBeInTheDocument();
  });

  it('applies default width and height', () => {
    render(<Skeleton />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '100%', height: '1rem' });
  });

  it('accepts custom width and height', () => {
    render(<Skeleton width="5rem" height="2rem" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '5rem', height: '2rem' });
  });

  it('renders circle variant', () => {
    render(<Skeleton variant="circle" width="3rem" height="3rem" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).toContain('circle');
  });

  it('renders multiple lines for text variant', () => {
    render(<Skeleton variant="text" lines={3} />);
    const container = screen.getByTestId('skeleton');
    // Container should have 3 child divs
    expect(container.children).toHaveLength(3);
  });

  it('renders last line at 60% width for multi-line text', () => {
    render(<Skeleton variant="text" lines={3} />);
    const container = screen.getByTestId('skeleton');
    const lastLine = container.children[2] as HTMLElement;
    expect(lastLine).toHaveStyle({ width: '60%' });
  });

  it('renders single line without container when lines=1', () => {
    render(<Skeleton variant="text" lines={1} />);
    const el = screen.getByTestId('skeleton');
    // Should be a single div, not a wrapper
    expect(el.children).toHaveLength(0);
  });

  it('applies custom className', () => {
    render(<Skeleton className="custom-class" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).toContain('custom-class');
  });
});
