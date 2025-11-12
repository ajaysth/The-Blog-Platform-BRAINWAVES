"use client"; // Needed for Framer Motion + Shadcn UI interactivity

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // adjust to your project structure

const faqs = [
  {
    question: "What topics does BrainWaves cover?",
    answer:
      "BrainWaves covers a wide range of topics including technology, science, psychology, business, personal development, culture, and more. Our diverse team of writers ensures you'll always find something that matches your interests.",
  },
  {
    question: "How often is new content published?",
    answer:
      "We publish fresh content daily, with multiple articles released throughout the week. You can subscribe to our newsletter to get the latest articles delivered directly to your inbox.",
  },
  {
    question: "Can I contribute articles to BrainWaves?",
    answer:
      "Yes! We're always looking for passionate writers and experts to contribute to our platform. You can submit your article proposals through our submission form, and our editorial team will review them for publication.",
  },
  {
    question: "Is there a premium membership?",
    answer:
      "BrainWaves offers both free and premium memberships. While many articles are free to read, premium members get access to exclusive in-depth content, ad-free reading, early access to new articles, and more.",
  },
  {
    question: "How can I stay updated with new articles?",
    answer:
      "You can stay updated by subscribing to our newsletter, following us on social media, or bookmarking your favorite categories. We also offer personalized recommendations based on your reading history.",
  },
  {
    question: "Can I download articles for offline reading?",
    answer:
      "Yes! Premium members can download articles in PDF format for offline reading. This feature is perfect for reading on the go or saving your favorite pieces for future reference.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

export default function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about BrainWaves
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="border border-border/50 rounded-lg px-6 hover:border-accent/50 transition-colors"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:text-accent">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
