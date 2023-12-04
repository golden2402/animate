"use client";
import { UserItemResponseModel } from "@/types/data-models";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState<UserItemResponseModel[]>([]);

  useEffect(() => {
    async function getAnime() {
      const response = await fetch(`/api/account/admin`);

      if (response.ok) {
        setUsers(await response.json());
      }
    }

    getAnime();
  }, []);
  return (
    <div className="flex items-center flex-col">
      {users.map((user, i) => {
        function makeAdmin() {
          const adminUsers: UserItemResponseModel[] = users.filter(
            (item: UserItemResponseModel) => {
              if (item.id === user.id) {
                item.admin = !item?.admin;
              }
              return item;
            }
          );
          setUsers(adminUsers);
        }
        return (
          <div key={i} className="flex flex-col">
            <h1 className="flex text-2xl mx-5 text-black font-semibold">
              {user.username}
            </h1>
            <button
              onClick={() => makeAdmin()}
              className={user.admin ? "bg-red-600" : "bg-green-600"}
            >
              <span className="text-2xl">
                {user.admin ? "Remove Admin" : "Make Admin"}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
