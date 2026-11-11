"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

// Apple visionOS natural easing curve
const APPLE_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * PageTransition: Smooth page-to-page entrance animation
 * Subtle opacity fade with slight vertical translation (8px).
 */
export const PageTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={`w-full ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.28, ease: APPLE_EASE }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: APPLE_EASE,
    },
  },
};

/**
 * StaggerContainer: Parent container for staggered dashboard card entrance
 */
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerItem: Individual card or row within a StaggerContainer
 */
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

/**
 * AnimatedTabIndicator: Shared layoutId sliding pill for active tab switching
 */
export const AnimatedTabIndicator: React.FC<{
  layoutId?: string;
  className?: string;
}> = ({ layoutId = "activeTabIndicator", className = "" }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-b from-[#FFE455] to-[#FFD91C] shadow-[0_4px_16px_rgba(255,217,28,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] ${className}`}
      />
    );
  }

  return (
    <motion.div
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className={`absolute inset-0 rounded-xl bg-gradient-to-b from-[#FFE455] to-[#FFD91C] shadow-[0_4px_16px_rgba(255,217,28,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] ${className}`}
    />
  );
};
