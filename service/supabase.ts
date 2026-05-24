import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dkhwmjbcbdftvsosuuwj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRraHdtamJjYmRmdHZzb3N1dXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDY3MzcsImV4cCI6MjA5NTE4MjczN30.wXOgl-P3UgzmYjI6dxzqubM6MgVdWsudMgVBS3NqAhQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});