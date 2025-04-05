
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const eligibilityQuestions = [
  {
    id: "age",
    label: "Are you between 18 and 65 years of age?",
    disqualifying: false
  },
  {
    id: "weight",
    label: "Do you weigh at least 50kg (110 lbs)?",
    disqualifying: false
  },
  {
    id: "illness",
    label: "Are you feeling well today? (No fever, cold, or flu symptoms)",
    disqualifying: false
  },
  {
    id: "medication",
    label: "Are you currently taking antibiotics or other prescription medications?",
    disqualifying: true
  },
  {
    id: "pregnancy",
    label: "If female, are you currently pregnant or have given birth in the last 6 months?",
    disqualifying: true
  },
  {
    id: "surgery",
    label: "Have you had surgery in the last 6 months?",
    disqualifying: true
  },
  {
    id: "tattoo",
    label: "Have you gotten a tattoo or piercing in the last 3 months?",
    disqualifying: true
  },
  {
    id: "travel",
    label: "Have you traveled to a malaria-endemic area in the last 12 months?",
    disqualifying: true
  },
  {
    id: "transfusion",
    label: "Have you received a blood transfusion in the last 12 months?",
    disqualifying: true
  },
  {
    id: "heartCondition",
    label: "Do you have a heart condition or high/low blood pressure?",
    disqualifying: true
  }
];

const EligibilityChecklist: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<'eligible' | 'ineligible' | null>(null);
  const { toast } = useToast();

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setAnswers(prev => ({ ...prev, [id]: checked }));
  };

  const checkEligibility = () => {
    const answeredQuestions = Object.keys(answers).length;
    
    if (answeredQuestions < eligibilityQuestions.length) {
      toast({
        title: "Incomplete assessment",
        description: "Please answer all questions to determine your eligibility.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if any disqualifying questions were answered "yes" (true)
    const disqualified = eligibilityQuestions
      .filter(q => q.disqualifying)
      .some(q => answers[q.id] === true);
      
    // Check if any qualifying questions were answered "no" (false)
    const notQualified = eligibilityQuestions
      .filter(q => !q.disqualifying)
      .some(q => answers[q.id] === false);
    
    if (disqualified || notQualified) {
      setResult('ineligible');
    } else {
      setResult('eligible');
    }
  };

  const resetForm = () => {
    setAnswers({});
    setResult(null);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Donor Eligibility Assessment</CardTitle>
        <CardDescription>
          Answer the following questions to determine if you're eligible to donate blood today.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {result ? (
          <div className="space-y-4">
            {result === 'eligible' ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800">You are eligible to donate!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Based on your responses, you meet the basic requirements for blood donation. 
                  Please remember that the final determination will be made by healthcare professionals at the donation site.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-red-50 border-red-200">
                <XCircle className="h-5 w-5 text-red-600" />
                <AlertTitle className="text-red-800">You may not be eligible at this time</AlertTitle>
                <AlertDescription className="text-red-700">
                  Based on your responses, there might be factors that temporarily prevent you from donating blood.
                  This doesn't mean you can never donate - many deferral reasons are temporary.
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-800">Important</AlertTitle>
              <AlertDescription className="text-blue-700">
                This checklist helps determine your basic eligibility but is not a substitute for the full screening conducted by medical professionals at donation centers.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3 mt-4">
              {eligibilityQuestions.map((question) => (
                <div key={question.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={question.id} 
                    checked={answers[question.id] || false}
                    onCheckedChange={(checked) => handleCheckboxChange(question.id, checked === true)}
                  />
                  <label 
                    htmlFor={question.id} 
                    className="text-sm leading-tight cursor-pointer"
                  >
                    {question.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {result ? (
          <Button onClick={resetForm} className="w-full">Retake Assessment</Button>
        ) : (
          <Button onClick={checkEligibility} className="w-full bg-blood-600 hover:bg-blood-700">
            Check My Eligibility
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EligibilityChecklist;
