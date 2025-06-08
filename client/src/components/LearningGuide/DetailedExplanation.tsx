import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Stethoscope, Search, AlertCircle, Clock, MapPin, ArrowLeft, X } from 'lucide-react';
import { gasBubblesSWICase } from '@/data/curated-cases/gasBubblesSWI';

interface DetailedExplanationProps {
  selectedNode: string | null;
  onBackToConstellation: () => void;
}

export default function DetailedExplanation({ selectedNode, onBackToConstellation }: DetailedExplanationProps) {
  const framework = gasBubblesSWICase.framework;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.div
              key={selectedNode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Back Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={onBackToConstellation}
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Constellation
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBackToConstellation}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Technical Details */}
                <Card className={`${selectedNode === 'technical' ? 'border-l-4 border-l-blue-600 shadow-lg' : 'opacity-50'} transition-all duration-300`}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 rounded-lg p-3 mr-4">
                      <Settings className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Technical Framework</h3>
                      <p className="text-sm text-gray-600">Physics & Imaging</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{framework.TECHNICAL.primaryConcept}</h4>
                      <p className="text-sm text-gray-600">{framework.TECHNICAL.explanation}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Physics Concepts</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {framework.TECHNICAL.keyPhysics.map((concept, index) => (
                          <li key={index}>• {concept}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">Why It Matters:</p>
                      <p className="text-sm text-blue-700">{framework.TECHNICAL.whyItMatters}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clinical Details */}
              <Card className={`${selectedNode === 'clinical' ? 'border-l-4 border-l-green-600 shadow-lg' : 'opacity-50'} transition-all duration-300`}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-600 rounded-lg p-3 mr-4">
                      <Stethoscope className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Clinical Framework</h3>
                      <p className="text-sm text-gray-600">Timeline & Context</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{framework.CLINICAL.primaryConcept}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-green-800">&lt; 1 Week Post-Op</p>
                          <p className="text-xs text-green-700">Usually normal finding</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-red-800">&gt; 1 Week Post-Op</p>
                          <p className="text-xs text-red-700">Concerning for infection</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Clinical Context</h4>
                      <p className="text-sm text-gray-600">{framework.CLINICAL.context}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800 font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Clinical Decision Point:
                      </p>
                      <p className="text-sm text-yellow-700">{framework.CLINICAL.urgency}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Anatomical Details */}
              <Card className={`${selectedNode === 'anatomical' ? 'border-l-4 border-l-amber-600 shadow-lg' : 'opacity-50'} transition-all duration-300`}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-600 rounded-lg p-3 mr-4">
                      <Search className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Anatomical Framework</h3>
                      <p className="text-sm text-gray-600">Location & Distribution</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{framework.ANATOMICAL.primaryConcept}</h4>
                      <p className="text-sm text-gray-600">{framework.ANATOMICAL.significance}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Anatomical Considerations</h4>
                      <p className="text-sm text-gray-600">{framework.ANATOMICAL.considerations}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-orange-800 font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Intervention Threshold:
                      </p>
                      <p className="text-sm text-orange-700">Location and volume determine whether surgical evacuation or medical management is indicated.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Constellation Node</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Click on any node in the constellation above to explore detailed explanations of the Technical, 
                Clinical, and Anatomical frameworks for Gas Bubbles on SWI.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
