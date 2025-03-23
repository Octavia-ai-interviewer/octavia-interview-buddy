import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ConcurrencyData {
  total_concurrency_limit: number;
  current_active_sessions: number;
  peak_sessions_today: number;
  peak_sessions_this_week: number;
  recommended_additional_slots: number;
}

// Custom Progress component that allows for different indicator colors
const ColoredProgress: React.FC<{
  value: number;
  className?: string;
  color: 'green' | 'amber' | 'red';
}> = ({ value, className, color }) => {
  const colorClasses = {
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500'
  };

  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className={cn("h-full transition-all", colorClasses[color])}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

const VapiConcurrencyMonitor: React.FC = () => {
  const [concurrencyData, setConcurrencyData] = useState<ConcurrencyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchConcurrencyData = async () => {
    setIsLoading(true);
    try {
      // In a production environment, this would call your Firebase Function
      // const response = await fetch('/api/vapi-concurrency');
      // const data = await response.json();
      
      // For demo purposes, we'll use mock data
      const mockData: ConcurrencyData = {
        total_concurrency_limit: 10,
        current_active_sessions: Math.floor(Math.random() * 8) + 1, // Random between 1-8
        peak_sessions_today: Math.floor(Math.random() * 10) + 5, // Random between 5-14
        peak_sessions_this_week: Math.floor(Math.random() * 5) + 10, // Random between 10-14
        recommended_additional_slots: 0
      };
      
      // Calculate recommended slots based on peak usage
      if (mockData.peak_sessions_this_week >= mockData.total_concurrency_limit * 0.8) {
        mockData.recommended_additional_slots = 
          Math.ceil((mockData.peak_sessions_this_week * 1.2 - mockData.total_concurrency_limit) / 5) * 5;
      }
      
      setConcurrencyData(mockData);
      setLastUpdated(new Date());
      toast.success("Concurrency data updated");
    } catch (error) {
      console.error("Error fetching concurrency data:", error);
      toast.error("Failed to update concurrency data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConcurrencyData();
    
    // Set up auto-refresh every 5 minutes
    const intervalId = setInterval(fetchConcurrencyData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (!concurrencyData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentUsagePercentage = (concurrencyData.current_active_sessions / concurrencyData.total_concurrency_limit) * 100;
  const peakTodayPercentage = (concurrencyData.peak_sessions_today / concurrencyData.total_concurrency_limit) * 100;
  const peakWeekPercentage = (concurrencyData.peak_sessions_this_week / concurrencyData.total_concurrency_limit) * 100;

  const getProgressColor = (percentage: number): 'green' | 'amber' | 'red' => {
    if (percentage > 90) return 'red';
    if (percentage > 70) return 'amber';
    return 'green';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>VAPI Concurrency Monitor</CardTitle>
            <CardDescription>
              Track and manage voice API concurrency usage
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchConcurrencyData}
            disabled={isLoading}
            className="gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Current Active Sessions</span>
              <span className="text-sm font-medium">{concurrencyData.current_active_sessions} / {concurrencyData.total_concurrency_limit}</span>
            </div>
            <ColoredProgress 
              value={currentUsagePercentage} 
              color={getProgressColor(currentUsagePercentage)} 
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Peak Sessions Today</span>
              <span className="text-sm font-medium">{concurrencyData.peak_sessions_today} / {concurrencyData.total_concurrency_limit}</span>
            </div>
            <ColoredProgress 
              value={peakTodayPercentage} 
              color={getProgressColor(peakTodayPercentage)} 
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Peak Sessions This Week</span>
              <span className="text-sm font-medium">{concurrencyData.peak_sessions_this_week} / {concurrencyData.total_concurrency_limit}</span>
            </div>
            <ColoredProgress 
              value={peakWeekPercentage} 
              color={getProgressColor(peakWeekPercentage)} 
            />
          </div>
        </div>
        
        {concurrencyData.recommended_additional_slots > 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Concurrency Limit Warning</h4>
              <p className="text-sm text-amber-700 mt-1">
                Based on your usage patterns, we recommend purchasing {concurrencyData.recommended_additional_slots} additional concurrency slots to prevent potential service interruptions.
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2 border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-800 gap-1"
              >
                <TrendingUp className="h-4 w-4" />
                Upgrade Concurrency
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Concurrency Status Healthy</h4>
              <p className="text-sm text-green-700 mt-1">
                Your current concurrency limit is sufficient for your usage patterns. No additional slots needed at this time.
              </p>
            </div>
          </div>
        )}
        
        {lastUpdated && (
          <div className="text-xs text-muted-foreground text-right">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VapiConcurrencyMonitor;
