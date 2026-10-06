import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, vi, expect } from 'vitest';
import { Accordion } from './compound-component';

describe('Accordion Component (TDD + Triple AAA Pattern)', () => {
  test('should expand content when trigger is clicked and collapse when clicked again', async () => {
    // 1. ARRANGE
    const user = userEvent.setup();
    render(
      <Accordion>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    const trigger = screen.getByRole('button', { name: /Section 1/i });

    // 2. ACT
    // Initially content is hidden
    const initialContent = screen.queryByText('Content 1');
    
    // First click to expand
    await user.click(trigger);
    const expandedContent = screen.getByText('Content 1');
    
    // Second click to collapse
    await user.click(trigger);
    const finalContent = screen.queryByText('Content 1');

    // 3. ASSERT (All expects placed exclusively at the end of the test)
    expect(initialContent).not.toBeInTheDocument();
    expect(expandedContent).toBeInTheDocument();
    expect(finalContent).not.toBeInTheDocument();
  });
});
