"use client"

import {ReactNode, useEffect, useState} from "react";
import Image from "next/image";
import {useTheme} from "next-themes";

interface UseLoadPreviewImageProps {
    testCaseId: number
    correctActivityIds?: string[]
    falsePositiveIds?: string[]
    falseNegativeIds?: string[]
    imageClassName?: string
}

export default function useLoadPreviewImage({testCaseId, correctActivityIds, falsePositiveIds, falseNegativeIds, imageClassName }: UseLoadPreviewImageProps) {
    const { resolvedTheme } = useTheme()
    const [previewImage, setPreviewImage] = useState<ReactNode | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchSvgPreview = async () => {
            setIsLoading(true);
            try {
                const relativeImageUrl = `/api/dataset/${testCaseId}/preview?theme=${resolvedTheme}` +
                    (correctActivityIds ? `&correctIds=${correctActivityIds.join(",")}` : "") +
                    (falsePositiveIds ? `&falsePositiveIds=${falsePositiveIds.join(",")}` : "") +
                    (falseNegativeIds ? `&falseNegativeIds=${falseNegativeIds.join(",")}` : "") +
                    // The salt is used to prevent caching issues with the preview image
                    `&salt=${Math.floor(Math.random() * 99999)}`

                const response = await fetch(relativeImageUrl)

                if (!response.ok) {
                    throw new Error(`Failed to fetch preview for url "${relativeImageUrl}": ${response.statusText}`)
                }

                const svgText = await response.text()
                const image = <Image
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`}
                    alt={`Preview of Test Case`}
                    width={100}
                    height={100}
                    className={imageClassName || "w-auto"}
                />
                setPreviewImage(image)
            } catch (error) {
                console.error(error)
                setPreviewImage(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSvgPreview().then()
    }, [testCaseId, correctActivityIds, falsePositiveIds, falseNegativeIds, resolvedTheme, imageClassName])

    return {
        previewImage,
        isLoading
    }
}