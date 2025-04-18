
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBMICategory, getBMIColor } from '@/utils/bmiCalculator';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface BmiResultDisplayProps {
  currentBMI: number;
  targetBMI: number;
  currentWeight: number;
  targetWeight: number;
}

const BmiResultDisplay: React.FC<BmiResultDisplayProps> = ({
  currentBMI,
  targetBMI,
  currentWeight,
  targetWeight
}) => {
  // Format BMI to 1 decimal place
  const formatBMI = (bmi: number) => (bmi ? bmi.toFixed(1) : '-');
  
  // Format weight to 1 decimal place
  const formatWeight = (weight: number) => (weight ? weight.toFixed(1) : '-');
  
  // Determine if user needs to gain, lose, or maintain weight
  const getDirectionIcon = () => {
    if (!currentWeight || !targetWeight) return <Minus size={20} />;
    
    if (targetWeight > currentWeight) {
      return <ArrowUp size={20} className="text-health-info" />;
    } else if (targetWeight < currentWeight) {
      return <ArrowDown size={20} className="text-health-primary" />;
    } else {
      return <Minus size={20} className="text-health-accent" />;
    }
  };
  
  const getDirectionText = () => {
    if (!currentWeight || !targetWeight) return "Belum ada target";
    
    if (targetWeight > currentWeight) {
      return "Perlu menambah berat";
    } else if (targetWeight < currentWeight) {
      return "Perlu menurunkan berat";
    } else {
      return "Pertahankan berat saat ini";
    }
  };
  
  const getWeightDifference = () => {
    if (!currentWeight || !targetWeight) return "";
    
    const diff = Math.abs(targetWeight - currentWeight);
    return diff.toFixed(1) + " kg";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-health-primary">Hasil Perhitungan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-6">
          {/* Current BMI */}
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">IMT Saat Ini</p>
            <p className={`text-3xl font-bold ${getBMIColor(currentBMI)}`}>
              {formatBMI(currentBMI)}
            </p>
            <p className="text-sm mt-1">
              {getBMICategory(currentBMI)}
            </p>
          </div>
          
          {/* Target BMI */}
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">IMT Target</p>
            <p className={`text-3xl font-bold ${getBMIColor(targetBMI)}`}>
              {formatBMI(targetBMI)}
            </p>
            <p className="text-sm mt-1">
              {getBMICategory(targetBMI)}
            </p>
          </div>
          
          {/* Current Weight */}
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Berat Saat Ini</p>
            <p className="text-3xl font-bold">
              {formatWeight(currentWeight)} kg
            </p>
          </div>
          
          {/* Target Weight */}
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Berat Target</p>
            <p className="text-3xl font-bold">
              {formatWeight(targetWeight)} kg
            </p>
          </div>
        </div>
        
        {/* Weight difference indicator */}
        <div className="mt-8 p-4 bg-health-highlight rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getDirectionIcon()}
            <span className="font-medium">{getDirectionText()}</span>
          </div>
          <div className="font-bold">
            {getWeightDifference()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BmiResultDisplay;
