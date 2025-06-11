import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Stethoscope, Search, AlertCircle, Clock, MapPin } from 'lucide-react';
import { CaseData } from '@/data/curated-cases';

// Enhanced text formatting with improved readability and color coding
const formatText = (text: string) => {
  if (!text) return null;
  
  return text.split('\n').map((line, index) => {
    if (line.trim() === '') return <br key={index} />;
    
    // Handle bullet points
    if (line.startsWith('•') || line.startsWith('-')) {
      const bulletContent = line.substring(1).trim();
      const formattedContent = enhanceTextFormatting(bulletContent);
      
      return (
        <div key={index} className="flex items-start gap-2 mb-2">
          <span className="text-orange-400 mt-1">•</span>
          <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
        </div>
      );
    }
    
    // Handle navigation arrows
    if (line.trim().startsWith('→')) {
      const content = line.trim().substring(1).trim();
      const formattedContent = enhanceTextFormatting(content);
      return (
        <div key={index} className="mt-3 pt-3 border-t border-gray-700">
          <span className="text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: `→ ${formattedContent}` }} />
        </div>
      );
    }
    
    // Handle regular paragraphs with enhanced formatting
    const formattedContent = enhanceTextFormatting(line);
    return (
      <p key={index} className="mb-3" dangerouslySetInnerHTML={{ __html: formattedContent }} />
    );
  });
};

// Enhanced text formatting function with color coding
const enhanceTextFormatting = (text: string) => {
  return text
    // Handle bold text with ** markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    
    // Handle navigation hints (text starting with → followed by *text*)
    .replace(/→\s*\*([^*]+)\*/g, '→ <span class="text-gray-400 italic">$1</span>')
    
    // Handle key medical/technical terms in parentheses with *text*
    .replace(/\*([^*]+)\*/g, (match, content) => {
      // Determine color based on content type
      if (content.includes('vs') || content.includes('diamagnetic') || content.includes('paramagnetic') || 
          content.includes('magnetic') || content.includes('susceptibility') || content.includes('field')) {
        // Physics/technical terms - orange
        return `<span class="text-orange-400 font-medium">${content}</span>`;
      } else if (content === 'blooming' || content === 'mass effect' || content === 'echo' ||
                 content === 'signal' || content === 'contrast' || content === 'sequence') {
        // Imaging terminology - orange (exact match only)
        return `<span class="text-orange-400 font-semibold">'${content}'</span>`;
      } else if (content.includes('days') || content.includes('weeks') || content.includes('minutes') ||
                 content.includes('hours') || content.includes('CO₂') || content.includes('N₂')) {
        // Medical timeline/chemistry terms - cyan
        return `<span class="text-cyan-400 font-medium">${content}</span>`;
      } else if (content.includes('View') || content.includes('see') || content.includes('understand')) {
        // Navigation hints - gray
        return `<span class="text-gray-400 italic">${content}</span>`;
      } else {
        // Default medical terms - cyan
        return `<span class="text-cyan-400 font-medium">${content}</span>`;
      }
    })
    
    // Handle quoted terms that should be emphasized
    .replace(/'([^']+)'/g, '<span class="text-orange-400 font-semibold">\'$1\'</span>')
    
    // Handle specific medical abbreviations with consistent colors
    .replace(/CO₂/g, '<span class="text-cyan-400 font-medium">CO₂</span>')
    .replace(/N₂/g, '<span class="text-cyan-400 font-medium">N₂</span>')
    .replace(/T2\*/g, '<span class="text-orange-400 font-medium">T2*</span>')
    .replace(/SWI/g, '<span class="text-green-400 font-medium">SWI</span>')
    .replace(/CSF/g, '<span class="text-amber-400 font-medium">CSF</span>')
    .replace(/CT/g, '<span class="text-blue-400 font-medium">CT</span>')
    .replace(/MRI/g, '<span class="text-purple-400 font-medium">MRI</span>')
    .replace(/FLAIR/g, '<span class="text-indigo-400 font-medium">FLAIR</span>');
};

interface DetailedExplanationProps {
  selectedNode: string | null;
  onBackToConstellation: () => void;
  caseData?: CaseData;
}

