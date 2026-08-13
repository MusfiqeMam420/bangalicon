"use client";

export default function AddToCollectionModal({ onClose }: any) {
  const collections = ["Favorites", "UI Pack", "Landing Icons"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-xl w-[400px]">
        <h2 className="font-semibold mb-4">Add to Collection</h2>

        <div className="flex flex-col gap-2">
          {collections.map((c) => (
            <button
              key={c}
              className="border p-2 rounded hover:bg-gray-100"
            >
              {c}
            </button>
          ))}
        </div>

        <button className="mt-4 w-full bg-primary text-white p-2 rounded">
          + Create New Collection
        </button>
      </div>
    </div>
  );
}