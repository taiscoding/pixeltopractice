import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Stethoscope, Search, AlertCircle, Clock, MapPin } from 'lucide-react';
import { gasBubblesSWICase } from '@/data/curated-cases/gasBubblesSWI';

interface DetailedExplanationProps {
  selectedNode: string | null;
  onBackToConstellation: () => void;
}

export default function DetailedExplanation({ selectedNode, onBackToConstellation }: DetailedExplanationProps) {
  const framework = gasBubblesSWICase.framework;
  const [knowledgeLevel, setKnowledgeLevel] = useState<0 | 1 | 2>(1); // 0=Focused, 1=Clinical, 2=Comprehensive

  const getKnowledgeLevelLabel = (level: number) => {
    switch (level) {
      case 0: return 'Focused Learning';
      case 1: return 'Clinical Application';
      case 2: return 'Comprehensive Analysis';
      default: return 'Clinical Application';
    }
  };

  const getContentForLevel = (frameworkData: any, level: number) => {
    switch (level) {
      case 0: return frameworkData.focusedLearning;
      case 1: return frameworkData.clinicalApplication;
      case 2: return frameworkData.comprehensiveAnalysis;
      default: return frameworkData.clinicalApplication;
    }
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button 
            onClick={onBackToConstellation}
            variant="ghost" 
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Constellation
          </Button>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Gas Bubbles on SWI - Detailed Framework
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Comprehensive analysis of the Technical, Clinical, and Anatomical frameworks for understanding gas bubbles on Susceptibility-Weighted Imaging.
          </p>
          
          {/* Knowledge Level Selector */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-gray-700">Knowledge Level:</span>
            <div className="flex gap-2">
              {[0, 1, 2].map((level) => (
                <Button
                  key={level}
                  onClick={() => setKnowledgeLevel(level as 0 | 1 | 2)}
                  variant={knowledgeLevel === level ? 'default' : 'outline'}
                  size="sm"
                  className={`text-sm ${
                    knowledgeLevel === level 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {getKnowledgeLevelLabel(level)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedNode ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-1 gap-8"
            >
              <div className="space-y-8">
              {/* Technical Details */}
              <Card className={`${selectedNode === 'technical' ? 'border-l-4 border-l-blue-600 shadow-lg' : 'opacity-50'} transition-all duration-300`}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 rounded-lg p-3 mr-4">
                      <Settings className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Technical Framework</h3>
                      <p className="text-sm text-gray-600">{framework.TECHNICAL.primaryConcept}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium mb-2">Discovery Insight:</p>
                      <p className="text-sm text-blue-700">{framework.TECHNICAL.discoveryInsight}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{getKnowledgeLevelLabel(knowledgeLevel)}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {getContentForLevel(framework.TECHNICAL, knowledgeLevel)}
                      </p>
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
                      <p className="text-sm text-gray-600">{framework.CLINICAL.primaryConcept}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800 font-medium mb-2">Discovery Insight:</p>
                      <p className="text-sm text-green-700">{framework.CLINICAL.discoveryInsight}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{getKnowledgeLevelLabel(knowledgeLevel)}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {getContentForLevel(framework.CLINICAL, knowledgeLevel)}
                      </p>
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
                      <p className="text-sm text-gray-600">{framework.ANATOMICAL.primaryConcept}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <p className="text-sm text-amber-800 font-medium mb-2">Discovery Insight:</p>
                      <p className="text-sm text-amber-700">{framework.ANATOMICAL.discoveryInsight}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{getKnowledgeLevelLabel(knowledgeLevel)}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {getContentForLevel(framework.ANATOMICAL, knowledgeLevel)}
                      </p>
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