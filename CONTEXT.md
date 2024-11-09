Thorbis Implementation Guide
Project Setup
Directory Structure
Copythorbis/
├── app/
│   ├── admin/
│   │   ├── layout.tsx                # Admin layout
│   │   ├── page.tsx                  # Dashboard
│   │   ├── themes/
│   │   │   ├── page.tsx              # Theme management
│   │   │   └── loading.tsx           # Loading state
│   │   └── settings/
│   │       └── page.tsx              # Admin settings
│   ├── api/
│   │   └── themes/
│   │       ├── route.ts              # Main theme endpoints
│   │       ├── check/route.ts        # Update checker
│   │       └── rebuild/route.ts      # Trigger rebuilds
│   └── layout.tsx                    # Main site layout
├── components/
│   ├── ui/                           # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── dialog.tsx
│   ├── admin/                        # Admin components
│   │   ├── theme-manager.tsx
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   └── site/                         # Site components
├── lib/
│   ├── theme/
│   │   ├── manager.ts                # Theme management
│   │   ├── validator.ts              # Theme validation
│   │   └── types.ts                  # Theme types
│   ├── utils/
│   │   ├── github.ts                 # GitHub utilities
│   │   └── fs.ts                     # File system utilities
│   └── constants.ts                  # System constants
├── themes/
│   └── active/                       # Active theme location
├── store/
│   └── theme.ts                      # Theme state management
└── types/
    └── theme.ts                      # TypeScript definitions
Core Type Definitions
typescriptCopy// types/theme.ts
export interface ThemeConfig {
  name: string;
  version: string;
  author: string;
  description: string;
  repository: string;
  license: string;
  components: {
    layouts: {
      default: string;
      [key: string]: string;
    };
    source: string;
  };
  styles: {
    source: string;
    entry: string;
    tailwind?: {
      config: string;
    };
  };
  hooks?: {
    beforeRender?: string;
    afterRender?: string;
  };
}

export interface ThemeMetadata {
  url: string;
  branch: string;
  installedAt: string;
  lastChecked: string;
  hash: string;
  config: ThemeConfig;
}

