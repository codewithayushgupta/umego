// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Umego',
  description: 'Hang out, meet up, and vibe!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
          <main className="flex-grow pb-16">{children}</main>

          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t shadow-md flex justify-around py-2 z-50">
            <NavIcon href="/" emoji="🏠" label="Home" />
            <NavIcon href="/create-hangout" emoji="➕" label="Create" />
            <NavIcon href="/my-hangout-requests" emoji="😎" label="my hangout" />
            <NavIcon href="/glow" emoji="💬" label="Chat" />
            <NavIcon href="/profile" emoji="👤" label="Profile" />
          </nav>
        </div>
      </body>
    </html>
  );
}

function NavIcon({ href, emoji, label }) {
  return (
    <a href={href} className="flex flex-col items-center text-sm text-gray-600 hover:text-black">
      <span className="text-2xl">{emoji}</span>
      {label}
    </a>
  );
}
