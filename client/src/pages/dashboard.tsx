import { useState } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ConstellationViewer from "@/components/ConstellationViewer/ConstellationViewer";
import ImmersiveConstellationViewer from "@/components/ConstellationViewer/ImmersiveConstellationViewer";
import DetailedExplanation from "@/components/LearningGuide/DetailedExplanation";
import CaseSelector from "@/components/CaseSelector/CaseSelector";
import { Button } from "@/components/ui/button";
import { Brain, Play, Maximize2 } from "lucide-react";
import { scrollToElement } from "@/lib/utils";
import { availableCases } from "@/data/curated-cases";

export default function Dashboard() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [selectedCase, setSelectedCase] = useState<string>("gas-bubbles-swi");

  const currentCaseData = availableCases[selectedCase];
  const currentCaseName = currentCaseData?.case?.caseName || "Unknown Case";

  const handleStartLearning = () => {
    scrollToElement("constellation-viewer");
  };

  const handleImmersiveLearning = () => {
    setIsImmersiveMode(true);
  };

  const handleCaseSelect = (caseId: string) => {
    setSelectedCase(caseId);
    setSelectedNode(null); // Reset selected node when switching cases
    scrollToElement("constellation-viewer");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Interactive Radiology
              <span className="text-blue-600 block">Pattern Recognition</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Master radiology through interactive constellation visualization. Learn pattern recognition with our 
              evidence-based TECHNICAL → CLINICAL → ANATOMICAL framework.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleStartLearning}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg transform hover:scale-105 transition-all duration-200"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Learning
              </Button>
              <Button 
                onClick={handleImmersiveLearning}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg transform hover:scale-105 transition-all duration-200"
              >
                <Maximize2 className="mr-2 h-5 w-5" />
                Immersive Explorer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Case Selector Section */}
      <CaseSelector 
        selectedCase={selectedCase}
        onCaseSelect={handleCaseSelect}
      />

      {/* Constellation Viewer Section */}
      <section id="constellation-viewer" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentCaseName} - Interactive Learning</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Click on the constellation nodes to explore the Technical, Clinical, and Anatomical aspects of this case.
            </p>
          </div>
          
          <ConstellationViewer 
            selectedNode={selectedNode} 
            onNodeSelect={setSelectedNode}
            caseData={currentCaseData}
          />
        </div>
      </section>

      {/* Detailed Explanation Section */}
      <DetailedExplanation 
        selectedNode={selectedNode} 
        onBackToConstellation={() => setSelectedNode(null)}
        caseData={currentCaseData}
      />

      <Footer />

      {/* Immersive Constellation Viewer */}
      <ImmersiveConstellationViewer 
        isOpen={isImmersiveMode}
        onClose={() => setIsImmersiveMode(false)}
        selectedCase={selectedCase}
        onCaseSelect={handleCaseSelect}
      />
    </div>
  );
}
