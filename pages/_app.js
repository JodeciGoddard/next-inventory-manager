import '../styles/globals.css'
import '../styles/App.css';
import { UserProvider } from '@supabase/auth-helpers-react'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import Dashboard from '../components/Dashboard';
import { ContextProvider } from '../contexts/ContextProvider';



export default function MyApp({ Component, pageProps }) {

  return (
    <ContextProvider>
      <UserProvider supabaseClient={supabaseClient}>
        <Dashboard>
          <Component {...pageProps} />
        </Dashboard>
      </UserProvider>
    </ContextProvider>

  )
}


