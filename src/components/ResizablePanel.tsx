'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

export interface ResizablePanelProps {
  children: React.ReactNode;
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  isCollapsed: boolean;
  onResize: (width: number) => void;
  onToggleCollapse: () => void;
  position: 'left' | 'right';
  className?: string;
  // Notification system for collapsed state
  hasNotification?: boolean;
  notificationCount?: number;
  notificationPreview?: string;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startWidth: number;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  initialWidth,
  minWidth,
  maxWidth,
  isCollapsed,
  onResize,
  onToggleCollapse,
  position,
  className = '',
  hasNotification = false,
  notificationCount = 0,
  notificationPreview = ''
}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startWidth: initialWidth
  });
  
  const [currentWidth, setCurrentWidth] = useState(initialWidth);
  const [isHovering, setIsHovering] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // Update current width when initialWidth changes
  useEffect(() => {
    setCurrentWidth(initialWidth);
  }, [initialWidth]);

  // Validate and constrain width
  const constrainWidth = useCallback((width: number): number => {
    return Math.max(minWidth, Math.min(maxWidth, width));
  }, [minWidth, maxWidth]);

  // Handle mouse down on resize handle
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = currentWidth;

    setDragState({
      isDragging: true,
      startX,
      startWidth
    });

    // Add cursor style to body during drag
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [currentWidth]);

  // Handle touch start for mobile support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    const startX = touch.clientX;
    const startWidth = currentWidth;

    setDragState({
      isDragging: true,
      startX,
      startWidth
    });
  }, [currentWidth]);

  // Handle mouse/touch move during drag
  const handleMove = useCallback((clientX: number) => {
    if (!dragState.isDragging) return;

    const deltaX = clientX - dragState.startX;
    let newWidth: number;

    if (position === 'left') {
      newWidth = dragState.startWidth + deltaX;
    } else {
      newWidth = dragState.startWidth - deltaX;
    }

    const constrainedWidth = constrainWidth(newWidth);
    setCurrentWidth(constrainedWidth);
    onResize(constrainedWidth);
  }, [dragState, position, constrainWidth, onResize]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!dragState.isDragging) return;

    setDragState(prev => ({ ...prev, isDragging: false }));
    
    // Remove cursor styles
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [dragState.isDragging]);

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleMouseUp = () => {
      handleDragEnd();
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, handleMove, handleDragEnd]);

  // Touch event handlers
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX);
    };

    const handleTouchEnd = () => {
      handleDragEnd();
    };

    if (dragState.isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragState.isDragging, handleMove, handleDragEnd]);

  // Calculate panel width style with smooth transitions
  const panelWidth = isCollapsed ? 0 : currentWidth;
  const panelStyle = {
    width: `${panelWidth}%`,
    minWidth: isCollapsed ? '0px' : `${minWidth}%`,
    maxWidth: isCollapsed ? '0px' : `${maxWidth}%`,
    transform: isCollapsed ? 'translateX(0)' : 'translateX(0)',
  };

  return (
    <div
      ref={panelRef}
      className={`relative h-full transition-all duration-300 ease-in-out overflow-hidden ${className}`}
      style={panelStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Panel content */}
      <div className={`h-full transition-all duration-300 ${
        isCollapsed 
          ? 'opacity-0 scale-95 pointer-events-none' 
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}>
        {children}
      </div>

      {/* Resize handle */}
      {!isCollapsed && (
        <div
          ref={resizeHandleRef}
          className={`absolute top-0 ${position === 'left' ? 'right-0' : 'left-0'} w-1 h-full group cursor-col-resize z-10`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Invisible wider hit area */}
          <div className="absolute inset-0 w-4 h-full -translate-x-1.5" />
          
          {/* Visual handle */}
          <div 
            className={`w-full h-full transition-all duration-200 ${
              dragState.isDragging 
                ? 'bg-blue-500 shadow-lg' 
                : isHovering 
                  ? 'bg-gray-400 shadow-md' 
                  : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
          
          {/* Handle indicator dots */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
            isHovering || dragState.isDragging ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex flex-col space-y-1">
              <div className="w-1 h-1 bg-white rounded-full" />
              <div className="w-1 h-1 bg-white rounded-full" />
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle button */}
      <button
        onClick={onToggleCollapse}
        className={`absolute top-4 ${position === 'left' ? 'right-4' : 'left-4'} z-20 p-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
          isCollapsed ? 'opacity-100' : isHovering ? 'opacity-100' : 'opacity-0'
        }`}
        title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
      >
        {isCollapsed ? (
          position === 'left' ? (
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )
        ) : (
          position === 'left' ? (
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )
        )}
      </button>

      {/* Collapsed state indicator */}
      {isCollapsed && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm transition-all duration-300 ${
          isHovering ? 'bg-gray-100/90' : 'bg-gray-50/80'
        }`}>
          <div className="text-center relative">
            <div className={`w-8 h-8 mx-auto mb-2 rounded-full shadow-sm flex items-center justify-center relative ${
              hasNotification ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white'
            }`}>
              {position === 'left' ? (
                <svg className={`w-4 h-4 ${hasNotification ? 'text-blue-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ) : (
                <svg className={`w-4 h-4 ${hasNotification ? 'text-blue-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )}
              
              {/* Notification badge */}
              {hasNotification && notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </div>
              )}
            </div>
            
            <p className={`text-xs font-medium ${hasNotification ? 'text-blue-600' : 'text-gray-500'}`}>
              {position === 'left' ? 'PDF' : 'Assistant'}
            </p>
            
            {/* Notification preview */}
            {hasNotification && notificationPreview && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg max-w-32">
                <p className="text-xs text-blue-700 truncate">
                  {notificationPreview}
                </p>
              </div>
            )}
            
            <p className={`text-xs mt-1 ${hasNotification ? 'text-blue-500' : 'text-gray-400'}`}>
              {hasNotification ? 'New activity!' : 'Click to expand'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResizablePanel;