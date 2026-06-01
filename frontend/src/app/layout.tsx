import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'V2PSL — Voice to Pakistani Sign Language',
  description:
    'Translate English text and voice to Pakistani Sign Language using a 3D avatar powered by inverse kinematics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
