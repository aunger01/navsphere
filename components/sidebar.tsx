'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/registry/new-york/ui/button'
import { ScrollArea } from '@/registry/new-york/ui/scroll-area'
import type { NavigationData, NavigationItem } from '@/types/navigation'
import type { SiteConfig } from '@/types/site'
import * as LucideIcons from 'lucide-react'
import { ChevronDown, ChevronRight, X } from 'lucide-react'

// 父级分组：把 63 个扁平分类归并到少量父级，左侧菜单形成二级结构（父级 → 分类）
// 分类标题点击 = 定位到右侧对应区块（还原旧静态站 index.html 左侧菜单的锚点跳转行为）
// 父级分组沿用旧静态站 index.html 左侧 #main-menu 的分类（含顶级入口常用推荐/智能AI）
const GROUP_ORDER = [
  '常用推荐',
  '智能AI',
  '导航搜索',
  '影视阅读',
  '游戏聚合',
  '软件聚合',
  '工具聚合',
  '网盘资源',
  '邮箱短信',
  '代码聚合',
  '办公设计',
  '公共服务',
]

// 父级分组图标（取自旧站 #main-menu 的 emoji）
const GROUP_ICON: Record<string, string> = {
  '常用推荐': '⭐️',
  '智能AI': '🤖',
  '导航搜索': '🧭',
  '影视阅读': '🎬',
  '游戏聚合': '🎮',
  '软件聚合': '📱',
  '工具聚合': '🧰',
  '网盘资源': '💾',
  '邮箱短信': '📧',
  '代码聚合': '📟',
  '办公设计': '💻',
  '公共服务': '⚖️',
}

// 分类 id → 父级分组（未列出的归入「其他」）
const CATEGORY_GROUP: Record<string, string> = {
  // 常用推荐（旧站顶级入口）
  '1': '常用推荐',
  // 智能AI（旧站顶级入口，含 #第三方GPT）
  '56': '智能AI', '57': '智能AI',
  // 导航搜索
  '2': '导航搜索', '3': '导航搜索',
  // 影视阅读
  '4': '影视阅读', '5': '影视阅读', '6': '影视阅读', '7': '影视阅读',
  // 游戏聚合
  '8': '游戏聚合', '9': '游戏聚合', '10': '游戏聚合',
  // 软件聚合
  '11': '软件聚合', '12': '软件聚合', '13': '软件聚合', '14': '软件聚合', '15': '软件聚合', '16': '软件聚合', '17': '软件聚合', '18': '软件聚合', '19': '软件聚合', '20': '软件聚合',
  // 工具聚合
  '21': '工具聚合', '22': '工具聚合', '23': '工具聚合', '24': '工具聚合',
  // 网盘资源
  '25': '网盘资源', '26': '网盘资源', '27': '网盘资源',
  // 邮箱短信
  '28': '邮箱短信', '29': '邮箱短信', '30': '邮箱短信', '31': '邮箱短信',
  // 代码聚合
  '32': '代码聚合', '33': '代码聚合', '34': '代码聚合', '35': '代码聚合', '36': '代码聚合', '37': '代码聚合', '38': '代码聚合',
  // 办公设计
  '39': '办公设计', '40': '办公设计', '41': '办公设计', '42': '办公设计', '43': '办公设计', '44': '办公设计', '45': '办公设计', '46': '办公设计', '47': '办公设计', '48': '办公设计', '49': '办公设计', '50': '办公设计', '51': '办公设计', '52': '办公设计', '53': '办公设计', '54': '办公设计', '55': '办公设计',
  // 公共服务
  '58': '公共服务', '59': '公共服务', '60': '公共服务', '61': '公共服务', '62': '公共服务', '63': '公共服务',
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  navigationData: NavigationData
  siteInfo: SiteConfig
  onClose?: () => void
}

