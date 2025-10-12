import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

// Enhanced sidebar state interface
interface SidebarState {
  state: "expanded" | "collapsed"
  open: boolean
  openMobile: boolean
  isMobile: boolean
  isVisible: boolean
  scrollY: number
  isScrolling: boolean
  direction: 'up' | 'down'
  velocity: number
  lastScrollY: number
  isTransitioning: boolean
  gestureStart: number | null
  gestureDirection: 'left' | 'right' | null
}

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
  // Enhanced features
  sidebarState: SidebarState
  setSidebarState: React.Dispatch<React.SetStateAction<SidebarState>>
  toggleMobileSidebar: () => void
  handleGestureStart: (clientX: number) => void
  handleGestureMove: (clientX: number) => void
  handleGestureEnd: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // Enhanced sidebar state management
  const [sidebarState, setSidebarState] = React.useState<SidebarState>({
    state: "expanded",
    open: defaultOpen,
    openMobile: false,
    isMobile,
    isVisible: true,
    scrollY: 0,
    isScrolling: false,
    direction: 'down',
    velocity: 0,
    lastScrollY: 0,
    isTransitioning: false,
    gestureStart: null,
    gestureDirection: null,
  })

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // Update sidebar state
      setSidebarState(prev => ({ ...prev, open: openState, state: openState ? "expanded" : "collapsed" }))

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  // Enhanced mobile sidebar toggle with smooth transitions
  const toggleMobileSidebar = React.useCallback(() => {
    setSidebarState(prev => ({
      ...prev,
      isTransitioning: true,
      openMobile: !prev.openMobile
    }))

    setOpenMobile(prev => {
      const newState = !prev

      // Apply body scroll lock for mobile
      if (newState) {
        const scrollY = window.scrollY
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollY}px`
        document.body.style.width = '100%'
        document.body.style.overflow = 'hidden'
        document.body.classList.add('mobile-sidebar-open')
      } else {
        const scrollY = parseInt(document.body.style.top || '0') * -1
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        document.body.classList.remove('mobile-sidebar-open')
        window.scrollTo(0, scrollY)
      }

      return newState
    })

    // Reset transition state after animation
    setTimeout(() => {
      setSidebarState(prev => ({ ...prev, isTransitioning: false }))
    }, 300)
  }, [])

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? toggleMobileSidebar() : setOpen((open) => !open)
  }, [isMobile, setOpen, toggleMobileSidebar])

  // Enhanced gesture handling for mobile sidebar
  const handleGestureStart = React.useCallback((clientX: number) => {
    if (!isMobile) return

    setSidebarState(prev => ({
      ...prev,
      gestureStart: clientX,
      gestureDirection: null
    }))
  }, [isMobile])

  const handleGestureMove = React.useCallback((clientX: number) => {
    if (!isMobile || sidebarState.gestureStart === null) return

    const deltaX = clientX - sidebarState.gestureStart
    const threshold = 50

    if (Math.abs(deltaX) > threshold) {
      const direction = deltaX > 0 ? 'right' : 'left'
      setSidebarState(prev => ({
        ...prev,
        gestureDirection: direction
      }))
    }
  }, [isMobile, sidebarState.gestureStart])

  const handleGestureEnd = React.useCallback(() => {
    if (!isMobile || sidebarState.gestureDirection === null) {
      setSidebarState(prev => ({
        ...prev,
        gestureStart: null,
        gestureDirection: null
      }))
      return
    }

    // Handle swipe gestures
    if (sidebarState.gestureDirection === 'right' && !openMobile) {
      toggleMobileSidebar()
    } else if (sidebarState.gestureDirection === 'left' && openMobile) {
      toggleMobileSidebar()
    }

    setSidebarState(prev => ({
      ...prev,
      gestureStart: null,
      gestureDirection: null
    }))
  }, [isMobile, sidebarState.gestureDirection, openMobile, toggleMobileSidebar])

  // Enhanced scroll behavior for mobile sidebar
  React.useEffect(() => {
    if (!isMobile) return

    let animationFrameId: number
    let scrollTimeoutId: NodeJS.Timeout

    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      animationFrameId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const deltaY = currentScrollY - sidebarState.scrollY
        const velocity = Math.abs(deltaY)
        const direction = deltaY > 0 ? 'down' : 'up'

        setSidebarState(prev => ({
          ...prev,
          scrollY: currentScrollY,
          isScrolling: true,
          direction,
          velocity,
          lastScrollY: prev.scrollY,
        }))

        // Clear scroll timeout
        if (scrollTimeoutId) {
          clearTimeout(scrollTimeoutId)
        }

        // Set scrolling to false after scroll ends
        scrollTimeoutId = setTimeout(() => {
          setSidebarState(prev => ({ ...prev, isScrolling: false }))
        }, 150)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (scrollTimeoutId) {
        clearTimeout(scrollTimeoutId)
      }
    }
  }, [isMobile, sidebarState.scrollY])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }

      // Enhanced keyboard shortcuts for mobile
      if (isMobile && event.key === 'Escape' && openMobile) {
        event.preventDefault()
        toggleMobileSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar, isMobile, openMobile, toggleMobileSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed"

  // Update sidebar state when mobile state changes
  React.useEffect(() => {
    setSidebarState(prev => ({ ...prev, isMobile, openMobile }))
  }, [isMobile, openMobile])

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      // Enhanced features
      sidebarState,
      setSidebarState,
      toggleMobileSidebar,
      handleGestureStart,
      handleGestureMove,
      handleGestureEnd,
    }),
    [
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      sidebarState,
      setSidebarState,
      toggleMobileSidebar,
      handleGestureStart,
      handleGestureMove,
      handleGestureEnd,
    ]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const {
    isMobile,
    state,
    openMobile,
    setOpenMobile,
    sidebarState,
    handleGestureStart,
    handleGestureMove,
    handleGestureEnd
  } = useSidebar()

  // Enhanced gesture event handlers
  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleGestureStart(e.touches[0].clientX)
    }
  }, [handleGestureStart])

  const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleGestureMove(e.touches[0].clientX)
    }
  }, [handleGestureMove])

  const handleTouchEnd = React.useCallback(() => {
    handleGestureEnd()
  }, [handleGestureEnd])

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      handleGestureStart(e.clientX)
    }
  }, [handleGestureStart])

  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (sidebarState.gestureStart !== null) {
      handleGestureMove(e.clientX)
    }
  }, [handleGestureMove, sidebarState.gestureStart])

  const handleMouseUp = React.useCallback(() => {
    handleGestureEnd()
  }, [handleGestureEnd])

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetHeader className="sr-only">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>Displays the mobile sidebar.</SheetDescription>
        </SheetHeader>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className={cn(
            "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
            "transition-all duration-300 ease-out",
            sidebarState.isTransitioning && "transform-gpu",
            sidebarState.gestureDirection === 'left' && "translate-x-[-10px]",
            sidebarState.gestureDirection === 'right' && "translate-x-[10px]"
          )}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            } as React.CSSProperties
          }
          side={side}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="flex h-full w-full flex-col overflow-hidden">
            {/* Enhanced mobile sidebar header with gesture indicator */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-sidebar-primary"></div>
                <span className="text-sm font-medium text-sidebar-foreground">Navigation</span>
              </div>
              {sidebarState.gestureDirection && (
                <div className={cn(
                  "text-xs px-2 py-1 rounded-full transition-all duration-200",
                  sidebarState.gestureDirection === 'right'
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                )}>
                  {sidebarState.gestureDirection === 'right' ? 'Opening...' : 'Closing...'}
                </div>
              )}
            </div>

            {/* Scrollable content with enhanced scroll behavior */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0,0,0,0.2) transparent',
              }}
            >
              {children}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          "relative h-svh w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, sidebarState, isMobile } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn(
        "h-7 w-7 transition-all duration-200",
        sidebarState.isTransitioning && "scale-95 opacity-75",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      disabled={sidebarState.isTransitioning}
      {...props}
    >
      <PanelLeftIcon className={cn(
        "h-4 w-4 transition-transform duration-200",
        sidebarState.isTransitioning && "rotate-90"
      )} />
      <span className="sr-only">
        {isMobile ? 'Toggle Mobile Sidebar' : 'Toggle Sidebar'}
      </span>
    </Button>
  )
}

// Enhanced Mobile Sidebar Trigger with gesture support
function SidebarMobileTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const {
    sidebarState,
    toggleMobileSidebar,
    handleGestureStart,
    handleGestureMove,
    handleGestureEnd
  } = useSidebar()

  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleGestureStart(e.touches[0].clientX)
    }
  }, [handleGestureStart])

  const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleGestureMove(e.touches[0].clientX)
    }
  }, [handleGestureMove])

  const handleTouchEnd = React.useCallback(() => {
    handleGestureEnd()
  }, [handleGestureEnd])

  return (
    <div
      className={cn(
        "fixed left-0 top-1/2 z-[70] -translate-y-1/2",
        "w-8 h-16 bg-sidebar border border-sidebar-border rounded-r-lg",
        "flex items-center justify-center cursor-pointer",
        "transition-all duration-200 hover:bg-sidebar-accent",
        "shadow-lg backdrop-blur-sm",
        sidebarState.isTransitioning && "scale-95 opacity-75",
        className
      )}
      onClick={toggleMobileSidebar}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      {children || (
        <div className="flex flex-col items-center gap-1">
          <div className={cn(
            "w-4 h-0.5 bg-sidebar-foreground transition-transform duration-200",
            sidebarState.isTransitioning && "rotate-45 translate-y-1"
          )} />
          <div className={cn(
            "w-4 h-0.5 bg-sidebar-foreground transition-opacity duration-200",
            sidebarState.isTransitioning && "opacity-0"
          )} />
          <div className={cn(
            "w-4 h-0.5 bg-sidebar-foreground transition-transform duration-200",
            sidebarState.isTransitioning && "-rotate-45 -translate-y-1"
          )} />
        </div>
      )}

      {/* Gesture indicator */}
      {sidebarState.gestureDirection && (
        <div className={cn(
          "absolute -right-12 top-1/2 -translate-y-1/2",
          "text-xs px-2 py-1 rounded-full transition-all duration-200",
          sidebarState.gestureDirection === 'right'
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        )}>
          {sidebarState.gestureDirection === 'right' ? '←' : '→'}
        </div>
      )}
    </div>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar, sidebarState } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        sidebarState.isTransitioning && "opacity-50",
        className
      )}
      disabled={sidebarState.isTransitioning}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex max-w-full min-h-svh flex-1 flex-col",
        "peer-data-[variant=inset]:min-h-[calc(100svh-(--spacing(4)))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:select-none group-data-[collapsible=icon]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button"
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  showOnHover?: boolean
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  size?: "sm" | "md"
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  SidebarMobileTrigger,
  useSidebar,
}
