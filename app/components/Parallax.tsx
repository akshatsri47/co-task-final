"use client";
import { useState, useEffect } from "react";
import Land from "../../public/land.svg";
import Mountain from "../../public/mountain.svg";
import Cloud from "../../public/clouds.svg";
import Tree from "../../public/trees.svg";
import Man from "../../public/man.svg";
import Land2 from "../../public/land2.svg";
import Land3 from "../../public/land3.svg";
import { Parallax, ParallaxProvider } from "react-scroll-parallax";
import { motion } from "framer-motion";

export default function ParallaxScene() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const features = [
    {
      title: "AI-Powered Tasks",
      description:
        "Smart task management that learns your work style and priorities",
      icon: "🤖",
    },
    {
      title: "Adventure Points",
      description:
        "Turn productivity into an adventure with gamified progress tracking",
      icon: "🏔️",
    },
    {
      title: "Team Expeditions",
      description:
        "Collaborate on projects as teams scaling mountains together",
      icon: "👥",
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Product Manager",
      company: "TechFusion",
      text: "CoTask transformed how our team handles projects. The gamification aspect keeps everyone motivated and the AI suggestions save us hours each week.",
      avatar: "A",
    },
    {
      name: "Sarah Johnson",
      role: "Creative Director",
      company: "DesignWave",
      text: "The adventure-based approach to task management makes what was once tedious work actually enjoyable. Our team productivity has increased by 40%.",
      avatar: "S",
    },
    {
      name: "Michael Torres",
      role: "Team Lead",
      company: "CloudSystems",
      text: "I've tried dozens of productivity tools, but CoTask is the first one my entire team actually enjoys using consistently.",
      avatar: "M",
    },
  ];

  const pricingPlans = [
    {
      name: "Explorer",
      price: "Free",
      features: [
        "Basic task management",
        "Limited adventure points",
        "Personal projects",
        "Colabrative projects",
        "Community support",
      ],
      popular: false,
    },
    {
      name: "Adventurer",
      price: "$12",
      period: "monthly",
      features: [
        "Advanced AI task prioritization",
        "Unlimited adventure points",
        "Up to 5 team members",
        "Basic analytics",
        "Email support",
      ],
      popular: true,
    },
    {
      name: "Expedition Leader",
      price: "$29",
      period: "monthly",
      features: [
        "Everything in Adventurer",
        "Advanced team analytics",
        "Custom integrations",
        "Unlimited team members",
        "Priority support",
        "Custom adventure themes",
      ],
      popular: false,
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <ParallaxProvider>
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-transparent z-0" />
        
        <Mountain className="absolute bottom-20 object-left" />
        <Cloud className="absolute left-40" />
        <Tree className="absolute bottom-18 left-36 z-10" />
        
        <div className="absolute top-40 left-30 z-10">
          <Parallax
            translateX={[0, 250]}
            translateY={[0, 60]}
            speed={-5}
            startScroll={0}
            endScroll={500}
          >
            <Man className="h-40 w-40 md:h-64 md:w-64 lg:h-96 lg:w-96" />
          </Parallax>
        </div>
        
        <Land className="absolute left-0 bottom-18" />
        <Land2 className="absolute right-0 bottom-[-20%]" />
        <Land3 className="absolute left-0 bottom-[-40%]" />
        <Land2 className="absolute right-0 bottom-[-60%]" />
        <Land3 className="absolute left-0 bottom-[-80%]" />
        <Land2 className="absolute right-0 bottom-[-100%]" />
        <Land3 className="absolute left-0 bottom-[-120%]" />
        <Land2 className="absolute right-0 bottom-[-140%]" />
        <Land3 className="absolute left-0 bottom-[-160%]" />

        {/* Hero content */}
        
      </div>

      {/* Feature Cards Section */}
      <div className="relative z-20 mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
        >
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-4">
            How CoTask Transforms Your Workflow
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Turn mundane task management into an exciting adventure with our intuitive platform designed for modern teams.
          </p>
        </motion.div>

        {/* Container for feature cards */}
        <div className="space-y-16 md:space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              variants={fadeIn}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
              } items-center gap-8`}
            >
              <div className="flex flex-col items-center text-center backdrop-blur-md bg-white/30 p-8 rounded-lg shadow-lg transform transition-transform hover:scale-105 w-full md:w-1/2">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg">{feature.description}</p>
              </div>

              {/* Feature visualization */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-8xl">{feature.icon}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-20 bg-gray-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How CoTask Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A simple three-step process to transform your workflow and productivity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Mountain",
                description: "Set up your projects and tasks as mountains to climb",
                icon: "🗻",
              },
              {
                step: "2",
                title: "Form Your Team",
                description: "Invite teammates to join your expedition",
                icon: "👪",
              },
              {
                step: "3",
                title: "Conquer Together",
                description: "Work collaboratively, earn points, and track progress",
                icon: "🚩",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                variants={fadeIn}
                className="bg-white rounded-lg shadow-lg p-8 text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-5xl mb-4 mx-auto">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative z-20 py-16 md:py-24 max-w-6xl mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Explorers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of teams who have transformed their productivity journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              variants={fadeIn}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="relative z-20 bg-gray-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Path</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Flexible plans for teams of all sizes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                variants={fadeIn}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  plan.popular ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-center py-2 font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600">/{plan.period}</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featIndex) => (
                      <li key={featIndex} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 rounded-lg font-medium ${
                      plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                    } transition-colors`}
                  >
                    {plan.popular ? "Start Now" : "Get Started"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-20 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of teams who have transformed their workflow into an exciting journey
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-blue-400">Co</span>Task
              </h3>
              <p className="text-gray-400 mb-4">
                Transform productivity into adventure
              </p>
              <div className="flex space-x-4">
                {["Twitter", "LinkedIn", "Facebook", "Instagram"].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Updates", "Roadmap"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Tutorials", "Blog", "Community", "Support"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Contact", "Privacy", "Terms"]
              }
            ].map((column, index) => (
              <div key={index}>
                <h4 className="font-medium mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} CoTask. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </ParallaxProvider>
  );
}