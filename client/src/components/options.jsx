
export default function QuizOptions({ options }) {
  return (
    <fieldset>
      <legend className="sr-only">Options</legend>
      <div className="space-y-8">
        {options.map((option, index) => (
          <div key={index} className="relative flex items-start">
            <button class="inline-flex items-center text-xl font-bold justify-center w-9 h-9 mr-2 text-pink-100 transition-colors duration-150 bg-indigo-700 rounded-full focus:shadow-outline hover:bg-indigo-800">
              {option?.label && option?.label?.split(" ")[1]}
            </button>
            <div className="ml-3 leading-6 text-md md:text-lg lg:text-2xl">
              <label htmlFor={index} className="font-medium text-gray-300">
                {option?.key}
              </label>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
