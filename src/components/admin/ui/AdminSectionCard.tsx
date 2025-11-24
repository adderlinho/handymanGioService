import { ReactNode } from 'react';

interface AdminSectionCardProps {
  title?: string;
  children: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function AdminSectionCard({ title, children, action }: AdminSectionCardProps) {
  return (
    <section className="mb-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
        {title && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              {title}
            </h2>
            {action && (
              <button
                onClick={action.onClick}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {action.label}
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}