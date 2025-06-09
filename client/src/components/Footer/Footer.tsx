import { Brain } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black/80 backdrop-blur-xl text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <Brain className="text-orange-400 h-8 w-8" />
              <span className="ml-3 text-xl font-semibold">RadiologyConstellation</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Advanced educational platform for radiology pattern recognition using interactive constellation visualization.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <FaGithub className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <FaTwitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Case Library</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Progress Tracking</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Resources</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 RadiologyConstellation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
