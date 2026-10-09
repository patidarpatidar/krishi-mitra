
import CropCategoryForm from "@/components/admin/CropCategoryForm";

export default async function EditCropCategoryPage({ params }) {
  const { id } = await params;

  return <CropCategoryForm categoryId={id} />;
}