import React from "react";

// @ts-ignore
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import "@/style/swagger/swagger-overrides.css"

export const dynamic = 'force-dynamic';

export default function ApiDocsPage() {

    return <SwaggerUI url="/api/v3/api-docs.yaml" />
}