"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { User, MapPin, Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const PatientCard = ({
  patient,
  doctorId,
}: {
  patient: any;
  doctorId: string;
}) => {
  const router = useRouter();
  return (
    <Card
      onClick={() =>
        router.push(`/dashboard/${patient.patient_id}-${doctorId}`)
      }
      className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200 border border-gray-200 bg-white cursor-pointer"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-lg font-semibold text-gray-900 truncate">
            {patient.name}
          </CardTitle>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="font-medium">Age:</span>
            <span>{patient.age} years</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="font-medium">Gender:</span>
            <span>{patient.gender}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="font-medium">Location:</span>
            <span className="truncate">{patient.location}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PatientCard;
