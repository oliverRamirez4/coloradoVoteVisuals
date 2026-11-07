'use client'
import React from 'react';
import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className="bg-white rounded-lg shadow my-4 dark:bg-gray-800">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://github.com/ColoradoCollege-MathCS/big-nasty" className="hover:underline">Big Nasty™</a>
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                <li>
                    <Link href="/about" className="hover:underline me-4 md:me-6">About</Link>
                </li>
                <li>
                    <Link href="/contact" className="hover:underline">Contact</Link>
                </li>
            </ul>
            </div>

        </footer>

    )
}
