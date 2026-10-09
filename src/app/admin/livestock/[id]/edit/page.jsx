"use client";

import { useParams } from "next/navigation";
import LivestockArticleForm from "@/components/admin/LivestockArticleForm";

export default function EditLivestockArticlePage() {
  const params = useParams();
  const id = params.id;

  if (!id) {
    return <p className="p-8">Article ID नहीं मिला।</p>;
  }

  return <LivestockArticleForm articleId={id} />;
}