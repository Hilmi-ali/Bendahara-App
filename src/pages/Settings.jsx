import {
  HiOutlineCog6Tooth,
  HiOutlineCommandLine,
  HiOutlineComputerDesktop,
  HiOutlineCpuChip,
  HiOutlineServerStack,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-emerald-400 shadow-sm ring-1 ring-slate-800">
            <HiOutlineCommandLine className="text-xl" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Pengaturan
              </h1>

              <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                CONFIG
              </span>
            </div>

            <p className="mt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400">
              ~/bendahara-app/config/system
            </p>
          </div>
        </div>
      </div>

      {/* System Terminal */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {/* Terminal Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

            <span className="ml-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              system@bendahara-app:~
            </span>
          </div>

          <span className="font-mono text-[10px] font-semibold text-emerald-500">
            ● ONLINE
          </span>
        </div>

        <div className="grid gap-3 border-t border-slate-200 p-4 dark:border-slate-700 sm:grid-cols-2 lg:grid-cols-4">
          <StatusItem
            icon={<HiOutlineComputerDesktop />}
            label="APPLICATION"
            value="Bendahara App"
          />

          <StatusItem
            icon={<HiOutlineServerStack />}
            label="BACKEND"
            value="Firebase / Firestore"
          />

          <StatusItem
            icon={<HiOutlineCpuChip />}
            label="ENVIRONMENT"
            value="Production"
          />

          <StatusItem
            icon={<HiOutlineShieldCheck />}
            label="SECURITY"
            value="Protected"
          />
        </div>
      </div>

      {/* Configuration */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bendahara Account */}
        <SettingsCard
          icon={<HiOutlineUserCircle />}
          title="Bendahara Account"
          description="// operational user credentials"
          accent="blue"
        >
          <ConfigRow label="AUTH_EMAIL" value="Rizki@gmail.com" />

          <ConfigRow label="ROLE" value="Bendahara" />

          <ConfigRow label="PASSWORD" value="Dipcip123" />

          <ConfigRow label="AUTH_STATUS" value="ACTIVE" status />
        </SettingsCard>

        {/* Application */}
        <SettingsCard
          icon={<HiOutlineCog6Tooth />}
          title="Application"
          description="// application runtime configuration"
        >
          <ConfigRow label="APP_NAME" value="Bendahara-App" />

          <ConfigRow label="VERSION" value="2.2.1" />

          <ConfigRow label="ENVIRONMENT" value="production" />

          <ConfigRow label="DATABASE" value="Firestore" />
        </SettingsCard>
      </div>
      <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm dark:border-amber-900/40 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50/70 px-5 py-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-amber-400">
              <HiOutlineWrenchScrewdriver className="text-lg" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Developer Access
                </h2>

                <span className="rounded-md border border-amber-300 bg-amber-100 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
                  PRIVATE
                </span>
              </div>

              <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                // application owner / master access
              </p>
            </div>
          </div>

          <HiOutlineShieldCheck className="hidden text-xl text-amber-500 sm:block" />
        </div>

        <div className="p-5">
          {/* Code-like developer block */}
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            {/* Code header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
              <span className="font-mono text-[10px] text-slate-500">
                developer.config.js
              </span>

              <span className="font-mono text-[9px] text-slate-600">
                READ_ONLY
              </span>
            </div>

            <div className="overflow-x-auto p-5 font-mono text-xs leading-7">
              <CodeLine
                number="01"
                code={
                  <>
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-400">developer</span>{" "}
                    <span className="text-slate-500">=</span>{" "}
                    <span className="text-yellow-300">{"{"}</span>
                  </>
                }
              />

              <CodeLine
                number="02"
                indent
                code={
                  <>
                    <span className="text-blue-300">email</span>
                    <span className="text-slate-500">:</span>{" "}
                    <span className="text-emerald-400">
                      &quot;ysl@proton.uk&quot;
                    </span>
                    <span className="text-slate-500">,</span>
                  </>
                }
              />

              <CodeLine
                number="03"
                indent
                code={
                  <>
                    <span className="text-blue-300">role</span>
                    <span className="text-slate-500">:</span>{" "}
                    <span className="text-emerald-400">
                      &quot;APP_OWNER&quot;
                    </span>
                    <span className="text-slate-500">,</span>
                  </>
                }
              />

              <CodeLine
                number="04"
                indent
                code={
                  <>
                    <span className="text-blue-300">access</span>
                    <span className="text-slate-500">:</span>{" "}
                    <span className="text-emerald-400">&quot;MASTER&quot;</span>
                    <span className="text-slate-500">,</span>
                  </>
                }
              />

              <CodeLine
                number="05"
                indent
                code={
                  <>
                    <span className="text-blue-300">password</span>
                    <span className="text-slate-500">:</span>{" "}
                    <span className="text-slate-500">[HIDDEN]</span>
                    <span className="text-slate-500">,</span>
                  </>
                }
              />

              <CodeLine
                number="06"
                indent
                code={
                  <>
                    <span className="text-blue-300">status</span>
                    <span className="text-slate-500">:</span>{" "}
                    <span className="text-green-400">
                      &quot;AUTHORIZED&quot;
                    </span>
                  </>
                }
              />

              <CodeLine
                number="07"
                code={
                  <>
                    <span className="text-yellow-300">{"}"}</span>
                    <span className="text-slate-500">;</span>
                  </>
                }
              />
              <div className="bg-slate-950 px-5 py-5 font-mono text-xs">
                <div className="space-y-1">
                  <p className="text-slate-500">
                    <span className="text-emerald-400">system</span>
                    <span className="text-slate-600">:</span> initializing...
                  </p>

                  <p className="text-slate-500">
                    <span className="text-emerald-400">system</span>
                    <span className="text-slate-600">:</span> loading
                    configuration
                  </p>

                  <p className="text-slate-500">
                    <span className="text-emerald-400">firebase</span>
                    <span className="text-slate-600">:</span>{" "}
                    <span className="text-blue-400">connected</span>
                  </p>

                  <p className="text-slate-500">
                    <span className="text-emerald-400">security</span>
                    <span className="text-slate-600">:</span>{" "}
                    <span className="text-green-400">protected</span>
                  </p>

                  <p className="pt-2 text-slate-400">
                    <span className="text-emerald-400">root@bendahara-app</span>
                    <span className="text-slate-600">:</span>
                    <span className="text-blue-400">~$</span>{" "}
                    <span className="text-white">system --status</span>
                  </p>

                  <p className="text-emerald-400">[OK] application ready_</p>
                </div>
              </div>

              <div className="mt-3 border-t border-slate-800 pt-3 text-slate-600">
                // credentials are intentionally not exposed
              </div>

              <div className="text-slate-600">// access level: restricted</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Footer */}
      <div className="flex flex-col items-center justify-center gap-1 pb-4">
        <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
          <span className="text-emerald-500">root</span>
          <span className="text-slate-300 dark:text-slate-700">@</span>
          bendahara-app
        </p>

        <p className="font-mono text-xs text-teal-600 dark:text-teal-400">
          DIPONEGORO
          <span className="mx-2 text-teal-600 dark:text-teal-400">|</span>
          School Finance
        </p>
      </div>
    </div>
  );
}

function StatusItem({ icon, label, value }) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="font-mono text-[9px] font-semibold tracking-widest text-slate-400">
          {label}
        </p>

        <p className="truncate font-mono text-xs font-medium text-slate-700 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

function SettingsCard({ icon, title, description, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 p-5 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-emerald-400 dark:bg-slate-800">
            {icon}
          </div>

          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>

            <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {children}
      </div>
    </div>
  );
}

function ConfigRow({ label, value, status = false }) {
  return (
    <div className="flex min-h-[58px] items-center justify-between gap-4 px-5 py-3">
      <span className="font-mono text-[10px] font-medium tracking-wider text-slate-400">
        {label}
      </span>

      {status ? (
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 font-mono text-[9px] font-bold tracking-wider text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          ● {value}
        </span>
      ) : (
        <span className="max-w-[65%] truncate text-right font-mono text-xs text-slate-700 dark:text-slate-300">
          {value}
        </span>
      )}
    </div>
  );
}

function CodeLine({ number, code, indent = false }) {
  return (
    <div className="flex whitespace-nowrap">
      <span className="mr-5 inline-block w-5 select-none text-right text-slate-700">
        {number}
      </span>

      <span className={indent ? "ml-5" : ""}>{code}</span>
    </div>
  );
}
