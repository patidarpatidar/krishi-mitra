
import BlogCategoryForm from "@/components/admin/BlogCategoryForm";

export default function EditBlogCategoryPage({ params }) {
  return <BlogCategoryForm categoryId={params.id} />;
}