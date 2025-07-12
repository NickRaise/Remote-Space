import HeaderWithBack from "@/components/custom/header-with-back";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-custom-bg-dark-1 to-custom-bg-dark-2 text-custom-text-primary flex flex-col items-center">
      <nav className="bg-custom-bg-dark-1 w-full p-4 shadow-lg">
        <HeaderWithBack />
      </nav>
      {children}
    </div>
  );
}
