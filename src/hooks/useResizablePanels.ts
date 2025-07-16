'use client';

import { useState, useCallback, useEffect } from 'react';

// Breakpoints for responsive behavior
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1200,
  desktop: Infinity
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

// Size constraints for different breakpoints
interface SizeConstraints {
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
}

const PANEL_CONSTRAINTS: Record<Breakpoint, { left: SizeConstraints; right: SizeConstraints }> = {
  mobile: {
    left: { minWidth: 100, maxWidth: 100, defaultWidth: 100 },
    right: { minWidth: 0, maxWidth: 0, defaultWidth: 0 }
  },
  tablet: {
    left: { minWidth: 40, maxWidth: 80, defaultWidth: 60 },
    right: { minWidth: 20, maxWidth: 60, defaultWidth: 40 }
  },
  desktop: {
    left: { minWidth: 30, maxWidth: 85, defaultWidth: 65 },
    right: { minWidth: 15, maxWidth: 70, defaultWidth: 35 }
  }
};

interface PanelSizes {
  leftWidth: number;
  rightWidth: number;
  isRightCollapsed: boolean;
}

interface UseResizablePanelsOptions {
  initialLeftWidth?: number;
  initialRightWidth?: number;
  initialRightCollapsed?: boolean;
  onSizeChange?: (sizes: PanelSizes) => void;
}

