import CollectionView from "@/components/CollectionView";
import { lowVoltage } from "@/lib/content";

export const metadata = {
  title: "Low Voltage Assembly — Powerline",
  description: lowVoltage.intro,
};

export default function Page() {
  return (
    <CollectionView
      data={lowVoltage}
      eyebrow="Our Products"
      img="/img/line-lv.webp"
      highlight={lowVoltage.highlight}
    />
  );
}
