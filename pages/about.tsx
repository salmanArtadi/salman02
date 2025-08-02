// ================================================
// File: /pages/about.tsx
// ================================================
import Layout from '@/components/Layout';

export default function About() {
  return (
    <Layout title="About">
      <div className="flex justify-center items-center h-full">
        <div className="relative w-full max-w-lg p-6 rounded-lg shadow-xl bg-card text-card-foreground">
          <div className="absolute -top-4 left-4 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
            about
          </div>
          <div className="flex flex-col space-y-4 pt-4">
            <div className="p-4 rounded-md bg-secondary text-secondary-foreground">
              <h2 className="font-bold">salman | mischievous endavour</h2>
            </div>
            <div className="p-4 rounded-md bg-secondary text-secondary-foreground">
              <h2 className="font-bold">tma | human, logic, system in synergy.</h2>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