export function Sidebar({ className, navigationData, siteInfo, onClose }: SidebarProps) {
  const pathname = usePathname()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      onClose?.()
    }
  }

  // 分类标题点击：定位到右侧对应分类区块（还原旧版静态站锚点跳转行为）
  const handleCategoryClick = (categoryId: string) => {
    scrollToSection(categoryId)
  }

  const renderIcon = (iconName?: string) => {
    if (!iconName) return <LucideIcons.Folder className="h-4 w-4" />;

    if (iconName.startsWith('/') || iconName.startsWith('http')) {
      return (
        <Image
          src={iconName}
          alt="icon"
          width={16}
          height={16}
          className="h-4 w-4"
        />
      );
    }

    // Convert icon name to match Lucide icon component name
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Folder;
    return <IconComponent className="h-4 w-4" />;
  }

  // 父级分组展开状态：默认全部展开，让「分组」一眼可见
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const g: Record<string, boolean> = {}
    GROUP_ORDER.forEach(name => { g[name] = true })
    g['其他'] = true
    return g
  })
  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }))
  }

  // 子分类（如「导航聚合」下的「搜索引擎」）展开状态：默认收起，点击箭头展开后在左侧列出，点击仍定位右侧
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({})
  const toggleSubs = (categoryId: string) => {
    setExpandedSubs(prev => ({ ...prev, [categoryId]: !prev[categoryId] }))
  }

  // 构建二级结构：父级分组 → 该组下的分类列表（保持原顺序）
  const grouped = (() => {
    const buckets: Record<string, NavigationItem[]> = {}
    GROUP_ORDER.forEach(name => { buckets[name] = [] })
    buckets['其他'] = []
    navigationData.navigationItems.forEach(cat => {
      const g = CATEGORY_GROUP[cat.id] || '其他'
      if (!buckets[g]) buckets[g] = []
      buckets[g].push(cat)
    })
    return GROUP_ORDER.concat(buckets['其他'].length ? ['其他'] : [])
      .filter(name => buckets[name] && buckets[name].length > 0)
      .map(name => ({ name, categories: buckets[name] }))
  })()

  return (
    <div className={cn("w-64 bg-background", className)}>
      <div className="flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {siteInfo.appearance.logo ? (
            <Image
              src={siteInfo.appearance.logo}
              alt={siteInfo.basic.title}
              width={24}
              height={24}
              className="h-6 w-6"
            />
          ) : (
            <LucideIcons.Globe className="h-6 w-6" />
          )}
          <span>{siteInfo.basic.title}</span>
        </Link>

        {/* 移动模式下的关闭按钮 */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto sm:hidden"
            onClick={onClose}
            aria-label="关闭侧边栏"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-3.5rem)] px-3 py-2">
        <div className="space-y-0.5">
          {grouped.map((group, gi) => (
            <div
              key={group.name}
              className={cn("pb-1", gi > 0 && "mt-1 border-t border-border/60 pt-2")}
            >
              {/* 父级分组标题（可折叠） */}
              <Button
                variant="ghost"
                className="w-full justify-between px-2 py-1.5 text-sm font-semibold text-foreground/90 hover:bg-accent/60 rounded cursor-pointer"
                onClick={() => toggleGroup(group.name)}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-base leading-none">{GROUP_ICON[group.name] || '📁'}</span>
                  {group.name}
                </span>
                {expandedGroups[group.name] ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>

              {expandedGroups[group.name] && (
                <div className="mt-0.5 space-y-0.5">
                  {group.categories.map((category) => {
                    const hasSubs = category.subCategories && category.subCategories.length > 0
                    return (
                    <div key={category.id} className="py-0.5">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          className="flex-1 justify-start gap-2 font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          {renderIcon(category.icon)}
                          <span className="truncate">{category.title}</span>
                        </Button>

                        {hasSubs && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 hover:bg-transparent cursor-pointer"
                            onClick={() => toggleSubs(category.id)}
                            aria-label="展开子分类"
                          >
                            {expandedSubs[category.id] ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        )}
                      </div>

                      {hasSubs && expandedSubs[category.id] && (
                        <div className="mt-1 ml-4 space-y-1">
                          {(category.subCategories || []).map((subCategory) => (
                            <Button
                              key={subCategory.id}
                              variant="ghost"
                              className="w-full justify-start pl-6 text-sm text-muted-foreground/80 hover:text-foreground cursor-pointer"
                              onClick={() => {
                                scrollToSection(subCategory.id)
                                onClose?.()
                              }}
                            >
                              <span>{subCategory.title}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
