"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";

const ShareSection = () => {
  const shareUrl = "https://www.youtubetldw.com/";
  const shareText =
    "Check out this awesome YouTube summarizer! No login, no BS. #tldw #youtube #ai";
  const shareTitle = "tl;dw - No Login, No BS YouTube Summaries";

  const socialLinks = [
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5 mr-2" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5 mr-2" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5 mr-2" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        shareUrl
      )}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(
        shareText
      )}`,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <section id="share-section" className="py-20">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-4">Spread The Word</h2>
        <p className="text-xl text-gray-400 mb-8">
          If you find this tool useful, please share it with others!
        </p>
        <div className="flex justify-center items-center flex-wrap gap-4">
          {socialLinks.map((link) => (
            <Button
              asChild
              key={link.name}
              size="lg"
              className="bg-red-600 hover:bg-red-700"
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.icon}
                {link.name}
              </a>
            </Button>
          ))}
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700"
            onClick={copyToClipboard}
          >
            <LinkIcon className="w-5 h-5 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShareSection;
