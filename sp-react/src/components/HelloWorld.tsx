import * as React from "react";
import { useSPContext } from "../context/SPAppContext";
import { Spinner, Text } from "@fluentui/react-components";
import { SearchWeb } from "./SearchWeb";
import { SiteInfo } from "./SiteInfo";

export type HelloWorldComponentProps = {
}

export function HelloWorldComponent(props: HelloWorldComponentProps) {
    const { spContext, spClient, isContextLoaded } = useSPContext();

    return (
        <div>
            {!isContextLoaded && <Spinner />}
            <div>
                {isContextLoaded && <div>
                    <Text>{`Hello ${spContext?.userDisplayName}`}</Text>
                    <SiteInfo />
                </div>}
            </div>
            <div>
                {isContextLoaded && <SearchWeb
                    webId={spContext!.webId}
                    webUrl={spContext!.webAbsoluteUrl}
                    spHttpClient={spClient!} />}
            </div>
        </div>
    );
}