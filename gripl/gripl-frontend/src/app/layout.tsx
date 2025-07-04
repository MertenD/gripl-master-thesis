import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from 'next-themes'
import "@/style/globals.css";
import "@/style/bpmn-js/bpmn-js.css";
import "@/style/bpmn-js/font-bpmn.css";
import "@/style/bpmn-js/diagram-js.css";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import AppSidebar from "@/components/navigation/app-sidebar";
import AppBreadCrumbs from "@/components/navigation/app-breadcrumbs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return <html lang="en" suppressHydrationWarning>
    <head>
        <title>GRIPL</title>
    </head>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen`} suppressHydrationWarning>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
      >
        <SidebarProvider className="h-full w-full">
          <AppSidebar />
          <SidebarInset className="h-full w-full">
            <header className="h-16 flex-shrink-0 px-2 flex flex-row items-center justify-start space-x-4 bg-sidebar sticky top-0 z-10">
              <SidebarTrigger/>
              <AppBreadCrumbs />
            </header>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </body>
  </html>
}
