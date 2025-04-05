
import { cn } from "@/lib/utils";
import { BloodTypes } from "@/context/AuthContext";

interface BloodGroupSelectorProps {
  selectedBloodGroup?: keyof BloodTypes;
  onChange: (bloodGroup: keyof BloodTypes) => void;
  className?: string;
}

const BloodGroupSelector: React.FC<BloodGroupSelectorProps> = ({ 
  selectedBloodGroup,
  onChange,
  className 
}) => {
  const bloodGroups: Array<keyof BloodTypes> = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {bloodGroups.map((bloodGroup) => (
        <button
          key={bloodGroup}
          type="button"
          onClick={() => onChange(bloodGroup)}
          className={cn(
            "flex items-center justify-center p-2 rounded-md border",
            selectedBloodGroup === bloodGroup
              ? "bg-blood-100 border-blood-500 text-blood-700 font-medium"
              : "bg-white border-gray-200 hover:bg-gray-50",
          )}
        >
          {bloodGroup}
        </button>
      ))}
    </div>
  );
};

export default BloodGroupSelector;
