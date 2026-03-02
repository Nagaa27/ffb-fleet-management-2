// src/molecules/__tests__/EmptyState.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No data found" />);
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="Empty" description="Try adding some items" />);
    expect(screen.getByText('Try adding some items')).toBeInTheDocument();
  });

  it('renders action slot', () => {
    render(
      <EmptyState title="Empty" action={<button>Add item</button>} />,
    );
    expect(screen.getByText('Add item')).toBeInTheDocument();
  });
});
