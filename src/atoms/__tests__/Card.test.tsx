// src/atoms/__tests__/Card.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Card content</p></Card>);
    expect(screen.getByTestId('card')).toHaveTextContent('Card content');
  });

  it('renders with custom className', () => {
    render(<Card className="custom-class">Content</Card>);
    expect(screen.getByTestId('card').className).toContain('custom-class');
  });
});
