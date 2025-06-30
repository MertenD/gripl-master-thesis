import React from "react";

export const dynamic = 'force-dynamic';

export default async function LabelingPageLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    return <div className="w-full h-full overflow-y-hidden">
        { children }
    </div>
}
