import { Link } from "react-router-dom";
import "./table.css";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from 'framer-motion';



export default function Table({ header = [], data = [], meta = {}, showLoader = false }) {
  const numberOfRows = 3;
  return (
    <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
      {
        meta?.name && ( <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">{meta.name}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {meta.description}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={meta.handleAddAction}
            className="block px-3 py-2 text-sm font-semibold text-center text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {meta.addButton}
          </button>
        </div>
      </div>)
      }
      <div className="flow-root mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                <tr>
                  {header.map((item, index) => (
                    <th
                      scope="col"
                      key={index}
                      className="px-3 py-3.5 text-left font-semibold text-gray-900"
                    >
                      {item.label}
                    </th>
                  ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 ">
                  <AnimatePresence>
                  {showLoader ?
                    Array(numberOfRows).fill().map((id, index) => <SkeletonLoader key={index} noOfColoumns={header.length}/>) :
                    
                  data.map((item) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {header.map((headerItem, index) => (
                        <td key={index} className="px-3 py-4 text-sm text-gray-500 md:text-md whitespace-nowrap">
                          {headerItem.key === 'link' ?  <Link to={item[headerItem.key]}><ArrowTopRightOnSquareIcon className="inline w-4 h-4 font-bold"/> </Link> : item[headerItem.key]  }
                        </td>
                      ))}
                    </motion.tr>
                  ))
                }
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

const SkeletonLoader = ({noOfColoumns=1}) => (
    <tr>
      { Array(noOfColoumns).fill().map( (id, index) => (<td key={index} className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap skeleton none"></td>))}  
    </tr>
)