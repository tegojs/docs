import docsearch from '@docsearch/js'
import { usePageData } from '@rspress/core/runtime'
import { useEffect, useRef } from 'react'
import '@docsearch/css'
import { algoliaConfig } from '../../config/algolia.config'

interface AlgoliaSearchProps {
  containerId?: string
  assistantId?: string
}

// 翻译配置 - 完整的 DocSearch v4 翻译选项
const getTranslations = (isEnglish: boolean) => ({
  button: {
    buttonText: isEnglish ? 'Search' : '搜索',
    buttonAriaLabel: isEnglish ? 'Search' : '搜索',
  },
  modal: {
    searchBox: {
      resetButtonTitle: isEnglish ? 'Clear the query' : '清除查询',
      resetButtonAriaLabel: isEnglish ? 'Clear the query' : '清除查询',
      cancelButtonText: isEnglish ? 'Cancel' : '取消',
      cancelButtonAriaLabel: isEnglish ? 'Cancel' : '取消',
      // 兼容旧版本
      clearButtonTitle: isEnglish ? 'Clear the query' : '清除查询',
      clearButtonAriaLabel: isEnglish ? 'Clear the query' : '清除查询',
      closeButtonText: isEnglish ? 'Cancel' : '取消',
      closeButtonAriaLabel: isEnglish ? 'Cancel' : '取消',
    },
    startScreen: {
      recentSearchesTitle: isEnglish ? 'Recent' : '最近搜索',
      noRecentSearchesText: isEnglish ? 'No recent searches' : '没有最近搜索',
      saveRecentSearchButtonTitle: isEnglish ? 'Save this search' : '保存到最近搜索',
      removeRecentSearchButtonTitle: isEnglish
        ? 'Remove this search from history'
        : '从最近搜索中删除',
      favoriteSearchesTitle: isEnglish ? 'Favorite' : '收藏',
      removeFavoriteSearchButtonTitle: isEnglish
        ? 'Remove this search from favorites'
        : '从收藏中删除',
    },
    errorScreen: {
      titleText: isEnglish ? 'Unable to fetch results' : '无法获取结果',
      helpText: isEnglish
        ? 'You might want to check your network connection.'
        : '你可能需要检查网络连接。',
    },
    footer: {
      selectText: isEnglish ? 'to select' : '选择',
      selectKeyAriaLabel: isEnglish ? 'Enter key' : '回车键',
      navigateText: isEnglish ? 'to navigate' : '导航',
      navigateUpKeyAriaLabel: isEnglish ? 'Arrow up' : '上箭头',
      navigateDownKeyAriaLabel: isEnglish ? 'Arrow down' : '下箭头',
      closeText: isEnglish ? 'to close' : '关闭',
      closeKeyAriaLabel: isEnglish ? 'Escape key' : 'Esc 键',
      searchByText: isEnglish ? 'Search by' : '搜索由',
    },
    noResultsScreen: {
      noResultsText: isEnglish ? 'No results for' : '无法找到相关结果',
      suggestedQueryText: isEnglish ? 'Try searching for' : '尝试搜索',
      reportMissingResultsText: isEnglish
        ? 'Believe this query should return results?'
        : '认为该查询应该有结果？',
      reportMissingResultsLinkText: isEnglish ? 'Let us know.' : '反馈给我们。',
    },
  },
})

// 获取搜索框占位符文本
const getPlaceholder = (isEnglish: boolean) => (isEnglish ? 'Search docs...' : '输入关键词搜索...')

