import React, { createContext, useContext, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// 1. Context
interface AccordionContextType {
  openItem: string | null;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion sub-components must be rendered within an Accordion parent.');
  }
  return context;
}

// 2. Root Component
export interface AccordionProps {
  children: React.ReactNode;
  defaultOpenId?: string;
  className?: string;
}

export function Accordion({ children, defaultOpenId = null, className = '' }: AccordionProps) {
  const [openItem, setOpenItem] = useState<string | null>(defaultOpenId);

  const toggleItem = (id: string) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ openItem, toggleItem }}>
      <div className={`divide-y divide-gray-200 rounded-lg border border-gray-200 ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// 3. Item Component
interface ItemContextType {
  id: string;
}
const ItemContext = createContext<ItemContextType | null>(null);

export function AccordionItem({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <ItemContext.Provider value={{ id }}>
      <div className="group">{children}</div>
    </ItemContext.Provider>
  );
}

// 4. Trigger Component
export function AccordionTrigger({ children }: { children: React.ReactNode }) {
  const { openItem, toggleItem } = useAccordionContext();
  const { id } = useContext(ItemContext) || {};

  if (!id) throw new Error('AccordionTrigger must be used inside AccordionItem');

  const isOpen = openItem === id;

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={() => toggleItem(id)}
      className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {children}
      <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </button>
  );
}

// 5. Content Component
export function AccordionContent({ children }: { children: React.ReactNode }) {
  const { openItem } = useAccordionContext();
  const { id } = useContext(ItemContext) || {};

  if (!id) throw new Error('AccordionContent must be used inside AccordionItem');

  const isOpen = openItem === id;

  if (!isOpen) return null;

  return <div className="p-4 pt-0 text-sm text-gray-600">{children}</div>;
}

// Attach compound sub-components
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
