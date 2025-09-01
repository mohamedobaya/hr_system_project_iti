export const lightColorTheme = {
    background: {
        base: "#F9FAFB",
        hover: "#F3F4F6",
        disabled: "#E5E7EB"
    },
    text: {
        base: "#1F2937",
        hover: "#111827",
        disabled: "#9CA3AF"
    },
    primary: {
        base: "#2563EB",
        hover: "#1D4ED8",
        disabled: "#93C5FD"
    },
    secondary: {
        base: "#6B7280",
        hover: "#4B5563",
        disabled: "#D1D5DB"
    },
    accent: {
        base: "#10B981",
        hover: "#059669",
        disabled: "#A7F3D0"
    },
    danger: {
        base: "#DC2626",
        hover: "#B91C1C",
        disabled: "#FCA5A5"
    },
    success: {
        base: "#16A34A",
        hover: "#15803D",
        disabled: "#86EFAC"
    },
    warning: {
        base: "#D97706",
        hover: "#B45309",
        disabled: "#FCD34D"
    }
};

export const darkColorTheme = {
    background: {
        base: "#111827",
        hover: "#1F2937",
        disabled: "#374151"
    },
    text: {
        base: "#F3F4F6",
        hover: "#FFFFFF",
        disabled: "#9CA3AF"
    },
    primary: {
        base: "#3B82F6",
        hover: "#2563EB",
        disabled: "#60A5FA"
    },
    secondary: {
        base: "#9CA3AF",
        hover: "#D1D5DB",
        disabled: "#4B5563"
    },
    accent: {
        base: "#34D399",
        hover: "#10B981",
        disabled: "#6EE7B7"
    },
    danger: {
        base: "#EF4444",
        hover: "#DC2626",
        disabled: "#F87171"
    },
    success: {
        base: "#22C55E",
        hover: "#16A34A",
        disabled: "#4ADE80"
    },
    warning: {
        base: "#F59E0B",
        hover: "#D97706",
        disabled: "#FBBF24"
    }
};

export const themeStyle = (theme) => {
    return `style='background-color: ${theme.background.base} !important;
    color: ${theme.text.base} !important;'`;
}

export const dangerStyle = (theme) => {
    return `style='background-color: ${theme.danger.base} !important;'`;
}

export const primaryStyle = (theme) => {
    return `style='background-color: ${theme.primary.base} !important;'`;
}