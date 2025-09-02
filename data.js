const instructorId = "68b51bf714e05386a9c113a2";
const categoryId = "68b509bad407b6ea39d7dd99";

const courses = [
    // IT
    {
        title: "Networking Fundamentals",
        slug: "networking-fundamentals",
        description: "Understand the basics of computer networks, protocols, and security.",
        categoryId: "68b509d5d407b6ea39d7dd9b",
        instructorId,
        price: 1500,
        discount: 10,
        thumbnail: "https://example.com/images/courses/networking.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=it01",
        status: "publish",
        ratingAvg: 4.2
    },
    {
        title: "Linux System Administration",
        slug: "linux-system-administration",
        description: "Master Linux commands, shell scripting, and server management.",
        categoryId: "68b509d5d407b6ea39d7dd9b",
        instructorId,
        price: 1800,
        discount: 15,
        thumbnail: "https://example.com/images/courses/linux.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=it02",
        status: "publish",
        ratingAvg: 4.6
    },
    {
        title: "Cloud Computing with AWS",
        slug: "cloud-computing-aws",
        description: "Learn to deploy and manage scalable apps on AWS cloud.",
        categoryId: "68b509d5d407b6ea39d7dd9b",
        instructorId,
        price: 2500,
        discount: 20,
        thumbnail: "https://example.com/images/courses/aws.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=it03",
        status: "publish",
        ratingAvg: 4.8
    },
    {
        title: "Cybersecurity Essentials",
        slug: "cybersecurity-essentials",
        description: "Learn ethical hacking, penetration testing, and securing IT systems.",
        categoryId: "68b509d5d407b6ea39d7dd9b",
        instructorId,
        price: 2200,
        discount: 15,
        thumbnail: "https://example.com/images/courses/cybersecurity.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=it04",
        status: "publish",
        ratingAvg: 4.5
    },
    {
        title: "DevOps for Beginners",
        slug: "devops-for-beginners",
        description: "CI/CD pipelines, Docker, Kubernetes, and automation tools.",
        categoryId: "68b509d5d407b6ea39d7dd9b",
        instructorId,
        price: 2700,
        discount: 25,
        thumbnail: "https://example.com/images/courses/devops.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=it05",
        status: "publish",
        ratingAvg: 4.7
    },

    // Marketing
    {
        title: "Digital Marketing Basics",
        slug: "digital-marketing-basics",
        description: "SEO, SEM, social media, and digital strategies.",
        categoryId: "68b509ebd407b6ea39d7dd9d",
        instructorId,
        price: 1200,
        discount: 10,
        thumbnail: "https://example.com/images/courses/digital-marketing.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=mkt01",
        status: "publish",
        ratingAvg: 4.1
    },
    {
        title: "Content Marketing Strategy",
        slug: "content-marketing-strategy",
        description: "Learn to create engaging content that converts.",
        categoryId: "68b509ebd407b6ea39d7dd9d",
        instructorId,
        price: 1400,
        discount: 12,
        thumbnail: "https://example.com/images/courses/content.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=mkt02",
        status: "publish",
        ratingAvg: 4.3
    },
    {
        title: "Social Media Ads Mastery",
        slug: "social-media-ads-mastery",
        description: "Facebook, Instagram, and TikTok Ads campaigns.",
        categoryId: "68b509ebd407b6ea39d7dd9d",
        instructorId,
        price: 1600,
        discount: 15,
        thumbnail: "https://example.com/images/courses/social-ads.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=mkt03",
        status: "publish",
        ratingAvg: 4.6
    },
    {
        title: "Email Marketing Automation",
        slug: "email-marketing-automation",
        description: "Automate campaigns with Mailchimp and HubSpot.",
        categoryId: "68b509ebd407b6ea39d7dd9d",
        instructorId,
        price: 1300,
        discount: 10,
        thumbnail: "https://example.com/images/courses/email.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=mkt04",
        status: "publish",
        ratingAvg: 4.0
    },
    {
        title: "Google Analytics Masterclass",
        slug: "google-analytics-masterclass",
        description: "Track and analyze performance using GA4.",
        categoryId: "68b509ebd407b6ea39d7dd9d",
        instructorId,
        price: 1700,
        discount: 15,
        thumbnail: "https://example.com/images/courses/ga.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=mkt05",
        status: "publish",
        ratingAvg: 4.4
    },

    // AI
    {
        title: "Introduction to Artificial Intelligence",
        slug: "intro-to-artificial-intelligence",
        description: "AI fundamentals, history, and applications.",
        categoryId: "68b509f8d407b6ea39d7dd9f",
        instructorId,
        price: 2000,
        discount: 10,
        thumbnail: "https://example.com/images/courses/ai-intro.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=ai01",
        status: "publish",
        ratingAvg: 4.2
    },
    {
        title: "Machine Learning with Python",
        slug: "machine-learning-python",
        description: "Supervised, unsupervised, and reinforcement learning.",
        categoryId: "68b509f8d407b6ea39d7dd9f",
        instructorId,
        price: 2500,
        discount: 20,
        thumbnail: "https://example.com/images/courses/ml.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=ai02",
        status: "publish",
        ratingAvg: 4.8
    },
    {
        title: "Deep Learning with TensorFlow",
        slug: "deep-learning-tensorflow",
        description: "Neural networks and computer vision with TF/Keras.",
        categoryId: "68b509f8d407b6ea39d7dd9f",
        instructorId,
        price: 2800,
        discount: 15,
        thumbnail: "https://example.com/images/courses/dl.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=ai03",
        status: "publish",
        ratingAvg: 4.7
    },
    {
        title: "Natural Language Processing",
        slug: "natural-language-processing",
        description: "Text processing, transformers, and chatbots.",
        categoryId: "68b509f8d407b6ea39d7dd9f",
        instructorId,
        price: 2600,
        discount: 18,
        thumbnail: "https://example.com/images/courses/nlp.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=ai04",
        status: "publish",
        ratingAvg: 4.5
    },
    {
        title: "AI in Business Applications",
        slug: "ai-in-business",
        description: "How AI transforms sales, marketing, and operations.",
        categoryId: "68b509f8d407b6ea39d7dd9f",
        instructorId,
        price: 2300,
        discount: 12,
        thumbnail: "https://example.com/images/courses/ai-business.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=ai05",
        status: "publish",
        ratingAvg: 4.3
    },

    // Sales
    {
        title: "Sales Fundamentals",
        slug: "sales-fundamentals",
        description: "Learn essential sales skills and communication.",
        categoryId: "68b50e486d28d8c80ee3157e",
        instructorId,
        price: 1000,
        discount: 10,
        thumbnail: "https://example.com/images/courses/sales-basics.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=sales01",
        status: "publish",
        ratingAvg: 4.0
    },
    {
        title: "B2B Sales Strategy",
        slug: "b2b-sales-strategy",
        description: "Develop effective strategies for B2B clients.",
        categoryId: "68b50e486d28d8c80ee3157e",
        instructorId,
        price: 1600,
        discount: 15,
        thumbnail: "https://example.com/images/courses/b2b.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=sales02",
        status: "publish",
        ratingAvg: 4.4
    },
    {
        title: "Negotiation Skills for Sales",
        slug: "negotiation-skills-sales",
        description: "Master negotiation tactics to close more deals.",
        categoryId: "68b50e486d28d8c80ee3157e",
        instructorId,
        price: 1800,
        discount: 12,
        thumbnail: "https://example.com/images/courses/negotiation.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=sales03",
        status: "publish",
        ratingAvg: 4.6
    },
    {
        title: "CRM Tools Mastery",
        slug: "crm-tools-mastery",
        description: "Leverage Salesforce, HubSpot, and Zoho CRM.",
        categoryId: "68b50e486d28d8c80ee3157e",
        instructorId,
        price: 1500,
        discount: 10,
        thumbnail: "https://example.com/images/courses/crm.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=sales04",
        status: "publish",
        ratingAvg: 4.2
    },
    {
        title: "Advanced Sales Psychology",
        slug: "advanced-sales-psychology",
        description: "Use psychology to understand and influence buyers.",
        categoryId: "68b50e486d28d8c80ee3157e",
        instructorId,
        price: 2000,
        discount: 18,
        thumbnail: "https://example.com/images/courses/psychology.jpg",
        promoVideoUrl: "https://youtube.com/watch?v=sales05",
        status: "publish",
        ratingAvg: 4.7
    }
];

module.exports = { courses };