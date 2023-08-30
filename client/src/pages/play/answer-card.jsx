
  export default function AnswerCard({ quiz }) {
    return (
      <div>
            <p className="text-sm text-gray-500">{quiz?.question}</p>
       <br/>
        <fieldset className="mt-4">
          <legend className="sr-only">Notification method</legend>
          <div className="space-y-6">
            {quiz?.options.map((option,index) => (
              <div key={index} className="flex items-center">
                <input
                  id={index}
                  name="quiz"
                  type="radio"
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                />
                <label htmlFor={index} className="block ml-3 text-sm font-medium leading-6 ">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    )
  }