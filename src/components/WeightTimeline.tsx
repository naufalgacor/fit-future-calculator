
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface WeightTimelineProps {
  currentWeight: number;
  targetWeight: number;
  weeksPrediction: number;
  weightChangeRate: number;
}

const WeightTimeline: React.FC<WeightTimelineProps> = ({
  currentWeight,
  targetWeight,
  weeksPrediction,
  weightChangeRate
}) => {
  // Generate timeline data
  const generateTimelineData = () => {
    const data = [];
    const totalWeeks = Math.ceil(weeksPrediction);
    
    for (let week = 0; week <= totalWeeks; week++) {
      const projectedWeight = currentWeight + (weightChangeRate * week);
      
      // If we're losing weight, don't go below target
      // If we're gaining weight, don't go above target
      let effectiveWeight = projectedWeight;
      if (weightChangeRate < 0 && projectedWeight < targetWeight) {
        effectiveWeight = targetWeight;
      } else if (weightChangeRate > 0 && projectedWeight > targetWeight) {
        effectiveWeight = targetWeight;
      }
      
      data.push({
        week: week,
        weight: parseFloat(effectiveWeight.toFixed(1))
      });
    }
    
    return data;
  };
  
  const timelineData = generateTimelineData();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-health-primary">Timeline Perubahan Berat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2 mb-6">
          <p className="text-center text-lg font-medium">
            Estimasi waktu: {Math.ceil(weeksPrediction)} minggu
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Dengan laju {Math.abs(weightChangeRate)} kg per minggu
          </p>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timelineData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="week" 
                label={{ 
                  value: 'Minggu', 
                  position: 'insideBottomRight', 
                  offset: -5 
                }} 
              />
              <YAxis 
                label={{ 
                  value: 'Berat (kg)', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: 10
                }} 
                domain={[
                  Math.min(currentWeight, targetWeight) - 2,
                  Math.max(currentWeight, targetWeight) + 2
                ]}
              />
              <Tooltip 
                formatter={(value) => [`${value} kg`, 'Berat']}
                labelFormatter={(label) => `Minggu ${label}`}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#4CAF50"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-x-4">
          <div className="p-3 bg-health-highlight rounded-lg text-center">
            <p className="text-sm font-medium">Mulai</p>
            <p className="text-xl font-bold">{currentWeight.toFixed(1)} kg</p>
          </div>
          <div className="p-3 bg-health-highlight rounded-lg text-center">
            <p className="text-sm font-medium">Target</p>
            <p className="text-xl font-bold">{targetWeight.toFixed(1)} kg</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightTimeline;
