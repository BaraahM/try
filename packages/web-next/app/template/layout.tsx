'use client';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { ApolloProvider } from '@apollo/client';
import { Notifications } from '@mantine/notifications';
import { theme } from '../../theme/theme';
import apolloClient from '../../lib/apolloClient';
import { AuthContextProvider } from '../../context/AuthContextProvider';
import { ModalProvider } from '../../context/ModalContext';
import { ReactNode, useEffect, useState } from 'react';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/notifications/styles.layer.css';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import '../globals.css';
import '../(editor)/editor-globals.css';
import localFont from 'next/font/local';

const geistSans = localFont({
  src: '../../public/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../../public/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// Clean editor layout without global header or sidebar
function EditorLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--mantine-color-gray-0)',
        display: 'flex',
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          backgroundColor: 'var(--mantine-color-gray-0)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function TemplateLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloProvider client={apolloClient}>
          <MantineProvider theme={theme} defaultColorScheme="light">
            <ModalsProvider>
              <Notifications position="bottom-right" />
              <AuthContextProvider>
                <ModalProvider>
                  <EditorLayout>{mounted ? children : null}</EditorLayout>
                </ModalProvider>
              </AuthContextProvider>
            </ModalsProvider>
          </MantineProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
