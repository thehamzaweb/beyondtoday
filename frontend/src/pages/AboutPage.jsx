import { Link } from 'react-router-dom';
import { Code2, ShieldCheck, Network, Cpu, Database, PenLine } from 'lucide-react';

const topics = [
  { icon: Code2, label: 'Programming' },
  { icon: PenLine, label: 'Web Development' },
  { icon: Database, label: 'Backend & Databases' },
  { icon: ShieldCheck, label: 'Cybersecurity' },
  { icon: Network, label: 'Networking' },
  { icon: Cpu, label: 'AI & Machine Learning' },
];

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          About The Next Version
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          The Next Version is a simple technology blog created to share clear, practical
          knowledge about building software and understanding the technology that powers the
          modern world.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Purpose</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            We believe everyone should be able to learn technology step by step. Our articles
            are written to be approachable, focusing on real-world understanding rather than
            unnecessary jargon.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Topics We Cover</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {topics.map((t) => (
              <div
                key={t.label}
                className="card flex items-center gap-3 p-4"
              >
                <t.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <span className="font-medium text-gray-800 dark:text-gray-200">{t.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            To make technology approachable for everyone — one clear article at a time. We
            follow the simple idea:
          </p>
          <p className="mt-4 text-xl font-semibold italic text-indigo-600 dark:text-indigo-400">
            Learn. Build. Become Better.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About the Author</h2>
          <div className="card mt-5 flex items-start gap-4 p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
              TN
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">The Next Version Team</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                A developer who loves learning and sharing knowledge about programming,
                security, networking, and emerging technologies.
              </p>
              <Link
                to="/articles"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
              >
                Read the articles
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
