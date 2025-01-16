import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yoxeghgqwyhavtlzsrjb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlveGVnaGdxd3loYXZ0bHpzcmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NjUwNDcsImV4cCI6MjA0NTU0MTA0N30.NegtXsNzySa62SQOEM4lWlDhIpTUxf_R-_ai4g8hJk8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);