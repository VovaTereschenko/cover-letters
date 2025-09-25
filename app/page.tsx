import Image from "next/image";
import styles from "./page.module.css";
import { ProgressIndication } from "@/components/ProgressIndication/ProgressIndication";

export default function Home() {
  return (
    <div>
      <ProgressIndication currentStep={1} />
    </div>
  );
}
