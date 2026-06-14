import CollectionView from "@/components/CollectionView";
import { supplies } from "@/lib/content";

export const metadata = {
  title: "Supplies — Transformers — Powerline",
  description: supplies.intro,
};

export default function Page() {
  return (
    <CollectionView data={supplies} eyebrow="Supplies" img="/img/line-supplies.webp" />
  );
}
