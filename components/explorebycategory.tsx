"use client";

import { Badge } from "@/components/ui/badge";
import { Layers, Cpu, Palette, Heart, Globe } from "lucide-react";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { name: "All", icon: Layers, color: "bg-muted text-foreground" },
  { name: "Technology", icon: Cpu, color: "bg-primary/10 text-primary" },
  {
    name: "Design",
    icon: Palette,
    color: "bg-accent/20 text-accent-foreground",
  },
  { name: "Lifestyle", icon: Heart, color: "bg-pink-100 text-pink-700" },
  { name: "Culture", icon: Globe, color: "bg-blue-100 text-blue-700" },
];

const CategoryFilter = ({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.name;

        return (
          <Badge
            key={category.name}
            onClick={() => onCategoryChange(category.name)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-smooth hover:scale-105 ${
              isActive
                ? "bg-primary text-primary-foreground shadow-elegant"
                : `${category.color} hover:shadow-card`
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {category.name}
          </Badge>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
