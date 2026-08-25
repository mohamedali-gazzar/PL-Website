import CollectionView from "@/components/CollectionView";
import { instrumentTransformers } from "@/lib/content";

export const metadata = {
  title: "Instrument Transformers — Powerline",
  description: instrumentTransformers.intro,
};

export default function Page() {
  return (
    <CollectionView
      data={instrumentTransformers}
      eyebrow="Our Products"
      img="/img/prod-instrument-transformers.webp"
    />
  );
}
