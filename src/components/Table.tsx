import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, Github } from 'lucide-react';
import { Project } from '../types/project';

interface Column {
  key: keyof Project | 'actions';
  label: string;
  sortable?: boolean;
  render?: (project: Project) => React.ReactNode;
}

interface TableProps {
  data: Project[];
}

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  },
  hover: {
    scale: 1.01,
    y: -2,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  }
};

export function Table({ data }: TableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: 'asc' | 'desc';
  } | null>(null);

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Project',
      sortable: true,
      render: (project) => (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 group"
        >
          <div className="relative overflow-hidden rounded-lg">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              src={project.image}
              alt={project.name}
              className="w-12 h-12 object-cover transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {project.description}
            </p>
          </div>
        </motion.div>
      ),
    },
    {
      key: 'techStack',
      label: 'Technologies',
      render: (project) => (
        <div className="flex flex-wrap gap-1">
          {project.techStack.map((tech, index) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              className="px-2 py-1 bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-900 dark:to-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium shadow-sm"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (project) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(project.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Links',
      render: (project) => (
        <div className="flex gap-3 justify-end">
          {project.githubUrl && (
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 glass rounded-full focus-ring"
              aria-label={`View ${project.name} on GitHub`}
            >
              <Github className="w-5 h-5" />
            </motion.a>
          )}
          {project.demoUrl && (
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 glass rounded-full focus-ring"
              aria-label={`View ${project.name} demo`}
            >
              <ExternalLink className="w-5 h-5" />
            </motion.a>
          )}
        </div>
      ),
    },
  ];

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a[sortConfig.key]).getTime();
        const dateB = new Date(b[sortConfig.key]).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: keyof Project) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  return (
    <div className="overflow-x-auto">
      <motion.table
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="w-full border-collapse"
      >
        <thead>
          <tr className="glass border-b glass-border">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                {column.sortable ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSort(column.key as keyof Project)}
                    className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 focus-ring rounded-md"
                  >
                    {column.label}
                    <span className="flex flex-col">
                      <ChevronUp
                        className={`w-3 h-3 ${
                          sortConfig?.key === column.key &&
                          sortConfig.direction === 'asc'
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-400 dark:text-gray-600'
                        }`}
                      />
                      <ChevronDown
                        className={`w-3 h-3 -mt-1 ${
                          sortConfig?.key === column.key &&
                          sortConfig.direction === 'desc'
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-400 dark:text-gray-600'
                        }`}
                      />
                    </span>
                  </motion.button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          <AnimatePresence>
            {sortedData.map((project) => (
              <motion.tr
                key={project.id}
                variants={rowVariants}
                whileHover="hover"
                className="group transition-colors glass-hover"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-normal dark:text-gray-300"
                  >
                    {column.render
                      ? column.render(project)
                      : String(project[column.key])}
                  </td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </motion.table>
    </div>
  );
}