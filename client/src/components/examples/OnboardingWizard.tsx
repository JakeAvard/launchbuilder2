import { OnboardingWizard } from "../OnboardingWizard";

export default function OnboardingWizardExample() {
  return <OnboardingWizard onComplete={() => console.log("Onboarding complete")} />;
}
