'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, Layers, Rss, Newspaper } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export interface CardFlipProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    catimage: string | null;
  };
  postCount: number;
}

export default function CardFlip({ category, postCount }: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group relative h-[360px] w-full max-w-[320px] [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          'relative h-full w-full',
          '[transform-style:preserve-3d]',
          'transition-all duration-700',
          isFlipped
            ? '[transform:rotateY(180deg)]'
            : '[transform:rotateY(0deg)]',
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(0deg)] [backface-visibility:hidden]',
            'overflow-hidden rounded-2xl',
            'bg-gradient-to-br from-white via-slate-50 to-slate-100',
            'dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800',
            'border border-slate-200 dark:border-zinc-800/50',
            'shadow-lg dark:shadow-xl',
            'transition-all duration-700',
            'group-hover:shadow-2xl dark:group-hover:shadow-2xl',
            'group-hover:border-primary/20 dark:group-hover:border-primary/30',
            isFlipped ? 'opacity-0' : 'opacity-100',
            'flex flex-col justify-between'
          )}
        >
<div className="relative h-2/3 w-full">
            <Image
              src={
                category.catimage
                  ? category.catimage.startsWith("http")
                    ? category.catimage
                    : `/${category.catimage}`
                  : "/hero-blog.jpg"
              }
              alt={category.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="p-5">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {category.name}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              View Details
            </p>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(180deg)] [backface-visibility:hidden]',
            'rounded-2xl p-6',
            'bg-gradient-to-br from-white via-slate-50 to-slate-100',
            'dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800',
            'border border-slate-200 dark:border-zinc-800',
            'shadow-xl',
            'flex flex-col justify-between',
            !isFlipped ? 'opacity-0' : 'opacity-100',
          )}
        >
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary">About {category.name}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {category.description || 'No description available.'}
            </p>
          </div>
          <div className="border-t border-border pt-4 mt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Newspaper className="h-5 w-5 text-primary" />
              <span className="font-medium text-muted-foreground">Posts:</span>
              <span className="font-bold text-foreground">{postCount}</span>
            </div>
            <div
              className="group/start relative flex items-center justify-between rounded-lg p-2.5 transition-all duration-300 bg-gradient-to-r from-slate-100 via-slate-100 to-slate-100 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800 hover:from-primary/10 hover:via-primary/5 hover:to-transparent dark:hover:from-primary/20 dark:hover:via-primary/10 dark:hover:to-transparent hover:scale-[1.02] hover:cursor-pointer hover:border-primary/20 border border-transparent"
            >
              <span className="group-hover/start:text-primary text-sm font-semibold text-zinc-900 transition-colors duration-300 dark:text-white">
                Explore Category
              </span>
              <div className="group/icon relative">
                <ArrowRight className="text-primary relative z-10 h-4 w-4 transition-all duration-300 group-hover/start:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
