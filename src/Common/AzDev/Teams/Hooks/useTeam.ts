import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";
import { getTeam, getTeamsStatus, ITeamAwareState, TeamActions } from "../Redux";

export function useTeam(teamIdOrName: string): { team: WebApiTeam | undefined; status: LoadStatus } {
    const mapState = useCallback(
        (state: ITeamAwareState) => {
            return {
                team: getTeam(state, teamIdOrName),
                status: getTeamsStatus(state)
            };
        },
        [teamIdOrName]
    );
    const { team, status } = useMappedState(mapState);
    const { loadTeams } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadTeams();
        }
    }, []);

    return { team, status };
}

const Actions = {
    loadTeams: TeamActions.loadRequested
};