// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: 'clerk-expo-app',
    slug: 'clerk-expo-app',
    extra: {
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
  },
};