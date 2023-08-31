import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AnswerCard({ quiz, postAnswer }) {
  const [selectedMailingLists, setSelectedMailingLists] = useState(null);
  return (
    <div>
      <p className="">{quiz?.question}</p>
     
      <fieldset className="mt-4">
        <div className="space-y-6">
          <RadioGroup
            onChange={postAnswer}
          >
            <div className="grid grid-cols-1 mt-4 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              {quiz?.options?.map((item, index) => (
                <RadioGroup.Option
                  key={index}
                  value={item.label}
                  className={({ checked, active }) =>
                    classNames(
                      checked ? "border-transparent" : "border-gray-300",
                      active ? "border-indigo-600 ring-2 ring-indigo-600" : "",
                      "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                    )
                  }
                >
                  {({ checked, active }) => (
                    <>
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <RadioGroup.Label
                            as="span"
                            className="block w-64 text-sm font-medium text-gray-900"
                          >
                            {item.label}
                          </RadioGroup.Label>
                          
                        
                        </span>
                      </span>
                      <CheckCircleIcon
                        className={classNames(
                          !checked ? "invisible" : "",
                          "h-5 w-5 font-black text-indigo-600"
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={classNames(
                          active ? "border" : "border-2",
                          checked ? "border-indigo-600" : "border-transparent",
                          "pointer-events-none absolute -inset-px rounded-lg"
                        )}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      </fieldset>
    </div>
  );
}