export default function DetailedExplanation({ selectedNode, onBackToConstellation, caseData }: DetailedExplanationProps) {
  const framework = caseData?.case?.framework;
  const caseName = caseData?.case?.caseName || "Case Study";
  const [knowledgeLevel, setKnowledgeLevel] = useState<0 | 1 | 2>(1); // 0=Focused, 1=Clinical, 2=Comprehensive

  // Return early if no case data is provided
  if (!framework) {
    return (
      <section className="py-16 bg-gray-900/50 backdrop-blur-xl min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button 
              onClick={onBackToConstellation}
              variant="ghost" 
              className="mb-4 text-gray-300 hover:text-white hover:bg-gray-800/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Constellation
            </Button>
            <div className="text-center py-12">
              <p className="text-lg text-gray-300">Please select a case to view detailed explanations.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
    <section className="py-16 bg-gray-900/50 backdrop-blur-xl min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button 
            onClick={onBackToConstellation}
            variant="ghost" 
            className="mb-4 text-gray-300 hover:text-white hover:bg-gray-800/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Constellation
          </Button>
          <h2 className="text-3xl font-bold text-white mb-4">
            {caseName} - Detailed Framework
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Comprehensive analysis of the Technical, Clinical, and Anatomical frameworks for understanding this case.
          </p>
          
          {/* Knowledge Level Selector */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-gray-300">Knowledge Level:</span>
            <div className="flex gap-2">
              {[0, 1, 2].map((level) => (
                <Button
                  key={level}
                  onClick={() => setKnowledgeLevel(level as 0 | 1 | 2)}
                  variant={knowledgeLevel === level ? 'default' : 'outline'}
                  size="sm"
                  className={`text-sm ${
                    knowledgeLevel === level 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'text-gray-300 hover:text-white border-gray-600 hover:bg-gray-800/50'
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
              <Card className={`bg-gray-900/50 backdrop-blur-xl border border-gray-700 ${selectedNode === 'technical' ? 'border-l-4 border-l-orange-500 shadow-lg shadow-orange-500/20' : 'opacity-50'} transition-all duration-300`}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500 rounded-lg p-3 mr-4">
                      <Settings className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Technical Framework</h3>
                      <p className="text-sm text-gray-300">{framework.TECHNICAL.primaryConcept}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-orange-500/20 border border-orange-500/30 p-4 rounded-lg">
                      <p className="text-sm text-orange-300 font-medium mb-2">Discovery Insight:</p>
                      <p className="text-sm text-orange-200">{framework.TECHNICAL.discoveryInsight}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">{getKnowledgeLevelLabel(knowledgeLevel)}</h4>
                      <div className="text-sm text-gray-300 leading-relaxed">
                        {formatText(getContentForLevel(framework.TECHNICAL, knowledgeLevel))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clinical Details */}
              <Card className={`bg-gray-900/50 backdrop-blur-xl border border-gray-700 ${selectedNode === 'clinical' ? 'border-l-4 border-l-green-500 shadow-lg shadow-green-500/20' : 'opacity-50'} transition-all duration-300`}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-500 rounded-lg p-3 mr-4">
                      <Stethoscope className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Clinical Framework</h3>
                      <p className="text-sm text-gray-300">{framework.CLINICAL.primaryConcept}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-green-500/20 border border-green-500/30 p-4 rounded-lg">
                      <p className="text-sm text-green-300 font-medium mb-2">Discovery Insight:</p>
                      <p className="text-sm text-green-200">{framework.CLINICAL.discoveryInsight}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">{getKnowledgeLevelLabel(knowledgeLevel)}</h4>
                      <div className="text-sm text-gray-300 leading-relaxed">
                        {formatText(getContentForLevel(framework.CLINICAL, knowledgeLevel))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Anatomical Details */}
              <Card className={`bg-gray-900/50 backdrop-blur-xl border border-gray-700 ${selectedNode === 'anatomical' ? 'border-l-4 border-l-amber-500 shadow-lg shadow-amber-500/20' : 'opacity-50'} transition-all duration-300`}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-500 rounded-lg p-3 mr-4">
                      <Search className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Anatomical Framework</h3>
                      <p className="text-sm text-gray-300">{framework.ANATOMICAL.primaryConcept}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-amber-500/20 border border-amber-500/30 p-4 rounded-lg">
                      <p className="text-sm text-amber-300 font-medium mb-2">Discovery Insight:</p>
                      <p className="text-sm text-amber-200">{framework.ANATOMICAL.discoveryInsight}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">{getKnowledgeLevelLabel(knowledgeLevel)}</h4>
                      <div className="text-sm text-gray-300 leading-relaxed">
                        {formatText(getContentForLevel(framework.ANATOMICAL, knowledgeLevel))}
                      </div>
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
              <h3 className="text-xl font-semibold text-white mb-2">Select a Constellation Node</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Click on any node in the constellation above to explore detailed explanations of the Technical, 
                Clinical, and Anatomical frameworks for this radiology case.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}