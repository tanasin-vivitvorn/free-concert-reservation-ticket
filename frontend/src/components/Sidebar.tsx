import React from 'react';

interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  footer?: React.ReactNode;
  title?: string; // Add this prop if you want to customize the title easily
}

export const Sidebar: React.FC<SidebarProps> = ({ items, footer, title = 'User' }) => (
  <aside className="w-64 bg-white flex flex-col py-8 px-8 border-r border-[#f0f0f0] min-h-screen">
    {/* Title */}
    <h2 className="text-3xl font-bold mb-14">{title}</h2>
    {/* Nav */}
    <nav className="flex-1 flex flex-col gap-2">
      {items.map((item) => (
        <button
          key={item.label}
          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base transition
            ${item.active
              ? 'bg-[#f5f8fa] text-[#222] font-semibold'
              : 'hover:bg-[#f5f8fa] text-[#222]'
            }`}
          onClick={item.onClick}
        >
          {item.icon && <span className="text-lg">{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </nav>
    {footer && <div className="mt-auto">{footer}</div>}
  </aside>
);