export interface ThemeUpdateStatus {
  hasUpdate: boolean;
  currentHash: string;
  latestHash: string;
  lastChecked: string;
}
Theme Manager Implementation
typescriptCopy// lib/theme/manager.ts
import { simpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs-extra';
import { ThemeConfig, ThemeMetadata, ThemeUpdateStatus } from '@/types/theme';

export class ThemeManager {
  private themesDir: string;
  private activeThemeDir: string;
  private configPath: string;
  private git: SimpleGit;

  constructor() {
    this.themesDir = path.join(process.cwd(), 'themes');
    this.activeThemeDir = path.join(this.themesDir, 'active');
    this.configPath = path.join(process.cwd(), '.theme-meta.json');
    this.git = simpleGit();
  }

  // Core theme management methods
  async fetchTheme(repoUrl: string, branch: string = 'main'): Promise<ThemeMetadata> {
    // Implementation
  }

  async validateTheme(): Promise<void> {
    // Implementation
  }

  async checkForUpdates(): Promise<ThemeUpdateStatus> {
    // Implementation
  }

  async getActiveTheme(): Promise<ThemeMetadata | null> {
    // Implementation
  }

  private async saveMetadata(metadata: ThemeMetadata): Promise<void> {
    // Implementation
  }
}
State Management
typescriptCopy// store/theme.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ThemeMetadata, ThemeUpdateStatus } from '@/types/theme';

interface ThemeStore {
  // Theme state
  activeTheme: ThemeMetadata | null;
  updateStatus: ThemeUpdateStatus | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setActiveTheme: (theme: ThemeMetadata | null) => void;
  setUpdateStatus: (status: ThemeUpdateStatus | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  installTheme: (url: string, branch?: string) => Promise<void>;
  checkForUpdates: () => Promise<void>;
  updateTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Implementation
    }),
    {
      name: 'thorbis-theme-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
API Routes
typescriptCopy// app/api/themes/route.ts
import { NextResponse } from 'next/server';
import { ThemeManager } from '@/lib/theme/manager';
import { validateThemeUrl } from '@/lib/utils/github';

export async function GET() {
  const manager = new ThemeManager();
  try {
    const theme = await manager.getActiveTheme();
    return NextResponse.json(theme);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch theme' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const manager = new ThemeManager();
  try {
    const { url, branch = 'main' } = await request.json();
    
    // Validate URL
    if (!validateThemeUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid theme URL' },
        { status: 400 }
      );
    }

    const theme = await manager.fetchTheme(url, branch);
    return NextResponse.json(theme);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to install theme' },
      { status: 500 }
    );
  }
}
Admin UI Components
typescriptCopy// components/admin/theme-manager.tsx
'use client';

import { useState } from 'react';
import { useThemeStore } from '@/store/theme';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

export function ThemeManager() {
  const [url, setUrl] = useState('');
  const { toast } = useToast();
  const {
    activeTheme,
    updateStatus,
    isLoading,
    error,
    installTheme,
    checkForUpdates,
  } = useThemeStore();

  const handleInstall = async () => {
    try {
      await installTheme(url);
      toast({
        title: 'Theme installed',
        description: 'Theme has been successfully installed',
      });
      setUrl('');
    } catch (error) {
      toast({
        title: 'Installation failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    // Implementation
  );
}
Module Federation Configuration
javascriptCopy// next.config.js
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'thorbis',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {
          theme: `theme@${process.env.THEME_URL || 'http://localhost:3001'}/_next/static/chunks/remoteEntry.js`,
        },
        exposes: {
          './Button': './components/ui/button.tsx',
          './Card': './components/ui/card.tsx',
          './Dialog': './components/ui/dialog.tsx',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: false,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: false,
          },
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
Development Utilities
typescriptCopy// lib/utils/github.ts
export const validateThemeUrl = (url: string): boolean => {
  const githubPattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
  return githubPattern.test(url);
};

export const parseGithubUrl = (url: string) => {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2] };
};

// lib/utils/fs.ts
import fs from 'fs-extra';
import path from 'path';

export const ensureDirectoryExists = async (dir: string): Promise<void> => {
  await fs.ensureDir(dir);
};

export const clearDirectory = async (dir: string): Promise<void> => {
  await fs.emptyDir(dir);
};

export const writeJsonFile = async (
  filePath: string,
  data: any,
  options?: fs.WriteOptions
): Promise<void> => {
  await fs.writeJSON(filePath, data, { spaces: 2, ...options });
};
Theme Development Guidelines

Required Files:

Copytheme-repo/
├── thorbis-theme.json      # Required
├── components/
│   └── layouts/
│       └── default.tsx     # Required
├── styles/
│   └── index.css          # Required
└── package.json           # Required

Component Guidelines:


Use TypeScript
Import core components from Thorbis
Follow naming conventions
Include prop types
Add JSDoc comments


Style Guidelines:


Use Tailwind CSS
Follow BEM naming convention for custom classes
Use CSS variables for theming
Include responsive designs


Theme Configuration Schema:

jsonCopy{
  "name": "required",
  "version": "required",
  "author": "required",
  "description": "required",
  "components": {
    "layouts": {
      "default": "required-path"
    },
    "source": "required-path"
  },
  "styles": {
    "source": "required-path",
    "entry": "required-path"
  }
}
Build Process
Development
bashCopy# Start development server
npm run dev

# System will:
1. Check for active theme
2. Set up hot reloading
3. Enable Module Federation
4. Watch for theme changes
Production
bashCopy# Build for production
npm run build

# System will:
1. Validate active theme
2. Optimize theme assets
3. Generate static pages
4. Create production bundle