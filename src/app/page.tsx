import ImageResizer from "@/components/ImageResizer";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Bulk Image Resizer</h1>
      <ImageResizer />
    </main>
  );
}