export const useResizablePanels = (options: UseResizablePanelsOptions = {}) => {
  const {
    initialLeftWidth = 65,
    initialRightWidth = 35,
    initialRightCollapsed = false,
    onSizeChange
  } = options;

  // Current breakpoint detection
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');
  
  // Panel sizes state
  const [panelSizes, setPanelSizes] = useState<PanelSizes>({
    leftWidth: initialLeftWidth,
    rightWidth: initialRightWidth,
    isRightCollapsed: initialRightCollapsed
  });

  // Detect current breakpoint
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.mobile) {
        setBreakpoint('mobile');
      } else if (width < BREAKPOINTS.tablet) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  // Get constraints for current breakpoint
  const getConstraints = useCallback((panel: 'left' | 'right') => {
    return PANEL_CONSTRAINTS[breakpoint][panel];
  }, [breakpoint]);

  // Validate and constrain panel width
  const validateWidth = useCallback((width: number, panel: 'left' | 'right'): number => {
    const constraints = getConstraints(panel);
    return Math.max(constraints.minWidth, Math.min(constraints.maxWidth, width));
  }, [getConstraints]);

  // Validate panel sizes to ensure they sum to 100% (when not collapsed)
  const validatePanelSizes = useCallback((leftWidth: number, rightWidth: number, isRightCollapsed: boolean) => {
    if (isRightCollapsed) {
      return {
        leftWidth: validateWidth(100, 'left'),
        rightWidth: 0,
        isRightCollapsed: true
      };
    }

    // For mobile, force full width for left panel
    if (breakpoint === 'mobile') {
      return {
        leftWidth: 100,
        rightWidth: 0,
        isRightCollapsed: false
      };
    }

    // Validate individual widths
    const validLeftWidth = validateWidth(leftWidth, 'left');
    const validRightWidth = validateWidth(rightWidth, 'right');

    // Ensure they sum to approximately 100%
    const total = validLeftWidth + validRightWidth;
    if (Math.abs(total - 100) > 1) {
      // Adjust proportionally
      const leftRatio = validLeftWidth / total;
      const rightRatio = validRightWidth / total;
      
      return {
        leftWidth: Math.round(leftRatio * 100),
        rightWidth: Math.round(rightRatio * 100),
        isRightCollapsed: false
      };
    }

    return {
      leftWidth: validLeftWidth,
      rightWidth: validRightWidth,
      isRightCollapsed: false
    };
  }, [breakpoint, validateWidth]);

  // Update panel sizes with validation
  const updatePanelSizes = useCallback((newSizes: Partial<PanelSizes>) => {
    setPanelSizes(current => {
      const updated = { ...current, ...newSizes };
      const validated = validatePanelSizes(
        updated.leftWidth,
        updated.rightWidth,
        updated.isRightCollapsed
      );

      // Call callback if sizes actually changed
      if (onSizeChange && (
        validated.leftWidth !== current.leftWidth ||
        validated.rightWidth !== current.rightWidth ||
        validated.isRightCollapsed !== current.isRightCollapsed
      )) {
        onSizeChange(validated);
      }

      return validated;
    });
  }, [validatePanelSizes, onSizeChange]);

  // Handle left panel resize
  const handleLeftPanelResize = useCallback((newWidth: number) => {
    if (panelSizes.isRightCollapsed) {
      updatePanelSizes({ leftWidth: newWidth });
    } else {
      const rightWidth = 100 - newWidth;
      updatePanelSizes({ leftWidth: newWidth, rightWidth });
    }
  }, [panelSizes.isRightCollapsed, updatePanelSizes]);

  // Handle right panel resize
  const handleRightPanelResize = useCallback((newWidth: number) => {
    if (!panelSizes.isRightCollapsed) {
      const leftWidth = 100 - newWidth;
      updatePanelSizes({ leftWidth, rightWidth: newWidth });
    }
  }, [panelSizes.isRightCollapsed, updatePanelSizes]);

  // Toggle right panel collapse
  const toggleRightPanelCollapse = useCallback(() => {
    updatePanelSizes({ isRightCollapsed: !panelSizes.isRightCollapsed });
  }, [panelSizes.isRightCollapsed, updatePanelSizes]);

  // Reset to default sizes for current breakpoint
  const resetToDefaults = useCallback(() => {
    const leftConstraints = getConstraints('left');
    const rightConstraints = getConstraints('right');
    
    updatePanelSizes({
      leftWidth: leftConstraints.defaultWidth,
      rightWidth: rightConstraints.defaultWidth,
      isRightCollapsed: false
    });
  }, [getConstraints, updatePanelSizes]);

  // Auto-adjust for breakpoint changes
  useEffect(() => {
    // For mobile, always collapse right panel
    if (breakpoint === 'mobile') {
      updatePanelSizes({
        leftWidth: 100,
        rightWidth: 0,
        isRightCollapsed: false // Mobile uses stacked layout, not collapsed
      });
    } else {
      // Validate current sizes against new constraints
      const validatedSizes = validatePanelSizes(
        panelSizes.leftWidth,
        panelSizes.rightWidth,
        panelSizes.isRightCollapsed
      );

      if (
        validatedSizes.leftWidth !== panelSizes.leftWidth ||
        validatedSizes.rightWidth !== panelSizes.rightWidth
      ) {
        setPanelSizes(validatedSizes);
      }
    }
  }, [breakpoint, validatePanelSizes, panelSizes, updatePanelSizes]);

  // Check if current sizes are valid
  const isValidState = useCallback(() => {
    const validated = validatePanelSizes(
      panelSizes.leftWidth,
      panelSizes.rightWidth,
      panelSizes.isRightCollapsed
    );

    return (
      validated.leftWidth === panelSizes.leftWidth &&
      validated.rightWidth === panelSizes.rightWidth &&
      validated.isRightCollapsed === panelSizes.isRightCollapsed
    );
  }, [panelSizes, validatePanelSizes]);

  return {
    // Current state
    panelSizes,
    breakpoint,
    isValidState: isValidState(),

    // Constraints for current breakpoint
    leftConstraints: getConstraints('left'),
    rightConstraints: getConstraints('right'),

    // Actions
    handleLeftPanelResize,
    handleRightPanelResize,
    toggleRightPanelCollapse,
    resetToDefaults,
    updatePanelSizes,

    // Utilities
    validateWidth,
    validatePanelSizes
  };
};