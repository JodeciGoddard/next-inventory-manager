import React, { useState, useEffect } from 'react';
import { FaLock } from 'react-icons/fa'
import { SiShopware } from 'react-icons/si'
import { useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router';
import { useStateContext } from '../contexts/ContextProvider';
import { ThreeDots } from 'react-loader-spinner'
import { supabaseClient } from '@supabase/auth-helpers-nextjs';


const Register = () => {

    let { user, error: err } = useUser();

    const router = useRouter();

    const { currentColor } = useStateContext();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [cred, setCred] = useState({
        email: '',
        password: '',
        confirm: '',
        name: '',
    });

    useEffect(() => {
        if (user) {
            //youre already logged in
            //TODO: LOGIN TOAST
            console.log('User logged in', user);
            router.push('/');
        }
    }, [user])

    const updateCred = (e) => {
        setCred(prev => { return { ...prev, [e.target.name]: e.target.value } });
        setError('');
    }



    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (cred.password !== cred.confirm) {
            setError('Please confirm your password! Passwords must match');
            setLoading(false);
            return;
        }

        let { user: myUser, error: myError } = await supabaseClient.auth.signUp({
            email: cred.email,
            password: cred.password
        },
            {
                data: {
                    fullname: cred.name,
                    avatarColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                }
            }
        )
        setLoading(false);

        if (myError) {
            setError(myError.message);
            console.log('Error: ', myError);
            return;
        }

        if (myUser) {
            console.log('login success', myUser);
            //TTODO login toast
            router.push('/');
        }


    }

    return (
        <div className='mt-12'>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <SiShopware
                            className="mx-auto h-12 w-auto"
                            style={{ color: currentColor }}
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Register for a New Account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Or{' '}
                            <a href="/signin" className={`font-medium hover:opacity-80`} style={{ color: currentColor }}>
                                sign into an exsisting account
                            </a>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={onSubmit}>
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="-space-y-px rounded-md shadow-sm">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Full Name
                                </label>
                                <input
                                    id="name-address"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-neutral-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Full Name"
                                    onChange={updateCred}
                                />
                            </div>
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="relative block w-full appearance-none rounded-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-neutral-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Email address"
                                    onChange={updateCred}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="relative block w-full appearance-none rounded-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-neutral-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Password"
                                    onChange={updateCred}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm" className="sr-only">
                                    Confirm password
                                </label>
                                <input
                                    id="confirm"
                                    name="confirm"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-neutral-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Confirm"
                                    onChange={updateCred}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">



                        </div>

                        {error !== '' && <div className='text-sm text-red-400 font-bold'>
                            <p>{error}</p>
                        </div>}

                        <div>
                            {!loading && <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white hover:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                style={{ backgroundColor: currentColor }}
                            >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FaLock className="h-5 w-5  group-hover:opacity-40" aria-hidden="true" style={{ color: "#ffffff60" }} />
                                </span>
                                Create Account
                            </button>}

                            <ThreeDots
                                height="80"
                                width="80"
                                radius="9"
                                color={currentColor}
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{ justifyContent: 'center' }}
                                wrapperClassName=""
                                visible={loading}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;