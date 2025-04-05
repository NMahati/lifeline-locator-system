
import Layout from '@/components/Layout';
import EligibilityChecklist from '@/components/EligibilityChecklist';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const EligibilityPage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Blood Donation Eligibility</h1>
        
        <div className="mb-8">
          <EligibilityChecklist />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Common Eligibility Questions</h2>
          <Accordion type="single" collapsible className="bg-white rounded-md shadow-sm border">
            <AccordionItem value="age">
              <AccordionTrigger className="px-4">What is the age requirement for blood donation?</AccordionTrigger>
              <AccordionContent className="px-4">
                <p className="text-gray-700">
                  Most blood centers require donors to be at least 18 years old. Some states permit 16 or 17-year-olds to donate with parental consent. There is typically no upper age limit for blood donation as long as you are well and meet the donation requirements.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="weight">
              <AccordionTrigger className="px-4">Is there a minimum weight requirement?</AccordionTrigger>
              <AccordionContent className="px-4">
                <p className="text-gray-700">
                  Yes, donors generally need to weigh at least 50 kg (110 lbs) to ensure that the volume of blood drawn is safe for the donor. This requirement helps prevent adverse reactions like lightheadedness or fainting.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="wait">
              <AccordionTrigger className="px-4">How long do I need to wait between donations?</AccordionTrigger>
              <AccordionContent className="px-4">
                <p className="text-gray-700">
                  For whole blood donations, the recommended waiting period is typically 12 weeks (3 months) between donations. For platelets, donors may be able to donate more frequently, usually every 7 days for up to 24 times per year. For plasma, donors may donate every 28 days.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="medication">
              <AccordionTrigger className="px-4">Can I donate blood if I'm taking medication?</AccordionTrigger>
              <AccordionContent className="px-4">
                <p className="text-gray-700">
                  Many medications do not prevent you from donating blood. Common medications like those for high blood pressure, cholesterol, or mild asthma typically don't disqualify you. However, certain medications like blood thinners, antibiotics, or medications for specific health conditions might require a waiting period. It's best to inform the donation center about your medications.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tattoo">
              <AccordionTrigger className="px-4">Can I donate if I recently got a tattoo or piercing?</AccordionTrigger>
              <AccordionContent className="px-4">
                <p className="text-gray-700">
                  After getting a tattoo, piercing, or permanent makeup applied, you may need to wait 3-6 months before donating blood, depending on local regulations. If the procedure was done in a state-regulated facility with sterile needles and fresh ink, the deferral period might be shorter or waived in some locations.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pregnancy">
              <AccordionTrigger className="px-4">Can I donate blood during or after pregnancy?</AccordionTrigger>
              <AccordionContent className="px-4">
                <p className="text-gray-700">
                  Pregnant women cannot donate blood. After pregnancy, women should typically wait at least 6 weeks after giving birth before donating. Breastfeeding mothers can usually donate blood safely, but it's recommended to drink extra fluids before and after donation.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="bg-white rounded-md shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Benefits of Blood Donation</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="bg-blood-100 text-blood-700 font-bold rounded-full h-6 w-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
              <span>
                <span className="font-medium">Free Health Screening:</span> All donated blood undergoes testing for various diseases including HIV, hepatitis, and syphilis. You'll be notified if any issues are detected.
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-blood-100 text-blood-700 font-bold rounded-full h-6 w-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
              <span>
                <span className="font-medium">Reduced Risk of Heart Disease:</span> Regular blood donation can help reduce the viscosity of blood, potentially lowering the risk of heart attacks.
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-blood-100 text-blood-700 font-bold rounded-full h-6 w-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
              <span>
                <span className="font-medium">Calorie Burn:</span> Donating blood burns approximately 650 calories as your body works to replace the blood.
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-blood-100 text-blood-700 font-bold rounded-full h-6 w-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
              <span>
                <span className="font-medium">Mental Health Benefits:</span> The act of helping others through donation can boost your mood and provide a sense of satisfaction and purpose.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default EligibilityPage;
