import tithIconPath from "@assets/Tither_Icon_Green_1766076606860.png";

export function TitherLogo() {
  return (
    <img 
      src={tithIconPath} 
      alt="Tither" 
      className="h-9 w-9"
      data-testid="img-tither-logo"
    />
  );
}

export function TitherLogoInverse() {
  return (
    <img 
      src={tithIconPath} 
      alt="Tither" 
      className="h-9 w-9"
      data-testid="img-tither-logo-inverse"
    />
  );
}
