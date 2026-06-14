import CollectionView from "@/components/CollectionView";
import { mediumVoltage } from "@/lib/content";

export const metadata = {
  title: "Medium Voltage Assembly — Powerline",
  description: mediumVoltage.intro,
};

export default function Page() {
  return (
    <CollectionView
      data={mediumVoltage}
      eyebrow="Assembly Lines"
      img="/img/line-mv.jpg"
    />
  );
}
