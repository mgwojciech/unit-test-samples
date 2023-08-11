import * as React from "react";
import { Spinner, Persona, Link, PresenceBadgeStatus } from "@fluentui/react-components";
import { useM365 } from "../context/M365Context";
import { IUser } from "mgwdev-m365-helpers/lib/model/IUser";

export interface IHelloComponentProps {
    onUserLoaded?: (user: IUser) => void;
}

export function HelloComponent(props: IHelloComponentProps) {
    const { graphClient } = useM365();
    const [isLoading, setIsLoading] = React.useState(true);
    const [graphUser, setGraphUser] = React.useState<IUser>();

    const getData = async () => {
        const [user, presence, photo] = await Promise.all([
            graphClient.get("https://graph.microsoft.com/v1.0/me").then(r => r.json()),
            graphClient.get("https://graph.microsoft.com/v1.0/me/presnece").then(r => r.json()).catch(err=>({})),
            graphClient.get("https://graph.microsoft.com/v1.0/me/photo/$value").then(r => r.text()).catch(err=>null),
        ]);
        setGraphUser({
            ...user,
            presence,
            photo
        });
        props.onUserLoaded?.(user);
    }
    const getPresence = (presenceString?: string) => {
        switch (presenceString) {
            case "":
                return "none";
            case "Available":
                return "available";
            case "Busy":
                return "busy";
            case "Away":
                return "away";
            default:
                return presenceString?.toLowerCase() as PresenceBadgeStatus;
        }
    };

    React.useEffect(() => {
        getData().then(() => setIsLoading(false));
    }, []);

    return (
        <div >
            {isLoading ? (
                <Spinner />
            ) : (
                <Persona
                    {...props}
                    avatar={{
                        image: { src: "data:image/png;base64,".concat(graphUser?.photo?.replace("\"", "").replace("\"", "")) }
                    }}
                    name={graphUser!.displayName}
                    secondaryText={graphUser!.jobTitle}
                    presence={{ status: getPresence(graphUser!.presence?.availability) as PresenceBadgeStatus }}
                />
            )}
        </div>
    );
}
