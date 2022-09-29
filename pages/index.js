import React, { useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Header } from '../components';
import { withPageAuth, getUser } from '@supabase/auth-helpers-nextjs';

export default function Home({ user }) {

  let router = useRouter();

  useEffect(() => {


  }, [user]);


  return (
    <>
      <div className="m-2 md:m-10 sm:mt-14 sm:ml-4 sm:p-4 p-2 md:p-10 bg-white 
      rounded-3xl dark:bg-secondary-dark-bg">
        <Header
          title="Welcome"
          category="User"
        />
        <div className='flex max-w-screen-md overflow-hidden'>
          <pre>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </>

  )
}


export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
  async getServerSideProps(ctx) {
    // Access the user object
    const { user, accessToken } = await getUser(ctx)
    return { props: user }
  },
})