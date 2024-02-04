import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main>
      <section className="flex flex-col flex-grow-1 lg:flex-row items-center bg-[#2B2929] dark:bg-slate-800 -mt-[1px]">
        <div className="flex p-10 flex-col bg-[#2B2929] dark:bg-slate-800 text-white space-y-8 my-20">
          <h1 className="text-5xl font-bold">
            Securely collaborate on your content anywhere, anytime
          </h1>
          <p className="text-2xl">
            We provide safe file storage and sharing. That&apos;s it.
          </p>
          <Link
            className="flex gap-2 p-4 rounded-sm bg-blue-500 w-fit"
            href="/dashboard"
          >
            Get Started For Free <ArrowRight />
          </Link>
        </div>

        <div className="bg-[#1e1919] dark:bg-slate-800 h-full p-10">
          <video className="rounded-lg" autoPlay loop muted>
            <source
              src="https://aem.dropbox.com/cms/content/dam/dropbox/warp/en-us/overview/lp-header-graphite200-1920x1080.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>
    </main>
  );
}
