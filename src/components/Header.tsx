import React from 'react';
import { Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 360 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-4"
      >
        <Code2 className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
      >
        Project Showcase
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
      >
        Exploring the intersection of design and technology through innovative solutions
      </motion.p>
    </motion.div>
  );
}