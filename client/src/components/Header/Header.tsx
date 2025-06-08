import { Brain, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Brain className="text-blue-600 h-8 w-8" />
              <span className="ml-3 text-xl font-semibold text-gray-900">RadiologyConstellation</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">Dashboard</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Cases</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Resources</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white hidden sm:inline-flex">
              Get Started
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-blue-600 font-medium">Dashboard</a>
              <a href="#" className="text-gray-600">Cases</a>
              <a href="#" className="text-gray-600">Resources</a>
              <a href="#" className="text-gray-600">About</a>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-fit">
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
