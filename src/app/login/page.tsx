import { XCircleIcon } from '@heroicons/react/20/solid'

export default async function Login({ searchParams }: { searchParams: Promise<{ has_error?: string }> }) {
  const { has_error } = await searchParams
  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center relative">
        {has_error ? <div className="absolute flex justify-center top-8 w-full">
          <div className="w-1/2 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="shrink-0">
                <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">The key you provided is invalid</h3>
              </div>
            </div>
          </div>
        </div> : null}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Welcome to MirrorChyan</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="/validate-key" method="POST" className="space-y-6">
            <div>
              <label htmlFor="key" className="block text-sm/6 font-medium">
                Your key
              </label>
              <div className="mt-2">
                <input
                  id="key"
                  name="key"
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base dark:text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Not a member?{' '}
            <a href="https://afdian.com/a/misteo" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Become a sponsor
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
