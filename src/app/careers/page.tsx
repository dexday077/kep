export default function CareersPage() {
  const jobs = [
    { id: 1, title: "Frontend Developer", location: "Remote", type: "Full-time" },
    { id: 2, title: "Backend Developer", location: "Remote", type: "Full-time" },
  ];
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-4">Kariyer</h1>
      <p className="text-gray-700 mb-6">Takımımıza katılmak ister misin? Açık pozisyonlar aşağıda.</p>
      <ul className="space-y-3">
        {jobs.map(job => (
          <li key={job.id} className="rounded-lg border border-gray-200 p-4 bg-white">
            <div className="font-semibold">{job.title}</div>
            <div className="text-sm text-gray-600">{job.location} • {job.type}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}


