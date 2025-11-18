import "./globals.css";

export const metadata = {
  title: "AI Landing Page Generator",
  description: "Generate a full startup landing page from a simple idea using AI."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
