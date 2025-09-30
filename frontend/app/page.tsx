"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link"; // Import Link for navigation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Mail,
  Github,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";
import WhySection from "@/components/why-section";
import ShareSection from "@/components/share-section";
import { toast } from "sonner";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const getYouTubeVideoId = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?.*?v=|embed\/|v\/|)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const validateYouTubeUrl = (url: string) => {
    return getYouTubeVideoId(url) !== null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return "";
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailUrl("");
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError("");

    if (newUrl && !validateYouTubeUrl(newUrl)) {
      setIsValidUrl(false);
    } else {
      setIsValidUrl(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);
    const thumbnail = getYouTubeThumbnail(url);
    setThumbnailUrl(thumbnail);
    setSummary("");
    setError("");

    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(
        `https://tl-dw.fly.dev/sum?url=${encodedUrl}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          setSummary((prev) => prev + chunk);
        }
      }
    } catch (err) {
      setError("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copySummary = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      toast.success("Summary copied to clipboard!");
    }
  };
  return (
    <div className="bg-black text-white relative overflow-hidden">
      {/* Hero and Header Container */}
      <div className="min-h-screen flex flex-col relative">
        {/* Circuit Board Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none">
            <defs>
              <pattern
                id="circuit"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M20 20h60v60h-60z"
                  stroke="#ef4444"
                  strokeWidth="0.5"
                  fill="none"
                />
                <circle cx="20" cy="20" r="2" fill="#ef4444" />
                <circle cx="80" cy="20" r="2" fill="#ef4444" />
                <circle cx="20" cy="80" r="2" fill="#ef4444" />
                <circle cx="80" cy="80" r="2" fill="#ef4444" />
                <path
                  d="M20 20L80 20M20 80L80 80M20 20L20 80M80 20L80 80"
                  stroke="#ef4444"
                  strokeWidth="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src="/logo-tech.png"
                  alt="tl;dw logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <h1 className="text-2xl font-bold text-white">TL;DW</h1>
              </div>
              <nav className="flex items-center space-x-6">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="#why-section"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Why tl;dw?
                </Link>
                <Link
                  href="#contact-section"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center">
          <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl mx-auto text-center">
              {/* Logo and Title */}
              <div className="mb-16">
                <div className="flex justify-center mb-12">
                  <Image
                    src="/logo-tech.png"
                    alt="tl;dw logo"
                    width={300}
                    height={300}
                    className="w-75 h-75"
                  />
                </div>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                  AI-powered YouTube video summaries. Get to the point
                  instantly.
                </p>
              </div>

              {/* URL Input Form */}
              <div className="max-w-2xl mx-auto mb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center space-x-3">
                        <CheckCircle
                          className={`w-5 h-5 ${
                            isValidUrl && url
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        />
                        <Input
                          type="url"
                          placeholder="YouTube link"
                          value={url}
                          onChange={handleUrlChange}
                          className="bg-transparent border-none text-white placeholder-gray-500 text-lg focus:ring-0 focus:outline-none p-0"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {!isValidUrl && url && (
                      <div className="flex items-center text-red-400 text-sm mt-2">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Please enter a valid YouTube URL
                      </div>
                    )}

                    {error && (
                      <div className="flex items-center text-red-400 text-sm mt-2">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {error}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold rounded-xl"
                    disabled={isLoading || !isValidUrl || !url}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Generating Summary...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Summarize Video
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Streaming Indicator */}
              {isLoading && (
                <div className="mb-8">
                  <ChevronDown className="w-6 h-6 text-green-500 mx-auto mb-2 animate-bounce" />
                  <p className="text-green-500 font-semibold">
                    Streaming current call
                  </p>
                </div>
              )}

              {/* Summary Display */}
              {summary && (
                <Card className="max-w-4xl mx-auto text-left bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4 w-full">
  <div className="flex items-center">
    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
    <h3 className="text-lg font-semibold text-white">Summary</h3>
  </div>
  <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={copySummary}>
    <LinkIcon className="w-4 h-4 mr-2" />
    Copy
  </Button>
</div>
                    <div className="prose max-w-none">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {summary}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* YouTube Thumbnail */}
              {thumbnailUrl && (
                <div className="max-w-2xl mx-auto mb-8">
                  <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <Image
                        src={thumbnailUrl || "/placeholder.svg"}
                        alt="YouTube video thumbnail"
                        className="w-full rounded-lg"
                        width={1280}
                        height={720}
                        onError={(e) => {
                          // Fallback to default thumbnail if maxresdefault fails
                          e.currentTarget.src = thumbnailUrl.replace(
                            "maxresdefault",
                            "hqdefault"
                          );
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <WhySection />

      {/* Contact Section */}
      <section id="contact-section" className="py-20 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-xl text-gray-400 mb-8">
            We&apos;d love to hear your feedback.
          </p>
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
            <a href="mailto:dzirinsky+feedback@gmail.com">
              <Mail className="w-5 h-5 mr-2" />
              Send Feedback
            </a>
          </Button>
        </div>
      </section>

      <ShareSection />

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image
                src="/logo-tech.png"
                alt="tl;dw logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-white">TL;DW</span>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-gray-500 text-center md:text-right">
                © 2025 David Zirinsky. Making YouTube consumption efficient.
              </p>
              <a
                href="https://github.com/DavidZirinsky/tldw-site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
