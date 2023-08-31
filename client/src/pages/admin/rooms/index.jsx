import Table from "../../../components/table";
import { useState } from "react";
import Modal from "../../../components/modal";
import { useUser } from "../../../context/user";
import { useEffect } from "react";
import moment from "moment";


export default function RoomsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const getRooms = async () => {
    setIsLoading(true);
    try {
      const datastore = window.catalyst.table.tableId("Rooms");
      const response = await datastore.getPagedRows({ max_rows: 100 });

      let rooms = response.content || [];
      rooms = rooms.map(({ NAME, ROWID, CREATEDBY, CREATEDTIME,LEVEL }) => ({
        id: ROWID,
        name: NAME,
        createdBy: CREATEDBY,
        createdAt: moment(CREATEDTIME).format("MMMM D, YYYY"),
        link: `/admin/room/${ROWID}/dashboard`
      }));
      setRooms(rooms);
    } catch (e) {
      console.log({e});
    } finally {
      setIsLoading(false);
    }
  };

  const { getUserDetails } = useUser();
  const userDetails = getUserDetails();

  const tableHeader = [
    { label: "Room ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Created By", key: "createdBy" },
    { label: "Created At", key: "createdAt" },
    { label: "Link", key: "link" }
  ];

  const tableMeta = {
    name: "Rooms",
    description:
      "Create a new room here and start playing.",
    addButton: "Add Room",
    handleAddAction: () => setModalOpen(true)
  };

  const createNewRoom = async (e) => {
    e.preventDefault();
    try {
      const datastore = window.catalyst.table.tableId("Rooms");
      const response = await datastore.addRow([
        { NAME: roomName, CREATEDBY: userDetails.email_id }
      ]);
      const isSuccess = response.status >= 200 && response.status < 300;
      const data = response.content[0];
      if (isSuccess) {
        setRooms([
          ...rooms,
          {
            id: data.ROWID,
            name: roomName,
            createdBy: data.CREATEDBY,
            createdAt: moment(data.CREATEDTIME).format("MMMM D, YYYY"),
            level: data.LEVEL,
            link: `/admin/room/${data.ROWID}/dashboard`
          }
        ]);
        setModalOpen(false);
        setRoomName("");
      } else {
        alert(response.message);
      }
    } catch (e) {
      console.log({ e });
    }
  };

  useEffect(() => {
    getRooms();
  }, []);
  return (
    <div className="py-4">
      <Table
        header={tableHeader}
        data={rooms}
        meta={tableMeta}
        showLoader={isLoading}
      />
      <Modal open={modalOpen} setOpen={setModalOpen}>
        <form onSubmit={createNewRoom}>
        <div className="text-md md:text-xl">
          <div className="mt-3 sm:mt-5">
            <div>
              <label
                htmlFor="roomName"
                className="text-sm font-medium leading-6 text-gray-900 "
              >
                Room Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="roomName"
                  id="roomName"
                  value={roomName}
                  required
                  onChange={(e) => setRoomName(e.target.value)}
                  className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter your room name"
                />
              </div>
            </div>
          </div>
        
        </div>
        <br />
        <div className="gap-6 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            Close
          </button>
        </div>
       </form>
      </Modal>
    </div>
  );
}
