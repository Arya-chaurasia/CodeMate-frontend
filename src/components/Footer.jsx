import React from 'react'

export default function SimpleFooter(){
  return (
    <footer className="mt-12 border-t border-gray-200 dark:border-slate-800 bg-transparent fixed bottom-0">
      <div className="max-w-screen-xl mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} CodeMate — Built with ❤️
      </div>
    </footer>
  )
}