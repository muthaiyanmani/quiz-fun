import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon
} from "@heroicons/react/24/outline";

export default function QuestionCard() {
  return (
    <form className="p-4 text-white">
      <div className="space-y-12">
        <div className="pb-12 border-b border-white/10">
          <h2 className="font-semibold leading-7 text-md md:text-lg">
            Question 1/5
          </h2>

          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-xl font-semibold leading-6 text-white md:text-2xl lg:text-5xl">
                Who is the prime minister of India?
              </legend>
             
            </fieldset>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-around mt-6 gap-x-6">
        <div className="text-white">
          <button
            type="button"
            className="inline-flex w-40 items-center justify-center gap-x-2 rounded-md bg-indigo-600 px-4 py-2.5 text-md text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <ArrowLeftCircleIcon className="w-8 h-8" aria-hidden="true" />
            Previous
          </button>
        </div>
        <div className="text-white">
          <button
            type="button"
            className="inline-flex w-40 items-center justify-center gap-x-2 rounded-md bg-indigo-600 px-4 py-2.5 text-md text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <ArrowRightCircleIcon className="w-8 h-8" aria-hidden="true" />
            Next
          </button>
        </div>
      </div>
    </form>
  );
}
