"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, Search, X } from "lucide-react";

export interface ApolloSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  icon?: React.ElementType;
}

export interface ApolloSelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: (ApolloSelectOption | string)[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  ariaLabel?: string;
  id?: string;
  name?: string;
  required?: boolean;
  size?: "sm" | "md" | "lg";
  leadingIcon?: React.ElementType;
}

export const ApolloSelect: React.FC<ApolloSelectProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  options: rawOptions,
  placeholder = "Select an option...",
  disabled = false,
  searchable = false,
  clearable = false,
  className = "",
  triggerClassName = "",
  menuClassName = "",
  ariaLabel,
  id: explicitId,
  name,
  required = false,
  size = "md",
  leadingIcon: LeadingIcon,
}) => {
  const generatedId = useId();
  const selectId = explicitId || generatedId;

  // Normalize options into ApolloSelectOption[]
  const options: ApolloSelectOption[] = React.useMemo(() => {
    return rawOptions.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [rawOptions]);

  // Value state (controlled or uncontrolled)
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue !== undefined ? defaultValue : options[0]?.value || ""
  );
  const selectedValue = isControlled ? controlledValue : internalValue;

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  // Dropdown open state
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Position calculations for portal rendering
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    placement: "bottom" | "top";
  }>({
    top: 0,
    left: 0,
    width: 200,
    placement: "bottom",
  });

  // Filtered options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  // Calculate coordinates relative to viewport for the portal
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedMenuHeight = Math.min(filteredOptions.length * 40 + 60, 280);

    let placement: "bottom" | "top" = "bottom";
    let top = rect.bottom + 4;

    if (spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow) {
      placement = "top";
      top = Math.max(8, rect.top - estimatedMenuHeight - 4);
    }

    setCoords({
      top,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)),
      width: Math.max(rect.width, 160),
      placement,
    });
  }, [filteredOptions.length]);

  // Reposition on open, scroll, or resize
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("resize", handleScrollOrResize, { passive: true });
    window.addEventListener("scroll", handleScrollOrResize, { capture: true, passive: true });

    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, { capture: true });
    };
  }, [isOpen, updatePosition]);

  // Focus search input or active item when opened
  useEffect(() => {
    if (isOpen) {
      if (searchable && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 40);
      }
      const initialIdx = filteredOptions.findIndex(
        (opt) => opt.value === selectedValue
      );
      setHighlightedIndex(initialIdx >= 0 ? initialIdx : 0);
    } else {
      setSearchQuery("");
      setHighlightedIndex(-1);
    }
  }, [isOpen, searchable, filteredOptions, selectedValue]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isOpen]);

  // Selection handler
  const handleSelect = (option: ApolloSelectOption) => {
    if (option.disabled) return;
    if (!isControlled) {
      setInternalValue(option.value);
    }
    onChange?.(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev + 1;
          while (next < filteredOptions.length && filteredOptions[next].disabled) {
            next++;
          }
          return next < filteredOptions.length ? next : prev;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && filteredOptions[next].disabled) {
            next--;
          }
          return next >= 0 ? next : prev;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  // Size styling
  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-[11.5px] rounded-lg min-h-[32px]",
    md: "px-3 py-2 text-[12.5px] rounded-xl min-h-[38px]",
    lg: "px-3.5 py-2.5 text-[13.5px] rounded-xl min-h-[44px]",
  }[size];

  // Auto-detect searchable if list is large (> 6 items) and not explicitly disabled
  const shouldShowSearch = searchable || options.length > 7;

  return (
    <div className={`relative inline-block ${className}`} onKeyDown={handleKeyDown}>
      {/* Hidden native input for form compatibility */}
      <input
        type="hidden"
        name={name}
        value={selectedValue}
        required={required}
      />

      {/* Main Trigger Button */}
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || selectedOption?.label || placeholder}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 transition-all select-none border font-semibold outline-none btn ${sizeClasses} ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-[var(--btn-bg)] border-[var(--btn-border)] text-[var(--muted)]"
            : isOpen
            ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30 bg-[var(--btn-bg)] text-[var(--text)] shadow-sm"
            : "border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--text)] hover:border-[var(--accent)]/50"
        } ${triggerClassName}`}
      >
        <span className="flex items-center gap-2 truncate text-left flex-1 min-w-0">
          {LeadingIcon && <LeadingIcon className="w-3.5 h-3.5 shrink-0 text-[var(--muted)]" />}
          {selectedOption?.icon && (
            <selectedOption.icon className="w-3.5 h-3.5 shrink-0 text-[var(--muted)]" />
          )}
          {selectedOption ? (
            <span className="truncate">{selectedOption.label}</span>
          ) : (
            <span className="text-[var(--muted)] font-normal">{placeholder}</span>
          )}
        </span>

        <span className="flex items-center gap-1 shrink-0 text-[var(--muted)] ml-1">
          {clearable && selectedValue && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                if (!isControlled) setInternalValue("");
                onChange?.("");
              }}
              className="p-0.5 hover:text-[var(--text)] rounded"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[var(--accent)]" : ""
            }`}
          />
        </span>
      </button>

      {/* Portal Dropdown Menu: Attached directly to document.body to bypass modal overflow:hidden clipping */}
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-labelledby={selectId}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              maxHeight: "300px",
              zIndex: 99999,
              background: "var(--menu-bg)",
              backdropFilter: "blur(22px) saturate(160%)",
              WebkitBackdropFilter: "blur(22px) saturate(160%)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--menu-shadow)",
              color: "var(--text)",
            }}
            className={`rounded-2xl p-1.5 transition-all duration-150 animate-in fade-in zoom-in-95 flex flex-col ${menuClassName}`}
          >
            {/* Search Input Filter if options list is long */}
            {shouldShowSearch && (
              <div className="p-1 mb-1 border-b border-[var(--line)] relative">
                <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter options..."
                  className="w-full bg-[var(--btn-bg)] border border-[var(--card-border)] rounded-xl pl-8 pr-3 py-1.5 text-[11.5px] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Scrollable Options List */}
            <div className="overflow-y-auto apollo-scrollbar max-h-56 space-y-0.5 pr-0.5">
              {filteredOptions.length === 0 ? (
                <div className="py-4 px-3 text-center text-xs text-[var(--muted)]">
                  No matching options found
                </div>
              ) : (
                filteredOptions.map((option, idx) => {
                  const isSelected = option.value === selectedValue;
                  const isHighlighted = idx === highlightedIndex;
                  const OptionIcon = option.icon;

                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => !option.disabled && setHighlightedIndex(idx)}
                      style={{
                        background: isSelected
                          ? "var(--accent)"
                          : isHighlighted
                          ? "var(--menu-hover)"
                          : "transparent",
                        color: isSelected ? "var(--on-accent)" : "var(--text)",
                      }}
                      className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-[12px] font-semibold cursor-pointer select-none transition-colors ${
                        option.disabled
                          ? "opacity-40 cursor-not-allowed"
                          : isSelected
                          ? "font-bold shadow-sm"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {OptionIcon && (
                          <OptionIcon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSelected ? "text-[var(--on-accent)]" : "text-[var(--muted)]"
                            }`}
                          />
                        )}
                        <div className="truncate">
                          <span className="block truncate">{option.label}</span>
                          {option.sublabel && (
                            <span
                              className={`block text-[10px] leading-tight truncate ${
                                isSelected
                                  ? "text-[var(--on-accent)] opacity-80"
                                  : "text-[var(--muted)]"
                              }`}
                            >
                              {option.sublabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 shrink-0 text-[var(--on-accent)]" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
