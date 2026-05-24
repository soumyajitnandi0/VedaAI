import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '../components/Sidebar';
import SocketProvider from '../components/SocketProvider';

export const metadata: Metadata = {
  title: 'VedaAI Assessment Creator',
  description: 'AI Question Paper Generator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="layout-container">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
        <SocketProvider />
      </body>
    </html>
  );
}
