import { IHttpClient } from "mgwdev-m365-helpers/lib/dal/http/IHttpClient";
import * as React from "react";
import { Spinner, Persona, PersonaSize, PersonaPresence, Link } from "@fluentui/react";
import { IGraphUser } from "../model/IGraphUser";
import { ISPOHomeSite } from "../model/ISPOHomeSite";

export interface IHelloComponentProps {
    graphClient: IHttpClient;
    backendClient: IHttpClient;
}

export function HelloComponent(props: IHelloComponentProps) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [graphUser, setGraphUser] = React.useState<IGraphUser>();
    const [homeSite, setHomeSite] = React.useState<ISPOHomeSite>();

    const getData = async () => {
        const [user, presence, photo, homeSite] = await Promise.all([
            props.graphClient.get("https://graph.microsoft.com/v1.0/me").then(r => r.json()),
            props.graphClient.get("https://graph.microsoft.com/v1.0/me/presnece").then(r => r.json()),
            props.graphClient.get("https://graph.microsoft.com/v1.0/me/photo/$value").then(r => r.text()),
            props.backendClient.get("api/TenantHelper").then(r => r.json())
        ]);
        setGraphUser({
            ...user,
            presence,
            photo
        });
        setHomeSite(homeSite);
    }

    const getPresence = (presenceString: string) => {
        switch (presenceString) {
            case "":
                return PersonaPresence.none;
            case "Available":
                return PersonaPresence.online;
            case "Away":
                return PersonaPresence.away;
            case "Busy":
                return PersonaPresence.busy;
            default:
                return PersonaPresence.offline;
        }
    }

    React.useEffect(() => {
        getData().then(() => setIsLoading(false));
    }, []);


    if (isLoading) {
        return <Spinner />
    }
    if (graphUser && homeSite) {
        return <div>
            <Persona
                text={graphUser.displayName}
                tertiaryText={graphUser.presence.availability}
                secondaryText={graphUser.jobTitle}
                presence={getPresence(graphUser.presence.availability)}
                size={PersonaSize.size100}
                imageUrl={`data:image/png;base64,${graphUser.photo?.replace("\"", "").replace("\"", "")}`}
            />
            <Link href={homeSite.Url} target="_blank">{homeSite.Title}</Link>
        </div>

    }
    return <div>Something went wrong</div>
}
