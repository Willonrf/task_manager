import Provider from "../trpc/Provider";
import { Toaster } from "sonner";
import './globals.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className="bg-gray-50 min-h-screen">
                <Provider>{children}</Provider>
                <Toaster position="bottom-right" richColors />
            </body>
        </html>
    )
}