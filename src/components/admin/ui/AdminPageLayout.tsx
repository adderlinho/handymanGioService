import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AdminPageLayoutProps {
  title: string;
  subtitle?: string;
  backButton?: {
    label: string;
    href: string;
  };
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
  children: ReactNode;
}

export default function AdminPageLayout({ 
  title, 
  subtitle, 
  backButton, 
  primaryAction, 
  children 
}: AdminPageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8 text-base md:text-[17px] text-slate-900">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          {backButton && (
            <Link 
              to={backButton.href}
              className="inline-flex items-center gap-2 text-sm md:text-base text-slate-600 hover:text-slate-900 mb-4 font-medium"
            >
              ← {backButton.label}
            </Link>
          )}
          
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-1">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm md:text-base text-slate-600">
                  {subtitle}
                </p>
              )}
            </div>
            
            {primaryAction && (
              <div className="flex-shrink-0">
                <button
                  onClick={primaryAction.onClick}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {primaryAction.icon && <span className="mr-2">{primaryAction.icon}</span>}
                  {primaryAction.label}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}