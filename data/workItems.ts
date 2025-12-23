export interface WorkItem {
  client: string;
  campaign: string;
  year: number;
  campaignType: string;
  role: string[];
  scope: string[];
  markets: string[];
  delivery: string;
  challenge: string;
  videoUrl: string;
  posterUrl: string;
  slug: string;
}

export const workItems: WorkItem[] = [
  {
    client: "NIVEA",
    campaign: "Global Campaign Infrastructure",
    year: 2022,
    campaignType: "Multi-year Campaign System",
    role: ["Post Production", "Color Grading", "VFX"],
    scope: ["Broadcast", "Digital", "Social"],
    markets: ["Global", "25+ Markets"],
    delivery: "10,000+ Assets",
    challenge: "Managing high-volume versioning across multiple markets while maintaining brand consistency and quality standards.",
    videoUrl: "https://example.com/videos/nivea-campaign.mp4",
    posterUrl: "/assets/case1.png",
    slug: "nivea-global-campaign-infrastructure"
  },
  {
    client: "Nestlé",
    campaign: "Product Textures",
    year: 2023,
    campaignType: "Product Visualization",
    role: ["VFX", "Color Grading"],
    scope: ["Product Lines", "Multiple Markets"],
    markets: ["Global"],
    delivery: "High-quality Product Assets",
    challenge: "Creating photorealistic product textures and visualizations across multiple product lines.",
    videoUrl: "https://example.com/videos/nestle-product-textures.mp4",
    posterUrl: "/assets/case2.png",
    slug: "nestle-product-textures"
  },
  {
    client: "NIVEA",
    campaign: "Black and White Checkmate",
    year: 2023,
    campaignType: "TVC Campaign",
    role: ["Editing", "Color Grading"],
    scope: ["Broadcast", "Digital"],
    markets: ["Multiple Markets"],
    delivery: "Campaign Assets",
    challenge: "Delivering a high-impact campaign with quick turnaround times.",
    videoUrl: "https://example.com/videos/nivea-checkmate-1.mp4",
    posterUrl: "/assets/campaign1.png",
    slug: "nivea-black-white-checkmate-1"
  },
  {
    client: "NIVEA",
    campaign: "Q10 Dual Action Serum",
    year: 2024,
    campaignType: "Global TVC Adaptation",
    role: ["Post-Production"],
    scope: ["Editing", "Color Grading"],
    markets: ["Europe"],
    delivery: "TV Commercial",
    challenge: "Delivering a high-impact campaign with quick turnaround times.",
    videoUrl: "https://example.com/videos/nivea-checkmate-2.mp4",
    posterUrl: "/assets/campaign2.png",
    slug: "nivea-q10-dual-action-serum"
  },
  {
    client: "NIVEA",
    campaign: "Body Milk",
    year: 2025,
    campaignType: "Global TVC Adaptation",
    role: ["Post-Production"],
    scope: ["Editing", "VFX"],
    markets: ["Europe"],
    delivery: "Digital Ads",
    challenge: "Delivering a high-impact campaign with quick turnaround times.",
    videoUrl: "https://example.com/videos/nivea-checkmate-3.mp4",
    posterUrl: "/assets/campaign3.png",
    slug: "nivea-body-milk"
  },
  {
    client: "NIVEA Men",
    campaign: "Black & White Real Madrid",
    year: 2024,
    campaignType: "Global TVC Adaptation",
    role: ["Post-Production"],
    scope: ["Editing", "Sound Design"],
    markets: ["Europe"],
    delivery: "Social Media Content",
    challenge: "Delivering a high-impact campaign with quick turnaround times.",
    videoUrl: "https://example.com/videos/nivea-checkmate-4.mp4",
    posterUrl: "/assets/campaign4.png",
    slug: "nivea-men-black-white-real-madrid"
  },
  {
    client: "NIVEA",
    campaign: "Radiant & Beauty",
    year: 2021,
    campaignType: "Global TVC Adaptation",
    role: ["Post-Production"],
    scope: ["Editing", "Color Grading", "Motion"],
    markets: ["APAC", "Americas"],
    delivery: "Regional Campaign Assets",
    challenge: "Delivering a high-impact campaign with quick turnaround times.",
    videoUrl: "https://example.com/videos/nivea-checkmate-5.mp4",
    posterUrl: "/assets/campaign5.png",
    slug: "nivea-radiant-beauty"
  },
  {
    client: "NIVEA",
    campaign: "Micellar Water",
    year: 2023,
    campaignType: "Global TVC Adaptation",
    role: ["Post-Production"],
    scope: ["Editing", "Color Grading", "VFX"],
    markets: ["Global"],
    delivery: "Extended Format Content",
    challenge: "Delivering a high-impact campaign with quick turnaround times.",
    videoUrl: "https://example.com/videos/nivea-checkmate-6.mp4",
    posterUrl: "/assets/campaign6.png",
    slug: "nivea-micellar-water"
  }
];

export function getWorkItemBySlug(slug: string): WorkItem | undefined {
  return workItems.find(item => item.slug === slug);
}

export function getCaseStudies(): WorkItem[] {
  return workItems.slice(0, 2);
}

export function getCampaignRange(): WorkItem[] {
  return workItems.slice(2);
}

