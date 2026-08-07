# Design Systems & Tokens Architecture Reference

## 1. Design Token Hierarchy

Structure design tokens into 3 clear layers:

1. **Primitive Tokens**: Core raw values (`colors.blue.500`, `spacing.4`).
2. **Semantic Tokens**: Contextual design decisions (`color.background.primary`, `color.text.danger`).
3. **Component Tokens**: Specific component values (`button.primary.bg`).

---

## 2. TailwindCSS & Class Variance Authority (CVA)

Use `cva` for component variants combined with `clsx` and `tailwind-merge`:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500',
        outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
```
