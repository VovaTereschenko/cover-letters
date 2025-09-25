import styles from "./ProgressIndication.module.css";
import { RECOMMENDED_AMOUNT_OF_APPLICATIONS } from "@/constants";

const ProgressIndication = () => {
  return (
    <div className={styles.container}>
      New application {RECOMMENDED_AMOUNT_OF_APPLICATIONS}
    </div>
  );
};

export { ProgressIndication };
