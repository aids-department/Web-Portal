// components/ui/Reveal.jsx
// Scroll-triggered entrance animations (fade-up, expo-out, once).
// Reduced-motion users get static content via <MotionConfig reducedMotion="user">.
import { motion } from "framer-motion";
import { EASE, staggerParent, staggerChild } from "./motion";

export function Reveal({ as = "div", delay = 0, y = 24, className = "", children, ...rest }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function Stagger({ as = "div", className = "", children, ...rest }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ as = "div", className = "", children, ...rest }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp variants={staggerChild} className={className} {...rest}>
      {children}
    </Comp>
  );
}
