import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, Target, Zap } from "lucide-react";

const WhySection = () => {
  const reasons = [
    {
      icon: Clock,
      title: "Save Your Precious Time",
      description:
        "Why sit through a 40-minute video when the actual valuable content could be condensed into 3 minutes? Get straight to the point.",
    },
    {
      icon: DollarSign,
      title: "Skip the Revenue Padding",
      description:
        "Many creators stretch content to maximize ad revenue. We help you extract the actual value without the fluff and filler.",
    },
    {
      icon: Target,
      title: "Get to the Point",
      description:
        "No more waiting through long introductions, sponsorship segments, and repetitive explanations. Just the core insights you need.",
    },
    {
      icon: Zap,
      title: "Instant Understanding",
      description:
        "Quickly grasp the main concepts, key takeaways, and actionable insights from any video in seconds, not minutes.",
    },
  ];

  return (
    <section
      id="why-section"
      className="py-20 px-4 bg-gradient-to-br from-youtube-red-light/30 to-black relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Why <span className="text-youtube-red">tl;dw</span>?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Oftentimes creators talk... really... slowly... and edge around a
            topic so a 3-minute point becomes a 40-minute video, giving them
            lots of ad revenue. But we don&apos;t all have time to sit through a
            40-minute video uninterrupted.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <Card
                key={index}
                className="p-6 h-full bg-gradient-to-br from-gray-900/50 to-youtube-red-light/10 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-youtube-red/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-youtube-red" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-white">
                    {reason.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {reason.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-youtube-red/5 to-youtube-red-light/20 border-youtube-red/20">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold mb-4 text-youtube-red">
                Ready to reclaim your time?
              </h3>
              <p className="text-lg text-gray-400">
                Get ahead of the curve, start saving hours every week by getting
                straight to the valuable content!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
