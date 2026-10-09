"use client";

import { useParams } from "next/navigation";
import SchemeForm from "@/components/admin/SchemeForm";

export default function EditSchemePage() {
  const params = useParams();

  return (
    <div className="p-6">
      <SchemeForm
        mode="edit"
        schemeId={params?.id}
      />
    </div>
  );
}