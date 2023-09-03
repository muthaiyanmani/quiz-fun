import { Link } from "react-router-dom";
import "./table.css";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from 'framer-motion';



export default function Table({ header = [], data = [], meta = {}, showLoader = false }) {
  const numberOfRows = 3;
  return (
    <div className="w-full px-4 mx-auto sm:px-6 lg:px-8 dark:bg-gray-900 dark:text-white">
      {
        meta?.name && (
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-medium leading-6">{meta.name}</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {meta.description}
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={meta.handleAddAction}
                className="block px-3 py-2 text-sm font-medium text-center bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 dark:bg-indigo-400 dark:hover:bg-indigo-500"
              >
                {meta.addButton}
              </button>
            </div>
          </div>
        )
      }
      <div className="flow-root mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg dark:ring-opacity-20">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {header.map((item, index) => (
                      <th
                        scope="col"
                        key={index}
                        className="px-3 py-3.5 text-left font-medium text-gray-900 dark:text-white"
                      >
                        {item.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-600">
                  {/* Loading Animation Styles */}
                  <AnimatePresence>
                  {showLoader ? (
                    Array(numberOfRows).fill().map((id, index) => (
                      <tr key={index}>
                        <td className="px-3 py-4 animate-pulse" colSpan={header.length}>
                          <SkeletonLoader key={index} noOfColoumns={header.length}/>
                        </td>
                      </tr>
                    ))
                  ) : (
                    /* Data Rows */
                    data.map((item) => (
                      <motion.tr
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {header.map((headerItem, index) => (
                          <td key={index} className="px-3 py-4 text-sm text-gray-400 md:text-md whitespace-nowrap">
                            {headerItem.key === 'link' ? <Link to={item[headerItem.key]}><ArrowTopRightOnSquareIcon className="inline w-4 h-4 font-bold" /> </Link> : item[headerItem.key]}
                          </td>
                        ))}
                      </motion.tr>
                    ))
                  )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}

const SkeletonLoader = ({ noOfColumns = 1 }) => (
  <tr>
    {Array(noOfColumns).fill().map((id, index) => (
      <td
        key={index}
        className="px-3 py-4 text-sm text-gray-500 md:text-md whitespace-nowrap skeleton none"
      ></td>
    ))}
  </tr>
);
