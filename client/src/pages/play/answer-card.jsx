import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AnswerCard({ quiz, postAnswer }) {
  return (
    <div className="p-4 px-8 md:p-8 quiz-card">
      <p className="">{quiz?.question}</p>
     
      <fieldset className="mt-4">
        <div className="space-y-6">
          <RadioGroup
            onChange={postAnswer}
          >
            <div className="grid grid-cols-1 mt-4 gap-y-6 md:gap-y-12 sm:grid-cols-2 sm:gap-x-8">
              {quiz?.options?.map((item, index) => (
                <RadioGroup.Option
                  key={index}
                  value={item.label}
                  className={({ checked, active }) =>
                    classNames(
                      "block w-full rounded-md border-0 bg-white/5 text-white shadow-sm ring-1 ring-inset ring-white/10",
                      active ? "border-indigo-600 ring-2 ring-indigo-600" : "",
                      "relative flex cursor-pointer rounded-lg border bg-white/5 ring-white/10 p-4 shadow-sm focus:outline-none"
                    )
                  }
                >
                  {({ checked, active }) => (
                    <>
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <RadioGroup.Label
                            as="span"
                            className="block w-64 text-sm font-medium text-gray-50"
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
