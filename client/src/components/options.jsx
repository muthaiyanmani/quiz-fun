const plans = [
  {
    id: "small",
    name: "Small",
    description: "4 GB RAM / 2 CPUS / 80 GB SSD Storage"
  },
  {
    id: "medium",
    name: "Medium",
    description: "8 GB RAM / 4 CPUS / 160 GB SSD Storage"
  },
  {
    id: "large",
    name: "Large",
    description: "16 GB RAM / 8 CPUS / 320 GB SSD Storage"
  }
];

export default function QuizOptions({ options }) {
  console.log({options});
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
