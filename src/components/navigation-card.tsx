'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/registry/new-york/ui/card'
import { Icons } from '@/components/icons'
import type { NavigationSubItem } from '@/types/navigation'
import { SiteFavicon } from '@/components/site-favicon'
import type { SiteConfig } from '@/types/site'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NavigationCardProps {
  item: NavigationSubItem
  siteConfig?: SiteConfig
}

export function NavigationCard({ item, siteConfig }: NavigationCardProps) {
  // 获取链接打开方式，默认为新窗口
  const linkTarget = siteConfig?.navigation?.linkTarget || '_blank'

  // 页内锚点跳转：href 以 # 开头时，平滑滚动到对应元素而非打开外链
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.href && item.href.startsWith('#')) {
      const targetId = item.href.slice(1)
      const el = document.getElementById(targetId)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // 是否为页内锚点链接（如 #g2 指向「智能AI」分类）
  const isAnchor = !!item.href && item.href.startsWith('#')

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
            {isAnchor ? (
              <a
                href={item.href}
                onClick={handleAnchorClick}
                className="block h-full"
              >
                <CardHeader>
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-11 sm:h-11">
                      <SiteFavicon
                        title={item.title}
                        icon={item.icon}
                        useDefaultIcon={item.useDefaultIcon}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      <CardTitle className="text-sm sm:text-base">{item.title}</CardTitle>
                      {item.description && (
                        <CardDescription className="text-xs sm:text-sm line-clamp-1">
                          {item.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </a>
            ) : (
              <Link
                href={item.href}
                target={linkTarget}
                rel="noopener noreferrer"
                className="block h-full"
              >
                <CardHeader>
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-11 sm:h-11">
                      <SiteFavicon
                        title={item.title}
                        icon={item.icon}
                        useDefaultIcon={item.useDefaultIcon}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      <CardTitle className="text-sm sm:text-base">{item.title}</CardTitle>
                      {item.description && (
                        <CardDescription className="text-xs sm:text-sm line-clamp-1">
                          {item.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Link>
            )}
          </Card>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="center"
          sideOffset={8}
          className="max-w-[280px] text-xs sm:text-sm"
        >
          <p>{item.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
