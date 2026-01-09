import mascotPath from "@assets/1_1766076535645.png";

interface MascotProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Mascot({ size = "md", className = "" }: MascotProps) {
  const sizeMap = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  return (
    <img
      src={mascotPath}
      alt="Tither mascot"
      className={`${sizeMap[size]} ${className}`}
      data-testid="img-mascot"
    />
  );
}
