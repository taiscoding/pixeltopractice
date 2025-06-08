import { Card, CardContent } from '@/components/ui/card';
import { Plus, Brain, Eye, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const upcomingCases = [
  {
    title: "Microbleeds on SWI",
    description: "Coming Soon",
    icon: Brain,
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "Ring Enhancement",
    description: "Coming Soon", 
    icon: Eye,
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    title: "Diffusion Restriction",
    description: "Coming Soon",
    icon: Activity,
    color: "bg-pink-100 text-pink-600"
  }
];

export default function CaseSelector() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore More Cases</h2>
          <p className="text-lg text-gray-600">Master pattern recognition across various radiology scenarios</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-600 transition-all duration-300 cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className={`${caseItem.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <caseItem.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                      {caseItem.title}
                    </h3>
                    <p className="text-sm text-gray-500">{caseItem.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
