"use client";
import { api } from "@/lib/hono-client";
import { useQuery } from "@tanstack/react-query";

const Teams = () => {
  const {
    data: allTeams,
    isPending: isLoadingTeams,
    error,
  } = useQuery({
    queryKey: ["get-teams"],
    queryFn: async () => {
      const res = await api.teams[":id"].$get({
        param: {
          id: "5555",
        },
      });
      if (!res.ok) {
        const dd = await res.json();
        if ("message" in dd) {
          throw new Error(dd.message);
        } else {
          throw new Error(res.statusText);
        }
      }

      return await res.json();
    },
  });
  return (
    <div>
      {isLoadingTeams ? (
        <p>Loading Teams...</p>
      ) : allTeams ? (
        <div>
          {allTeams.info.name} - {allTeams.players.length}
        </div>
      ) : (
        <p>{error.message}</p>
      )}
    </div>
  );
};

export default Teams;
