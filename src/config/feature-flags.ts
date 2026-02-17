export const FEATURE_FLAGS = {
   ADVANCED_ANALYTICS: "advanced_analytics",
   CUSTOM_BRANDING: "custom_branding",
   PRIORITY_SUPPORT: "priority_support",
   ANNOUNCEMENT_AI_ASSIST: "announcement_ai_assist",
} as const;

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];
