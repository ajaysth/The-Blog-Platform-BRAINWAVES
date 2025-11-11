"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const authors = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Tech Writer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    articles: 42,
    specialty: "AI & Machine Learning",
  },
  {
    id: 2,
    name: "David Chen",
    role: "Design Lead",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    articles: 38,
    specialty: "UX Design",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Lifestyle Blogger",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    articles: 56,
    specialty: "Wellness & Travel",
  },
  {
    id: 4,
    name: "James Thompson",
    role: "Culture Critic",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    articles: 29,
    specialty: "Arts & Society",
  },
];

const FeaturedAuthors = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-accent text-accent-foreground">
            Our Team
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Featured Authors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the talented writers behind our most engaging stories
          </p>
        </motion.div>

        {/* Authors Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {authors.map((author, index) => (
            <motion.div
              key={author.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={`/author/${author.id}`}>
                <div className="bg-card border border-border rounded-2xl p-6 text-center transition-smooth hover:shadow-elegant hover:border-primary/20">
                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary/10">
                      <AvatarImage src={author.avatar} alt={author.name} />
                      <AvatarFallback>
                        {author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  {/* Name & Role */}
                  <h3 className="font-display font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-smooth">
                    {author.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {author.role}
                  </p>

                  {/* Specialty */}
                  <Badge variant="secondary" className="mb-3">
                    {author.specialty}
                  </Badge>

                  {/* Article Count */}
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">
                      {author.articles}
                    </span>{" "}
                    Articles
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAuthors;
