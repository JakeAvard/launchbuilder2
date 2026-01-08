import { SuccessScreen } from "../SuccessScreen";

export default function SuccessScreenExample() {
  return (
    <SuccessScreen
      organizationName="St. Mary's Catholic Church"
      givingPageUrl="https://tither.app/give/st-marys"
      onDismiss={() => console.log("Dismissed")}
    />
  );
}
