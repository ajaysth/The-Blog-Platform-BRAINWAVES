"use client";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";

type AnimatedStatProps = {
  value: string;
};

function AnimatedStat({ value }: AnimatedStatProps) {
  const num = parseInt(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9]/g, "");
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, num, {
        duration: 2,
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toString();
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, num]);

  return (
    <>
      <span ref={ref}>0</span>
      {suffix}
    </>
  );
}

const Stats = () => {
  return (
    <>
      {/* Stats Section */}
      <section className="py-16 lg:py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: "500+", label: "Articles Published" },
              { value: "12K+", label: "Active Readers" },
              { value: "50+", label: "Expert Writers" },
              { value: "25+", label: "Countries Reached" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center space-y-2"
              >
                <div className="text-4xl md:text-5xl font-display font-bold">
                  <AnimatedStat value={stat.value} />
                </div>
                <div className="text-primary-foreground/80 text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Stats;
