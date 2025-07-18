"use client";

import React, { Suspense } from 'react';
import type { User } from '@/lib/supabase';
import { ProfileSettingsContent } from './ProfileSettingsContent';

function SettingsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Skeleton for Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        <div className="md:col-span-2 h-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
      </div>
      {/* Skeleton for API Key Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mt-8">
        <div className="md:col-span-1 h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        <div className="md:col-span-2 h-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
      </div>
       {/* Skeleton for Logout Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mt-8">
        <div className="md:col-span-1 h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        <div className="md:col-span-2 h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export const ProfileSettingsView = ({ user, logout }: { user: User | null; logout: () => Promise<void> }) => {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <ProfileSettingsContent user={user} logout={logout} />
    </Suspense>
  );
};
