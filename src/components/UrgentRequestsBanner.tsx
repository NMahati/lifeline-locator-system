
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBloodRequests } from '@/context/BloodRequestContext';
import { Bell, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const UrgentRequestsBanner = () => {
  const { urgentRequests } = useBloodRequests();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only show banner if there are urgent requests
    if (urgentRequests.length > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [urgentRequests.length]);

  if (!isVisible || urgentRequests.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-4 right-4 md:left-auto md:right-5 md:max-w-sm bg-white shadow-lg rounded-lg border border-red-200 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="bg-red-100 rounded-full p-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Urgent blood needed
            </h3>
            <div className="text-sm text-gray-500">
              {urgentRequests.length} {urgentRequests.length === 1 ? 'request' : 'requests'} requiring immediate attention
            </div>
            <div className="mt-3 flex space-x-2">
              <Link to="/requests">
                <Button size="sm" className="bg-blood-600 hover:bg-blood-700">View Requests</Button>
              </Link>
              <Button size="sm" variant="outline" onClick={() => setIsVisible(false)}>
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrgentRequestsBanner;
