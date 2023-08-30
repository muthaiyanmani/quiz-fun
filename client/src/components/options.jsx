
const plans = [
    { id: 'small', name: 'Small', description: '4 GB RAM / 2 CPUS / 80 GB SSD Storage' },
    { id: 'medium', name: 'Medium', description: '8 GB RAM / 4 CPUS / 160 GB SSD Storage' },
    { id: 'large', name: 'Large', description: '16 GB RAM / 8 CPUS / 320 GB SSD Storage' },
  ]
  
export default function QuizOptions({ options }) {
    return (
      <fieldset>
        <legend className="sr-only">Options</legend>
        <div className="space-y-5">
          {options.map((option, index) => (
            <div key={index} className="relative flex items-start">
              <div className="flex items-center h-6">
                <input
                  id={index}
                  aria-describedby={`${index}-description`}
                  name="plan"
                  type="radio"
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                />
              </div>
              <div className="ml-3 leading-6 text-md md:text-lg lg:text-xl">
                <label htmlFor={index} className="font-medium text-gray-300">
                {option?.key}
                </label>
        
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    )
  }