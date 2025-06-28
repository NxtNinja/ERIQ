import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Activity } from "lucide-react";

const Navigation = () => {
  return (
    <>
      {/* Main Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">ERIQ</h1>
            </div>

            {/* Avatar */}
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/10198792?v=4"
                alt="priyangsubanik"
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                P
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
