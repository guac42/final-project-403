import type {Metadata} from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import SearchBar from "@/components/search-bar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Movie Search Db",
    description: "Super complicated, better than IMDb",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <header className="bg-primary-foreground shadow p-4 flex justify-center sticky top-0 z-50">
                        <SearchBar />
                    </header>
                    <main>
                        {children}
                        <div className="fixed bottom-5 right-5">
                            <ThemeToggle />
                        </div>
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
