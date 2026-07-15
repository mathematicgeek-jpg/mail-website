import GamesAuthWrapper from "@/components/games/GamesAuthWrapper";

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <GamesAuthWrapper>
      {children}
    </GamesAuthWrapper>
  );
}
