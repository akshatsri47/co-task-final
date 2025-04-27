// app/resources/page.tsx
import React from 'react';
import Link from 'next/link';

interface ResourceCard {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export default function ResourcesPage() {
  // Resource categories with items
  const resourceCategories = [
    {
      title: "Getting Started Guides",
      items: [
        {
          title: "CoTask Quickstart Trail",
          description: "A 10-minute introduction to setting up your first adventure in CoTask",
          icon: "map",
          link: "/resources/quickstart"
        },
        {
          title: "Team Expedition Planning",
          description: "How to configure CoTask for collaborative team projects",
          icon: "users",
          link: "/resources/team-planning"
        },
        {
          title: "The AI Assistant Guide",
          description: "Harness the full potential of our AI-powered features",
          icon: "robot",
          link: "/resources/ai-guide"
        }
      ]
    },
    {
      title: "Templates",
      items: [
        {
          title: "Project Summit Templates",
          description: "Pre-designed journeys for common project types",
          icon: "mountain",
          link: "/resources/project-templates"
        },
        {
          title: "Personal Quest Maps",
          description: "Templates for individual productivity tracking",
          icon: "compass",
          link: "/resources/personal-templates"
        },
        {
          title: "Team Expedition Frameworks",
          description: "Collaborative workflows for different team sizes and goals",
          icon: "flag",
          link: "/resources/team-templates"
        }
      ]
    },
    {
      title: "Knowledge Base",
      items: [
        {
          title: "Feature Compass",
          description: "Detailed explanations of all CoTask features and how to use them",
          icon: "book-open",
          link: "/resources/features"
        },
        {
          title: "Integration Pathways",
          description: "Guides for connecting CoTask with your existing tools",
          icon: "link",
          link: "/resources/integrations"
        },
        {
          title: "Automation Shortcuts",
          description: "Time-saving workflows and triggers to automate routine tasks",
          icon: "zap",
          link: "/resources/automation"
        }
      ]
    },
    {
      title: "Best Practices",
      items: [
        {
          title: "Trail Markers",
          description: "Weekly productivity tips from the CoTask team",
          icon: "bookmark",
          link: "/resources/tips"
        },
        {
          title: "Campfire Stories",
          description: "Case studies and success stories from CoTask users",
          icon: "file-text",
          link: "/resources/case-studies"
        },
        {
          title: "The Productivity Field Guide",
          description: "In-depth articles on modern work methodologies",
          icon: "clipboard",
          link: "/resources/field-guide"
        }
      ]
    },
    {
      title: "Webinars & Training",
      items: [
        {
          title: "Monthly Expedition Webinars",
          description: "Live demonstrations of advanced features",
          icon: "video",
          link: "/resources/webinars"
        },
        {
          title: "Team Guide Certification",
          description: "Training programs for CoTask champions within organizations",
          icon: "award",
          link: "/resources/certification"
        },
        {
          title: "Custom Adventure Planning",
          description: "Personalized consultation sessions for enterprise customers",
          icon: "compass",
          link: "/resources/custom-planning"
        }
      ]
    }
  ];

  // Helper function to render the appropriate icon
  const renderIcon = (iconName: string) => {
    // This would be better with an icon library like heroicons or feather icons
    // Here's a simple switch case as placeholder
    switch (iconName) {
      case 'map':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      case 'mountain':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'compass':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        );
      // Default icon for other cases
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="#0D9488" strokeWidth="0.5" />
            <polygon points="50,15 85,30 85,70 50,85 15,70 15,30" fill="none" stroke="#0D9488" strokeWidth="0.5" />
            <polygon points="50,25 75,35 75,65 50,75 25,65 25,35" fill="none" stroke="#0D9488" strokeWidth="0.5" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Resources</h1>
          <p className="text-xl text-gray-700 mb-10">
            Equip yourself for your productivity journey with our comprehensive collection of guides, templates, and insights.
          </p>
          
          <div className="w-24 h-2 bg-teal-500 mx-auto mb-12 rounded-full"></div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {resourceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-8 h-1 bg-teal-500 mr-3"></span>
                {category.title}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => (
                  <Link 
                    href={item.link} 
                    key={itemIndex}
                    className="bg-white rounded-lg p-6 shadow-md transition-all hover:shadow-lg hover:translate-y-[-4px]"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                        {renderIcon(item.icon)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Need Additional Support?</h2>
          <p className="text-lg mb-8">
            Contact our Trail Guides at support@cotask.com or schedule a one-on-one pathfinding session.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-teal-800 rounded-md font-medium hover:bg-teal-100 transition-colors">
              Contact Support
            </button>
            <button className="px-6 py-3 bg-teal-700 text-white rounded-md font-medium hover:bg-teal-600 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}