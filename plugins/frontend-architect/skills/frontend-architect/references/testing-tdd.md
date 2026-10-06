# TDD & Testing Standard Reference (Triple AAA Pattern)

## 1. Test-Driven Development (TDD) Workflow

Always follow the 3-step TDD cycle:

1. **RED**: Write a failing unit/component test that defines the expected behavior, component contract, and accessible roles.
2. **GREEN**: Implement the minimal component or function code necessary to pass the test.
3. **REFRACTOR**: Clean up component structure, styling, or performance without breaking existing assertions.

---

## 2. Triple AAA (Arrange, Act, Assert) Pattern Standard

Every unit, component, or hook test MUST strictly follow the **Triple AAA Pattern**:

```typescript
test('should perform specific action when triggered', async () => {
  // 1. ARRANGE: Render component, mock data/hooks, setup user event
  const user = userEvent.setup();
  const handleSelect = vi.fn();
  render(<Select options={['Option 1', 'Option 2']} onSelect={handleSelect} />);

  // 2. ACT: Interact with the component (clicks, keypresses, inputs)
  const trigger = screen.getByRole('combobox');
  await user.click(trigger);
  const option = screen.getByRole('option', { name: 'Option 1' });
  await user.click(option);

  // 3. ASSERT: All assertions (expect) MUST be grouped exclusively at the END
  expect(handleSelect).toHaveBeenCalledTimes(1);
  expect(handleSelect).toHaveBeenCalledWith('Option 1');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});
```

### Strict Rule:
- DO NOT mix `expect(...)` inside the `ACT` block.
- Place ALL assertions (`expect`) together in the `ASSERT` block at the bottom of the test function.