export function AlgoliaSearch({ containerId = 'docsearch', assistantId }: AlgoliaSearchProps) {
  const finalAssistantId = assistantId || algoliaConfig.assistantId
  const containerRef = useRef<HTMLDivElement>(null)
  const { page } = usePageData()
  const isEnglish = page.lang === 'en'
  const initializedRef = useRef(false)
  const aiFailedRef = useRef(false) // 标记 AI 是否已失败

  useEffect(() => {
    const timer = setTimeout(() => {
      // 如果语言改变，需要重新初始化以更新翻译
      if (initializedRef.current) {
        const existingButton = document.querySelector(`#${containerId} .DocSearch-Button`)
        if (existingButton) {
          // 语言改变时，重置初始化状态以重新初始化
          initializedRef.current = false
        } else {
          return
        }
      }

      // 获取或创建搜索容器
      let searchContainer = document.getElementById(containerId)
      if (!searchContainer) {
        searchContainer = document.createElement('div')
        searchContainer.id = containerId
        searchContainer.className = 'algolia-search-container'
      } else {
        searchContainer.className = 'algolia-search-container'
      }

      // 查找原有的 Rspress 搜索按钮并替换
      const originalSearchButton = document.querySelector(
        '.rspress-nav-search-button, .navSearchButton_df1fb'
      ) as HTMLElement | null

      if (originalSearchButton) {
        // 隐藏原有搜索按钮
        originalSearchButton.style.display = 'none'
        // 将 Algolia 搜索框插入到原有搜索按钮的位置（完全替换）
        const parent = originalSearchButton.parentElement
        if (parent) {
          parent.insertBefore(searchContainer, originalSearchButton)
          // 确保搜索框在正确的 flex 容器中
          const flexContainer = parent.closest('.rp-flex.sm\\:rp-flex-1, [class*="flex"]')
          if (flexContainer && !flexContainer.contains(searchContainer)) {
            flexContainer.insertBefore(searchContainer, flexContainer.firstChild)
          }
        }
      } else {
        // 如果没有找到原有搜索按钮，插入到导航栏右侧区域
        const navContainer = document.querySelector(
          '.navContainer_d18b1 > .container_e4235'
        ) as HTMLElement | null

        if (navContainer) {
          const rightNav = navContainer.querySelector('.rightNav_a2fea') as HTMLElement | null

          if (rightNav && !rightNav.contains(searchContainer)) {
            rightNav.insertBefore(searchContainer, rightNav.firstChild)
          }
        }
      }

      // 初始化 DocSearch 的函数
      const initializeSearch = (useAI: boolean) => {
        if (!searchContainer) return

        // 如果已经初始化过，先清理
        const existingButton = searchContainer.querySelector('.DocSearch-Button')
        if (existingButton) {
          searchContainer.innerHTML = ''
        }

        // 调试信息：输出配置（隐藏敏感信息）
        console.log('Algolia DocSearch 配置:', {
          appId: algoliaConfig.appId,
          indexName: algoliaConfig.indexName,
          apiKey: `${algoliaConfig.apiKey.slice(0, 4)}...${algoliaConfig.apiKey.slice(-4)}`,
          hasAssistantId: !!finalAssistantId,
        })

        const searchConfig: Parameters<typeof docsearch>[0] = {
          container: `#${containerId}`,
          appId: algoliaConfig.appId,
          indexName: algoliaConfig.indexName,
          apiKey: algoliaConfig.apiKey,
          placeholder: getPlaceholder(isEnglish),
          ...(useAI && finalAssistantId && { askAi: finalAssistantId }),
          translations: getTranslations(isEnglish),
        }

        try {
          docsearch(searchConfig)
          initializedRef.current = true
          console.log('Algolia DocSearch 初始化成功')
          return true
        } catch (error) {
          console.error('Failed to initialize Algolia DocSearch:', error)
          // 输出详细的错误信息
          if (error instanceof Error) {
            console.error('错误详情:', {
              message: error.message,
              name: error.name,
              stack: error.stack,
            })
          }
          return false
        }
      }

      // 处理 AI 错误的函数
      const handleAIFailure = () => {
        if (!aiFailedRef.current && finalAssistantId) {
          aiFailedRef.current = true
          console.warn('检测到 AI Assistant 401 错误，自动降级到基础搜索功能')
          // 延迟一下再重新初始化，避免立即重试
          setTimeout(() => {
            initializedRef.current = false
            initializeSearch(false)
          }, 500)
        }
      }

      // 监听全局错误，检测 AI 相关的 401 错误
      const handleError = (event: ErrorEvent) => {
        // 检查是否是 Algolia AI 相关的 401 错误
        if (
          event.message?.includes('UNAUTHORIZED') ||
          event.message?.includes('401') ||
          (event.error as any)?.code === 'UNAUTHORIZED' ||
          (event.error as any)?.status === 401
        ) {
          // 检查错误是否来自 Algolia
          const errorUrl = (event.error as any)?.url || ''
          if (
            errorUrl.includes('algolia') ||
            errorUrl.includes('docsearch') ||
            event.message?.includes('algolia') ||
            event.message?.includes('docsearch')
          ) {
            handleAIFailure()
          }
        }
      }

      // 监听自定义的 AI 错误事件
      const handleAIError = (event: Event) => {
        handleAIFailure()
      }

      // 监听 fetch 错误（AI 请求可能通过 fetch 发送）
      // 使用全局变量避免重复拦截
      if (!(window as any).__docsearch_fetch_intercepted) {
        const originalFetch = window.fetch
        window.fetch = async (...args) => {
          try {
            const response = await originalFetch(...args)
            // 检查是否是 Algolia AI 相关的 401 错误
            if (
              response.status === 401 &&
              (args[0]?.toString().includes('algolia') || args[0]?.toString().includes('docsearch'))
            ) {
              const url = args[0]?.toString() || ''
              if (url.includes('ask') || url.includes('assistant')) {
                // 触发自定义事件，让组件处理
                window.dispatchEvent(
                  new CustomEvent('docsearch-ai-error', {
                    detail: { status: 401, url },
                  })
                )
              }
            }
            return response
          } catch (error) {
            throw error
          }
        }
        ;(window as any).__docsearch_fetch_intercepted = true
      }

      // 添加全局错误监听
      window.addEventListener('error', handleError)
      window.addEventListener('docsearch-ai-error', handleAIError)

      // 初始化搜索（优先尝试带 AI）
      if (searchContainer && !searchContainer.querySelector('.DocSearch-Button')) {
        if (finalAssistantId && !aiFailedRef.current) {
          // 尝试使用 AI 功能
          const success = initializeSearch(true)
          if (!success && finalAssistantId) {
            // 如果初始化失败，降级到基础搜索
            console.warn('AI Assistant 初始化失败，使用基础搜索功能')
            aiFailedRef.current = true
            initializeSearch(false)
          }
        } else {
          // 直接使用基础搜索
          initializeSearch(false)
        }
      }

      // 清理函数
      return () => {
        window.removeEventListener('error', handleError)
        window.removeEventListener('docsearch-ai-error', handleAIError as EventListener)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [containerId, isEnglish, finalAssistantId])

  return <div id={containerId} ref={containerRef} className="algolia-search-container" />
}
