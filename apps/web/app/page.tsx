import Navigation from "@/components/Navigation";
import PatientCard from "@/components/PatientCard";

export default function Page() {
  return (
    <>
      <Navigation />
      <div className="max-w-6xl mx-auto grid grid-cols-1 place-items-center md:grid-cols-4 gap-5 pt-12">
        <PatientCard />
        <PatientCard />
        <PatientCard />
        <PatientCard />
      </div>
    </>
  );
}
