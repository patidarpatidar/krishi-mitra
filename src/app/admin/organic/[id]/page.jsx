import OrganicRecipeForm from "@/components/admin/OrganicRecipeForm";

export default async function EditOrganicRecipePage({
  params,
}) {
  const { id } = await params;

  return (
    <OrganicRecipeForm recipeId={id} />
  );
}