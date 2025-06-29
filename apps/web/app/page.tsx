"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "@/components/Navigation";
import PatientCard from "@/components/PatientCard";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

interface Patient {
  id: string;
  name: string;
  age: number;
}

interface User {
  id: string;
  // you can add other fields if needed like name, email, etc.
}

export default function Page() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
  });

  useEffect(() => {
    fetchPatients();
    fetchCurrentUser();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://eriq.onrender.com/items/patient",
        {
          withCredentials: true,
        }
      );
      setPatients(response.data.data);
    } catch (error: any) {
      const message =
        error.response?.data?.errors?.[0]?.message ||
        "Failed to load patients.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("https://eriq.onrender.com/users/me", {
        withCredentials: true,
      });
      setCurrentUser(response.data.data);
    } catch (error: any) {
      const message =
        error.response?.data?.errors?.[0]?.message ||
        "Failed to fetch current user.";
      setError(message);
    }
  };

  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.age) return;

    try {
      await axios.post(
        "https://eriq.onrender.com/items/patients",
        {
          name: newPatient.name,
          age: Number(newPatient.age),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setNewPatient({ name: "", age: "" });
      setOpen(false);
      fetchPatients();
    } catch (error: any) {
      const message =
        error.response?.data?.errors?.[0]?.message || "Failed to add patient.";
      setError(message);
    }
  };

  return (
    <>
      <Navigation />

      <div className="max-w-6xl mx-auto pt-12">
        <div className="flex justify-between items-center mb-6 px-2">
          <h1 className="text-2xl font-bold">Patients</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Patient
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Add New Patient</h2>
              <Input
                placeholder="Patient Name"
                value={newPatient.name}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, name: e.target.value })
                }
                className="mb-3"
              />
              <Input
                type="number"
                placeholder="Age"
                value={newPatient.age}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, age: e.target.value })
                }
                className="mb-4"
              />
              <Button onClick={handleAddPatient} className="w-full">
                Save Patient
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading, Error, or Data */}
        {loading ? (
          <p className="text-center text-gray-500">Loading patients…</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <p className="text-lg text-gray-600 mb-4">No patients found.</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Patient
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 place-items-center md:grid-cols-4 gap-5">
            {patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                doctorId={currentUser?.id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
