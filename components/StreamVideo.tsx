"use client";

import React from "react";

interface StreamVideoProps {
  videoId: string;
  autoplay?: boolean;
}

export default function StreamVideo({ videoId, autoplay = false }: StreamVideoProps) {
  // Validate video ID - don't render if it's a placeholder or invalid
  if (!videoId || videoId.trim() === '' || videoId.includes('your-cloudflare-stream-video-id') || videoId.includes('placeholder')) {
    return null;
  }

  // Build the iframe URL with Cloudflare Stream embed
  const baseUrl = `https://iframe.videodelivery.net/${videoId}`;
  const params = new URLSearchParams();
  
  if (autoplay) {
    params.append("autoplay", "true");
    params.append("muted", "true");
  }
  
  const iframeUrl = params.toString() 
    ? `${baseUrl}?${params.toString()}` 
    : baseUrl;

  return (
    <iframe
      src={iframeUrl}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
        display: "block"
      }}
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
      allowFullScreen
      title="Video player"
    />
  );
}

