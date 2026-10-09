"use client";

import { useParams } from "next/navigation";
import CropForm from "@/components/admin/CropForm";

export default function EditCropPage() {
  const params = useParams();

  const id = params?.id;

  return (
    <div className="p-6">
      <CropForm
        mode="edit"
        cropId={id}
      />
    </div>
  );
}